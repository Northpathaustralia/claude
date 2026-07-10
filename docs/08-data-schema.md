# ATLAS ONE — Data Schema

## Local Edition (shipped): versioned localStorage documents

Two independent stores, exportable together as one backup file (`Settings → Export full backup`), each flat and JSON-serialisable. All ids are `prefix_timestamp36_random`; all dates ISO-8601 strings.

### `atlas.v1`

| Collection | Record shape |
|---|---|
| settings | `{keys:{provider→apiKey}, profile, provider, tone, voiceReplies, ownerName}` |
| conversations | `{id, title, projectId?, mode, messages:[{id, role, content, meta?, createdAt}], createdAt, updatedAt}` |
| ↳ message.meta | `{mode, model, modelLabel, routeReason, memoriesUsed[], knowledgeUsed[], specialists[], passes[], usage:{inputTokens,outputTokens}, cost?, demo, thinkingSummary?, kind?}` |
| projects | `{id, name, instructions, status, archived, createdAt, updatedAt}` |
| memories | `{id, category, text, createdAt}` — categories per directive (preferences, business info, brand, people, projects, facts, instructions, formats, goals) |
| knowledgeDocs | `{id, title, text, size, projectId?, addedAt}` (chunk index derived, not stored) |
| artifacts | `{id, title, type: markdown|html|csv|code, ext, content, engine, projectId?, createdAt}` |
| businesses | `{id, name, category, summary, nextAction, createdAt, updatedAt}` |
| financeEntries | `{id, business, month(YYYY-MM), revenue, expenses, note}` |
| usageLog | `{id, ts, model, mode, inputTokens, outputTokens, cost?}` (cap 1000) |
| activityLog | `{id, ts, kind, detail}` (cap 500) |

### `npaos.v1` (NorthPath workspace — unchanged from v0.1)

leads, partners, tasks, contentItems, appointments — HubSpot-friendly flat fields, documented in the NorthPath README section.

## Cloud Edition target (PostgreSQL)

Same entities, normalised; every table gets `owner_id` for multi-user, `created_at/updated_at`, soft-delete.

```sql
users(id, email, name, mfa_enabled, created_at)
provider_keys(id, user_id, provider, key_ciphertext, created_at)   -- AES-GCM, KMS-wrapped
projects(id, user_id, name, instructions, status, archived)
conversations(id, user_id, project_id, title, mode, created_at, updated_at)
messages(id, conversation_id, role, content, meta jsonb, created_at)
memories(id, user_id, category, text, created_at)
knowledge_docs(id, user_id, project_id, title, mime, storage_ref, text_extracted)
knowledge_chunks(id, doc_id, seq, text, embedding vector(1536))     -- pgvector
artifacts(id, user_id, project_id, title, type, ext, storage_ref, engine)
businesses(id, user_id, name, category, summary, next_action)
finance_entries(id, user_id, business_id, month, revenue_cents, expenses_cents, note)
usage_log(id, user_id, ts, model, mode, input_tokens, output_tokens, cost_micros)
activity_log(id, user_id, ts, kind, detail)
integration_tokens(id, user_id, connector, scopes[], token_ciphertext, expires_at)
```

Migration path: the export JSON maps 1:1 onto these tables; an importer is the first Cloud Edition milestone so no owner data is ever stranded.
