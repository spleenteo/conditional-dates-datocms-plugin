# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**condates** — A DatoCMS plugin that provides a field extension for entering historical/partial dates where year, month, and/or day may be unknown. It stores data as a JSON field with integer components: `{ year, month, day, era, circa }`.

Key behaviors:
- Year enables month, era, and circa. Month enables day. Cascading clear on parent removal.
- Era: "AD" (default) or "BC". Circa: boolean (default false). Year must be >= 1.
- Day validation is leap-year aware. Null JSON = empty field.
- The full shape spec is in `docs/shape/shaping.md`.

## Commands

- `npm run dev` — Start Vite dev server (use with DatoCMS plugin sandbox)
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally

No test runner or linter is configured.

## Architecture

This is a DatoCMS plugin built with React 18 + TypeScript + Vite, using `datocms-plugin-sdk` and `datocms-react-ui`.

### Entry flow

1. `index.html` loads `src/main.tsx`
2. `src/main.tsx` calls `connect()` from the SDK, registering plugin hooks (currently `renderConfigScreen`)
3. Each hook uses `src/utils/render.tsx` to render React components into the `#root` DOM element via `createRoot`

### Plugin hooks (defined in `src/main.tsx`)

The plugin registers hooks with `connect()`. Per the shape spec, the target hooks are:
- `manualFieldExtensions` — declares the JSON field extension
- `renderFieldExtension` — renders the date input UI
- `renderConfigScreen` — renders the config screen (informational, no global settings)

### Key conventions

- Entrypoint components live in `src/entrypoints/` (e.g., `ConfigScreen.tsx`)
- CSS modules are used for styling (`*.module.css`)
- Components receive `ctx` (SDK context object) as a prop
- Wrap all rendered components in `<Canvas ctx={ctx}>` from `datocms-react-ui`
- Vite config uses `base: './'` for relative asset paths (required for DatoCMS plugin hosting)
- TypeScript strict mode is enabled with `noUnusedLocals` and `noUnusedParameters`
