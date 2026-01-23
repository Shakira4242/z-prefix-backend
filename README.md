# z-prefix-backend

inventory api

## setup

1. `npm install`
2. create supabase project, run schema.sql in sql editor
3. `cp .env.example .env` and add your db url
4. `npm run dev`

runs on localhost:5001

## deploy (fly.io)

1. install fly cli: `brew install flyctl`
2. `fly auth login`
3. `fly launch` (creates app)
4. `fly secrets set DATABASE_URL="your_supabase_url"`
5. `fly deploy`

deployed at: https://zprefix-api-4242.fly.dev
