# 🎬 Movie GraphQL API

A simple **GraphQL API** for a movie watchlist, built with:

* [Prisma](https://www.prisma.io/) + SQLite for the database
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for GraphQL
* Modular **`.graphql` files** for schema definition
* TypeScript for type safety

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd prisma-graphql
npm install
```

### 2. Configure database

This project uses SQLite (local file).

`.env`:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma client & migrate schema

```bash
# Push schema to SQLite and create dev.db
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

This will create `dev.db` in your project root and generate a type-safe client.

### 4. Start the server

```bash
npm run dev
```

You should see:

```
🚀 GraphQL ready at http://localhost:4000/
```

---
