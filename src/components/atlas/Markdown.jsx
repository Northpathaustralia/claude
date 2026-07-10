import { useMemo } from 'react';
import { renderMarkdown } from '../../atlas/markdown.js';

/**
 * Safe markdown display. renderMarkdown() escapes ALL input before emitting
 * its own limited tag set, so this dangerouslySetInnerHTML cannot execute
 * injected script/HTML from model output or documents.
 */
export default function Markdown({ text, className = '' }) {
  const html = useMemo(() => renderMarkdown(text), [text]);
  return <div className={`md-body ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
