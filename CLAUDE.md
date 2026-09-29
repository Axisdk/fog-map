# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FogMap — an Angular 22 application built around `maplibre-gl` / `@maplibre/ngx-maplibre-gl` for interactive maps. The app is at an early scaffold stage: `App` (`src/app/app.ts`) is currently the only component and has no template content yet.

## Commands

- `npm start` / `ng serve` — run the dev server at `http://localhost:4200/`.
- `ng build` — production build to `dist/` (budgets: 500kB warn / 1MB error initial; 4kB warn / 8kB error per component stylesheet).
- `ng build --configuration development` (or `npm run watch`) — unoptimized build with source maps.
- `npm test` / `ng test` — run unit tests via the Vitest-based Angular unit-test builder.
  - To run a single test file, pass it through to Vitest, e.g. `ng test -- src/app/app.spec.ts`.
- `ng generate component <name>` — scaffold a new component (defaults to SCSS styles, per `angular.json`).

There is no configured lint script; `.prettierrc` (single quotes, 100-char width, Angular parser for `*.html`) governs formatting — format with `npx prettier --write <files>`.

## Architecture notes

- **Standalone, zoneless Angular.** There are no NgModules and no `zone.js` dependency. `main.ts` bootstraps `App` directly via `bootstrapApplication`, and `app.config.ts` wires app-wide providers (currently `provideBrowserGlobalErrorListeners()` and `provideRouter(routes)`). Change detection relies on signals/explicit reactivity, not Zone.js patching — keep new code zoneless-compatible.
- **Routing** is defined in `src/app/app.routes.ts` (empty `routes` array today); add routes here rather than inline in components.
- Components use the Angular CLI default of separate template/style files (`templateUrl`/`styleUrl` to `.html`/`.scss`), per the `@schematics/angular:component` config in `angular.json`.
- Map functionality should go through `@maplibre/ngx-maplibre-gl` (the Angular wrapper) rather than driving `maplibre-gl` directly from components, to stay consistent with the intended architecture.
