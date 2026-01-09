# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Database Setup

1. Create a `.env` file with your PostgreSQL connection string:
```bash
DATABASE_URL=postgresql://test:test@10.3.44.17:5432/simplifin
```

2. Push the schema to create tables:
```bash
npm run db:push
```

3. (Optional) View and manage tables:
```bash
npm run db:studio
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
