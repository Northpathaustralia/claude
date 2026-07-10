// ---------------------------------------------------------------------------
// Minimal, safe markdown renderer for model output.
// Every character is HTML-escaped BEFORE any markup is generated, so model
// (or document) content can never inject script/HTML — only the tags this
// renderer emits exist in the output. Supports the subset models actually
// produce: headings, bold/italic, inline + fenced code, lists, links,
// blockquotes, tables, hr.
// ---------------------------------------------------------------------------

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(escaped) {
  let s = escaped;
  // code spans first so other rules don't run inside them
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  // links: only http(s), and the URL was already escaped
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

/** Render markdown text to a safe HTML string. */
export function renderMarkdown(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let list = null; // 'ul' | 'ol' | null

  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];

    // fenced code block
    const fence = raw.match(/^```(\w*)\s*$/);
    if (fence) {
      closeList();
      const buf = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      const langCls = fence[1] ? ` class="lang-${escapeHtml(fence[1])}"` : '';
      out.push(`<pre><code${langCls}>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // table: header row + separator row
    if (/^\s*\|.+\|\s*$/.test(raw) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      closeList();
      const parseRow = (r) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => inline(escapeHtml(c.trim())));
      const header = parseRow(raw);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        rows.push(parseRow(lines[i]));
        i += 1;
      }
      out.push(
        `<table><thead><tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
      continue;
    }

    const line = raw;
    const esc = escapeHtml(line);

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length + 1; // h2..h5 so chat headings stay subordinate
      out.push(`<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      closeList();
      out.push('<hr/>');
      i += 1;
      continue;
    }

    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inline(escapeHtml((ul || ol)[1]))}</li>`);
      i += 1;
      continue;
    }

    if (/^\s*&gt;\s?/.test(esc)) {
      closeList();
      out.push(`<blockquote>${inline(esc.replace(/^\s*&gt;\s?/, ''))}</blockquote>`);
      i += 1;
      continue;
    }

    if (line.trim() === '') {
      closeList();
      i += 1;
      continue;
    }

    closeList();
    out.push(`<p>${inline(esc)}</p>`);
    i += 1;
  }

  closeList();
  return out.join('\n');
}
