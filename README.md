## Installation and startup

1. Clone this repository.
2. Install dependencies using pnpm/yarn/npm:

```
pnpm i
```

3. copy the .env.example file to .env

```
cp .env.example .env
```

4. Update the DB_URL in .env

5. Start the server:

```
pnpm dev
```

or build and run in production mode:

```
pnpm build && pnpm start
```

6. Access the GraphQL Playground at http://localhost:9000/graphql.
