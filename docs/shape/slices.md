---
shaping: true
---

# Conditional Dates Plugin — Slices

## Slice Overview

| Slice | Title | Demo |
|-------|-------|------|
| V1 | Year input with JSON persistence | Apply plugin to JSON field, type a year, save, reload — value persists |
| V2 | Full date cascade with validation | Full conditional date entry: year → month/era/circa → day, cascading clear, day validation |
| V3 | Polish and Marketplace deployment | Plugin live on Marketplace, installable on any DatoCMS project |

---

## V1: Year input with JSON persistence

### Affordances

| # | Affordance | Type | Place |
|---|-----------|------|-------|
| 1 | Year number input (min 1, free type) | UI | Field extension iframe |
| 2 | JSON read: `get(ctx.formValues, ctx.fieldPath)` | Non-UI | Field extension component |
| 3 | JSON write: `ctx.setFieldValue(ctx.fieldPath, value)` | Non-UI | Field extension component |
| 4 | `manualFieldExtensions` declaration (id, name, type: editor, fieldTypes: [json]) | Non-UI | connect() entry |
| 5 | `renderFieldExtension` switch on extension id | Non-UI | connect() entry |
| 6 | Canvas wrapper with auto-resizer | UI | Field extension component |

### Stored value

```json
{ "year": 1492 }
```

When empty: `null`

### What to build

1. Scaffold plugin project: `datocms-plugin-sdk`, `datocms-react-ui`, React, Vite
2. Entry file (`src/main.tsx`): `connect()` with `manualFieldExtensions` + `renderFieldExtension`
3. Component (`src/entrypoints/ConditionalDateEditor.tsx`): Canvas + year input
4. Read current JSON value, write back on change
5. Render helper (`src/utils/render.tsx`)

---

## V2: Full date cascade with validation

### Affordances

| # | Affordance | Type | Place |
|---|-----------|------|-------|
| 1 | Month `<select>` (1-12), disabled until year is set | UI | Field extension iframe |
| 2 | Day `<select>` (1-N), disabled until month is set | UI | Field extension iframe |
| 3 | Era `<select>` (A.D. / B.C.), disabled until year is set, defaults to A.D. | UI | Field extension iframe |
| 4 | Circa checkbox, disabled until year is set, defaults to false | UI | Field extension iframe |
| 5 | Inline layout: all controls on one row | UI | Field extension iframe |
| 6 | Cascading clear: clear year → nullify month, day, era, circa. Clear month → nullify day | Non-UI | Field extension component |
| 7 | Day max computation from month + year (leap-year aware). Auto-clear day if exceeds new max | Non-UI | Field extension component |

### Stored value

```json
{ "year": 44, "month": 3, "day": 15, "era": "BC", "circa": true }
```

Partial example (year + month only):

```json
{ "year": 1492, "month": 10, "day": null, "era": "AD", "circa": false }
```

### What to build

1. Add month select, day select, era select, circa checkbox to the component
2. Conditional disabled states based on parent values
3. Cascading clear logic
4. `getDaysInMonth(month, year)` utility (leap-year aware)
5. Auto-clear day when it exceeds new max after month/year change
6. Inline flex layout for all controls

---

## V3: Polish and Marketplace deployment

### Affordances

| # | Affordance | Type | Place |
|---|-----------|------|-------|
| 1 | All inputs respect `ctx.disabled` | UI | Field extension iframe |
| 2 | Informational config screen | UI | Plugin settings page |
| 3 | `renderConfigScreen` hook | Non-UI | connect() entry |
| 4 | Vercel deployment | Non-UI | Hosting |
| 5 | DatoCMS Marketplace registration | Non-UI | DatoCMS |

### What to build

1. Add `ctx.disabled` guard to all inputs (year, month, day, era, circa)
2. Config screen component: usage instructions, no settings
3. Add `renderConfigScreen` to `connect()`
4. Deploy to Vercel (static build)
5. Register plugin on DatoCMS Marketplace with URL
