# Don't Spill the Tea

> [!IMPORTANT]
> This project has been archived and is no longer being developed. It was the
> project of our group during the _DAT257 Agile software project development_
> course. It is now used as the base for
> [Spill the Tea](https://github.com/ASmaller/spill-the-tea), the tea website
> for the Software Engineering Student Division (IT).

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

First, run the command below to install dependencies.

```bash
pnpm install
```

This will also create a `.env` file and generate the Prisma Client
automatically. However, this is a best-effort and you may need to generate the
Prisma client manually. To do so run this command:

```bash
pnpm prisma generate
```

Then run the development server:

```bash
pnpm dev
```

This will also do a few tasks automatically:

1. Run a development database and [Green Bite API](https://github.com/arienshibani/green-bite) instance with Docker compose
1. Update the database with the latest Prisma migrations

The compose file should be stopped automatically after the development server
is stopped. If it does not run this command manually:

```bash
docker compose down
```

If you want starter data in a fresh local database, run:

```bash
pnpm prisma db seed
```

Open <http://localhost:3000> with your browser to see the current website.

You can edit the page by modifying the files in `src/`. The page auto-updates as you edit.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Prisma

To work with Prisma you need to generate the Prisma client. You can do so by running:

```bash
pnpm prisma generate
```

> [!TIP]
> In this project this happens automatically when installing dependencies
> using the [`postinstall` script](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts).

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
pnpm prisma migrate dev --name add_table_for_thingy
```

## Deployment

Use the `compose.prod.yaml` file.
