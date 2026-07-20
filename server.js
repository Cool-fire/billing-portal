// billing-portal — requires the team's managed Postgres. There is no local
// fallback: the portal renders live invoice data only.
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set. billing-portal needs the managed Postgres');
  console.error('(credentials in the team vault); it cannot run without it.');
  process.exit(1);
}

const http = require('http');
const client = new Client({ connectionString: DATABASE_URL });

async function main() {
  await client.connect();
  const server = http.createServer(async (req, res) => {
    const { rows } = await client.query('SELECT id, customer, amount_cents FROM invoices ORDER BY id DESC LIMIT 20');
    const body = rows
      .map((r) => `<tr><td>${r.id}</td><td>${r.customer}</td><td>$${(r.amount_cents / 100).toFixed(2)}</td></tr>`)
      .join('');
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`<!doctype html><html><head><title>Billing Portal — Invoices</title></head><body><h1>Billing Portal — Invoices</h1><table>${body}</table></body></html>`);
  });
  server.listen(Number(process.env.PORT || 4800), () => console.log('billing-portal up'));
}

main().catch((err) => {
  console.error('FATAL: could not reach the managed Postgres:', err.message);
  process.exit(1);
});
