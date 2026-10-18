This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Reservations database

Reservations are stored in Neon Postgres through the server-only `DATABASE_URL`
environment variable. Run `db/schema.sql` in the Neon SQL Editor before starting
the app. Do not use a `NEXT_PUBLIC_` variable for the database connection string.

To migrate the existing Google Sheet, download the `Reservations` sheet as a CSV
and run:

```bash
DATABASE_URL="postgresql://..." npm run import:reservations -- ./Reservations.csv
```

After verifying the imported rows in Neon, disable or delete the old Google Apps
Script deployment so the sheet is no longer a public data store.

## Google Sheets sync (private)

The Google Sheet is a read-only mirror kept in sync from Neon. After a
reservation is inserted, the API route appends the same row to the sheet via the
Google Sheets API using a service account. There is no public webhook endpoint,
so the sheet stays private.

Setup:

1. In Google Cloud, create a project and enable the **Google Sheets API**.
2. Create a **service account** and add a **JSON key**.
3. Share the Google Sheet with the service account `client_email` as **Editor**.
4. Store config in `.env.local` (and the deployment environment):

   ```bash
   # Base64-encode the whole service account JSON file
   GOOGLE_SERVICE_ACCOUNT_B64="$(base64 -i service-account.json | tr -d '\n')"
   SHEET_ID="<spreadsheet id from the sheet URL>"
   ```

The sync is best-effort: if the Sheets API call fails, the reservation is still
saved in Neon and the error is logged. Never commit the service account JSON.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
