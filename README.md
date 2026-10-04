# AFTERHOURS 1.0

Marketing and registration site for **AFTERHOURS 1.0** — a 24-hour inter-college hackathon on 30–31 October 2026 at DBIT, organised by the AWS Student Builder Group.

Live at **[awsevents.dbit.edu.in](https://awsevents.dbit.edu.in/afterhours-1.0/)**

## Stack

- [TanStack Start](https://tanstack.com/start) (React SSR framework)
- [Vite](https://vite.dev/) (bundler)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) (Framer Motion) + [GSAP](https://gsap.com/) for animations
- [Supabase](https://supabase.com/) (CMS / content storage)
- TypeScript throughout

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deployment

Pushes to `main` trigger an automatic deploy to the production server via GitHub Actions (`.github/workflows/main.yml`). The workflow:

1. Syncs source to the AWS EC2 instance via rsync
2. Runs `npm ci && npm run build` on the server
3. Restarts the `afterhours` systemd service

No manual deploy steps are needed — merge to `main` and it ships.
