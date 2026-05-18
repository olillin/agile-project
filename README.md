# Don't Spill the Tea

Welcome to _Don't Spill the Tea_, a solution for reducing food waste by
simplifying the collection of feedback about school lunches from students.

For setting up your own instance, see [SETUP.md](./SETUP.md).

For developing, continue reading below.

## Prerequisites

This project uses these tools:

- [Node.js 24](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- [Docker Compose](https://docs.docker.com/compose/install)

If using [Nix](https://nixos.org), simply run `nix develop` to install these.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

And generate the Prisma Client:

```bash
pnpm prisma generate
```

Then run the development server:

```bash
pnpm dev
```

This will also run a development database in the background using Docker Compose.
To stop the database, run:

```bash
docker compose down
```

If you want starter data in a fresh local database, run:

```bash
pnpm prisma db seed
```

Open <http://localhost:3000> with your browser to see the current website.

You can edit the page by modifying the files in `src/app`. The page auto-updates as you edit.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Prisma

To work with Prisma you need to generate the Prisma client. You can do so by running:

```bash
pnpm prisma generate
```

Then you can import the Prisma Client in your code:

```typescript
import { prisma } from "@/lib/prisma";
```

See the official Prisma Client documentation for how to write queries with Prisma: <https://www.prisma.io/docs/orm/prisma-client/queries/crud>.

#### Updating the Schema

See [Overview of Prisma Schema](https://www.prisma.io/docs/orm/prisma-schema/overview) for the schema syntax.
After modification you can run [`pnpm prisma db push`](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-push) to test the new schema in the database.
Remember to regenerate the Prisma Client afterwards with [`pnpm prisma generate`](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#generate).

When you are done you can create a migration with the [migrate](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-dev) command:

```bash
pnpm prisma migrate dev --name add_lorem_ipsum_example
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Use the `compose.prod.yaml` file.
