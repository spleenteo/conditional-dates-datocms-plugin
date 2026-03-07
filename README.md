# Condates — Conditional Dates for DatoCMS

A DatoCMS plugin for entering historical or partial dates where some components (year, month, day) may be unknown.

Standard date fields require a complete date. When documenting historical events, artworks, archaeological finds, or any record with uncertain dating, editors often know only the year, or the year and month. Condates solves this by providing a conditional date editor that adapts to what the editor actually knows.

## Features

- **Partial dates** — enter just a year, year + month, or a full date
- **Cascading controls** — month unlocks only after year is set; day unlocks only after month is set
- **Era support** — CE (Common Era) or BCE (Before Common Era)
- **Circa flag** — mark a date as approximate
- **Leap-year validation** — day options adjust to the correct number of days for the selected month and year
- **Workflow-aware** — all controls respect DatoCMS field locking (`ctx.disabled`)

## Setup

1. Install the plugin on your DatoCMS project
2. Create a **JSON** field on your model
3. In the field's **Presentation** tab, select **Conditional Date** as the field editor

## Output

The field stores a JSON string with the following structure:

### Full date

```json
{"year": 1492, "month": 10, "day": 12, "era": "CE", "circa": false}
```

### Year only (approximate)

```json
{"year": 44, "month": null, "day": null, "era": "BCE", "circa": true}
```

### Year and month

```json
{"year": 2024, "month": 3, "day": null, "era": "CE", "circa": false}
```

### Empty field

```json
null
```

### Field reference

| Key | Type | Description |
|-----|------|-------------|
| `year` | `integer \| null` | Year value (minimum 1) |
| `month` | `integer \| null` | Month (1-12), requires year |
| `day` | `integer \| null` | Day (1-28/29/30/31), requires month |
| `era` | `"CE" \| "BCE" \| null` | Era indicator, requires year, defaults to CE |
| `circa` | `boolean \| null` | Whether the date is approximate, requires year |

All components except `year` are conditional — they are only set when their parent component is present. Clearing a parent cascades: clearing year resets everything to `null`; clearing month resets day to `null`.

The JSON value is queryable via GraphQL as a string. Date construction and formatting is left to the frontend consumer.

## Development

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + production build
npm run preview   # Preview production build
```