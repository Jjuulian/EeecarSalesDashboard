## Repo overview (quick)

- Framework: Angular CLI (v21.1.5). See `angular.json` for build/serve/test targets.
- Source root: `src/`. Static assets served from `public/` (see `angular.json` -> `assets`).
- Package manager: `npm` (package.json lists `npm@11.9.0`).
- Build/test tooling: `ng build`, `ng serve` (dev server), `ng test` (Vitest via Angular builder).

## Key architectural notes (what an AI agent needs to know)

- App bootstrap: `src/main.ts` -> application configured via `src/app/app.config.ts` which provides router and global error listeners.
- Routing: `src/app/app.routes.ts` exports `routes` (currently empty). Router is provided with `provideRouter(routes)`.
- Component style: components use the modern, standalone-style APIs: `@Component({ imports: [...], templateUrl, styleUrl })` and the code uses `signal()` from `@angular/core` (see `src/app/app.ts`).
- Templates: `src/app/app.html` uses Angular's modern control-flow and template sugar (e.g. `@for`) and contains placeholder UI — replace for feature work.
- Global styles: Tailwind is enabled — `src/styles.css` imports `tailwindcss`. PostCSS/Tailwind dev deps are present in `package.json`.

## Common commands (explicit)

Use the npm scripts in `package.json`:

```
npm start       # runs `ng serve` (development dev-server)
npm run build   # runs `ng build` (production by default)
npm run watch   # incremental build in development
npm test        # runs `ng test` (Vitest via Angular builder)
```

Notes: `ng e2e` is available as an Angular CLI task but no e2e framework is included by default.

## Project-specific conventions and patterns

- Standalone / modern APIs: expect components and the app to use Angular's standalone patterns: `imports` in components, `ApplicationConfig` for providers, signals for reactive state.
- Router is provided globally via `app.config.ts` — prefer adding route entries to `src/app/app.routes.ts` rather than bootstrapping router elsewhere.
- Static assets and icons live in `public/` (mirrors `angular.json` assets config).
- Styling: Tailwind is configured by importing into `src/styles.css`; place Tailwind utility usage in component templates or `src/styles.css`.

## Where to look when changing behavior

- App root: `src/app/app.ts`, `src/app/app.html`, `src/app/app.config.ts`.
- Routes: `src/app/app.routes.ts`.
- Build config / targets: `angular.json`.
- Scripts & deps: `package.json` (includes Angular v21 packages and dev tooling like `vitest`, `tailwindcss`).

## Testing and local verification

- Unit tests: `npm test` (uses Angular's `@angular/build:unit-test` builder which in this repo invokes Vitest). Check `src/**/*.spec.ts` to add unit tests.
- Local dev server: `npm start` then open `http://localhost:4200/`.

## Integration points / external deps

- No backend code in this repo; integration points would be added via services that call external APIs. Search for HTTP usage (none by default).
- Tailwind/PostCSS present — verify `postcss` config if adding custom plugins.

## Minimal examples to follow

- Add a route: edit `src/app/app.routes.ts` and register with `provideRouter(routes)` in `src/app/app.config.ts`.
- Use signals: follow `src/app/app.ts` which uses `signal('...')` for simple reactive state.

---
If anything important is missing or you want me to include automated checks, CI examples, or adjust style/test guidance, tell me which area to expand.
