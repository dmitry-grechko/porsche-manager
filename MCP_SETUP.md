# FLAT·SIX MCP Server

FLAT·SIX exposes a real **Streamable-HTTP MCP server** so you can drive your 981
garage from Claude — look up specs and fault codes, search the OEM parts catalog,
and (with auth) read and write your own service history.

- **Endpoint:** `/api/mcp`
  - Local: `http://localhost:3000/api/mcp`
  - Deployed: `https://<your-vercel-domain>/api/mcp`
- **Transport:** HTTP (Streamable). Built on [`mcp-handler`](https://github.com/vercel/mcp-handler) `v1.1.0`.
- **Auth:** `Authorization: Bearer <token>`, where the token is your **Supabase
  access token**. Knowledge tools work with **no token**; garage tools require one.

Get your token from the app: **Settings → CLAUDE / MCP INTEGRATION → TOKEN**
(Show, then Copy). It expires in ~1 hour — re-copy after it refreshes.

---

## Tools

### Open (no auth)
| Tool | Purpose |
| --- | --- |
| `search_981_knowledge` | Full-text search across the 981 knowledge base (faults, specs, maintenance, known issues, articles). |
| `lookup_fault_code` | Resolve an OBD / fault code (e.g. `P0011`) to meaning, causes and fixes. |
| `get_spec` | Look up a torque value, capacity, fluid grade or other spec. |
| `get_maintenance_schedule` | List maintenance items, optionally filtered by system or due mileage. |
| `list_known_issues` | List documented 981 weak points, optionally by system. |
| `find_part` | Search the OEM parts catalog (name / part number / keyword) for part numbers and torque. |

### Authenticated (Bearer token required, RLS-scoped to you)
| Tool | Purpose |
| --- | --- |
| `get_my_vehicles` | List the vehicles in your garage. |
| `get_service_history` | List service records for a vehicle (defaults to your primary vehicle). |
| `log_service_record` | Add a service record to a vehicle. |

If a garage tool is called without a valid token it returns a clear "connect with
a Bearer token" message; the open tools keep working regardless.

---

## Connect from Claude Code

With auth (all tools):
```bash
claude mcp add --transport http flatsix \
  http://localhost:3000/api/mcp \
  --header "Authorization: Bearer <token>"
```

Deployed variant:
```bash
claude mcp add --transport http flatsix \
  https://<your-vercel-domain>/api/mcp \
  --header "Authorization: Bearer <token>"
```

Knowledge tools only (no token needed):
```bash
claude mcp add --transport http flatsix http://localhost:3000/api/mcp
```

Verify with `claude mcp list`, then ask Claude e.g. *"what's the wheel bolt torque
on a 981?"* (open) or *"log an oil change on my Boxster at 43,000 miles"* (auth).

---

## Connect from Claude Desktop / claude.ai

Add a **custom connector / remote MCP server** pointing at the endpoint:

- Settings → Connectors → Add custom connector → URL = `https://<your-vercel-domain>/api/mcp`.
- These surfaces generally need the **deployed HTTPS URL** (not `localhost`).
- They favour OAuth over a static Bearer header, so the **authenticated** garage
  tools are best tested from **Claude Code** (which supports `--header`) or the
  **MCP Inspector** (below). The open knowledge tools work without any header.

---

## Local testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:
1. Transport: **Streamable HTTP**
2. URL: `http://localhost:3000/api/mcp`
3. (Optional) add an `Authorization` header `Bearer <token>` to exercise the
   garage tools.
4. Connect → list tools → call them.

---

## How auth works (implementation note)

- The route (`app/api/[transport]/route.ts`) wraps the handler with
  `withMcpAuth(handler, verifyToken, { required: false })`.
- `verifyToken` passes the incoming Bearer token straight through as
  `authInfo.token` without validating it (so open tools stay reachable).
- Garage tools read `extra.authInfo?.token`, then `lib/mcp/auth.ts → resolveUser`
  builds a Supabase client with `Authorization: Bearer <token>` and calls
  `auth.getUser(token)`. Postgres **Row Level Security** then scopes every
  read/write to that user. An invalid/expired token resolves to no user → the
  tool returns the "authenticate" error.

## Caveat & future work

Supabase access tokens are short-lived (~1 hour). For a smoother experience you
could add a **long-lived personal access token** table (hashed PATs mapped to a
user id) and have `resolveUser` accept either a Supabase JWT or a PAT — then a
connector wouldn't need re-pasting an expiring token.
