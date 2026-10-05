# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FogMap — an Angular 22 application built around `maplibre-gl` / `@maplibre/ngx-maplibre-gl` for interactive maps. The app is at an early scaffold stage: `App` (`src/app/app.ts`) is currently the only component and has no template content yet.

### Story / product vision

Working title **"Explore the City"** ("Explore the city. Reveal your world."). The app turns real-world city walks into exploration of a map hidden under fog: the user's GPS track is recorded during a walk, and fog clears along the _actual path walked_ (not a circle around the current position). Over time the revealed map becomes a personal record of the places a user has walked.

Key principles: exploration over competition (no leaderboards/scoring focus), progress tied to real walks, a personal map per user, privacy by default (routes/location not public without explicit action), and building the core "fog" mechanic first before adding social/game features.

MVP scope (see `.claude/docs/product-vision.md` for the full doc): interactive map, fog over unexplored territory, current-location display, start/end-walk flow, GPS track recording during an active walk, progressive reveal along the route, local persistence between sessions, basic stats on explored area. A click-to-reveal test mode on the map is acceptable for prototyping the fog visualization before GPS is wired up.

Explicitly out of scope for now (V1/Future, not MVP): user profiles, a shared map for two people, cross-device sync, achievements/challenges, place collections, social features, backend/cloud sync, continuous background location tracking. Don't build toward these without an explicit decision — implement the smallest working vertical slice (the fog mechanic) first.

## Commands

- `npm start` / `ng serve` — run the dev server at `http://localhost:4200/`.
- `ng build` — production build to `dist/` (budgets: 500kB warn / 1MB error initial; 4kB warn / 8kB error per component stylesheet).
- `ng build --configuration development` (or `npm run watch`) — unoptimized build with source maps.
- `npm test` / `ng test` — run unit tests via the Vitest-based Angular unit-test builder.
  - To run a single test file, pass it through to Vitest, e.g. `ng test -- src/app/app.spec.ts`.
- `ng generate component <name>` — scaffold a new component (defaults to SCSS styles, per `angular.json`).
- `npm run lint` / `ng lint` — run ESLint (`@angular-eslint` flat config in `eslint.config.js`) over `src/**/*.ts` and `src/**/*.html`.
- `npm run format` — format the whole project with Prettier; `npm run format:check` checks without writing.

`.prettierrc` (single quotes, 100-char width, Angular parser for `*.html`) governs formatting; `eslint-config-prettier` disables ESLint stylistic rules that would conflict with it.

## Architecture notes

- **Standalone, zoneless Angular.** There are no NgModules and no `zone.js` dependency. `main.ts` bootstraps `App` directly via `bootstrapApplication`, and `app.config.ts` wires app-wide providers (currently `provideBrowserGlobalErrorListeners()` and `provideRouter(routes)`). Change detection relies on signals/explicit reactivity, not Zone.js patching — keep new code zoneless-compatible.
- **Routing** is defined in `src/app/app.routes.ts` (empty `routes` array today); add routes here rather than inline in components.
- Components use the Angular CLI default of separate template/style files (`templateUrl`/`styleUrl` to `.html`/`.scss`), per the `@schematics/angular:component` config in `angular.json`.
- Map functionality should go through `@maplibre/ngx-maplibre-gl` (the Angular wrapper) rather than driving `maplibre-gl` directly from components, to stay consistent with the intended architecture.

## Map library (`@maplibre/ngx-maplibre-gl`)

Installed: `@maplibre/ngx-maplibre-gl@22.1.0` wrapping `maplibre-gl@6.11.2`. Standalone components/directives, no NgModule needed for individual imports (`NgxMapLibreGLModule` exists as a convenience bundle).

**Not yet wired up — required before any map will render:**

- Import `maplibre-gl/dist/maplibre-gl.css` (add to `styles` in `angular.json`, or `@import` it in `src/styles.scss`).
- maplibre-gl v6 is ESM-only and loads its web worker from a separate file at runtime; bundlers can't rewrite that URL. Copy `maplibre-gl-worker.mjs` and `maplibre-gl-shared.mjs` from `node_modules/maplibre-gl/dist` into `assets` in `angular.json`, then call `provideMaplibreWorker('maplibre-gl-worker.mjs')` (from `@maplibre/ngx-maplibre-gl/config`) in `app.config.ts`. Without this the worker 404s and **no tiles render** — see the package README for the exact `angular.json` snippet.

**Building blocks relevant to the fog/exploration mechanic:**

- `<mgl-map>` (`DashboardComponent`) — the map container; camera inputs (`zoom`, `center`, `pitch`, `bearing`) are plain numbers and support two-way binding (`[(zoom)]`).
- `mglGeolocate` (`GeolocateControlDirective`) — current-location tracking/display.
- `mgl-marker` (`MarkerComponent`) — render the user's current position.
- `<mgl-control mglNavigation>` — zoom/compass controls.
- A `GeoJSONSourceComponent` + `LayerComponent` pair is the natural fit for the fog overlay itself (a polygon/mask layer that gets updated as territory is revealed) and for the recorded GPS route.

Full API reference: https://maplibre.org/ngx-maplibre-gl/API/
