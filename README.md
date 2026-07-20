# billing-portal

Internal billing portal. Renders live invoice data from the team's managed
Postgres — there is no seed data or local fallback.

## Development

```bash
npm install
DATABASE_URL=<from the team vault> npm run dev   # http://localhost:4800
```

Without a real `DATABASE_URL` the server refuses to start.

## Tests

```bash
npm test
```
