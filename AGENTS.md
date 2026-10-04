# AFTERHOURS 1.0 — Agent Guidelines

> [!IMPORTANT]
> Avoid rewriting published git history — force pushing, or
> rebasing/amending/squashing commits that are already pushed — as it will
> disrupt the deploy pipeline.
>
> Keep the `main` branch in a working state at all times; pushes to `main`
> trigger an automatic build and deploy to production via GitHub Actions.
