---
shaping: true
---

# Conditional Dates Plugin — Shaping

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Allow editors to enter historical/partial dates where year, month, and/or day may be unknown | Core goal |
| R1 | Year is not mandatory overall, but is required to enable month, circa, and era. Month is required to enable day. Clearing a parent cascades (clearing month clears day; clearing year clears month, day, circa, and era) | Must-have |
| R2 | An era toggle (B.C. / A.D.) indicates whether the date is before or after year 0, defaulting to A.D. | Must-have |
| R3 | A "Circa" boolean (default false) indicates the date is approximate | Must-have |
| R4 | All date components are stored as integers (not as a native date type). Year must be ≥ 1; era is handled by the B.C./A.D. toggle (no year 0). The entire field can be null (no value) | Must-have |
| R5 | The fields are displayed inline (side by side) in the editor UI | Must-have |
| R6 | The plugin is a DatoCMS field extension (JSON field type), similar to the working-schedule-day plugin pattern | Must-have |
| R7 | Day validation respects the number of days in the selected month, including leap years (Feb 29) | Must-have |
| R8 | The stored value is queryable via GraphQL as individual components; aggregated date construction is left to the frontend consumer | Must-have |
| R9 | The plugin is deployed to static hosting (e.g. Vercel) and published to the DatoCMS Plugin Marketplace from the start | Must-have |

---

## Selected Shape: A — Linear form controls

| Part | Mechanism |
|------|-----------|
| **A1** | Manual field extension (`type: 'editor'`, `fieldTypes: ['json']`). JSON stores `{ year: int\|null, month: int\|null, day: int\|null, era: "AD"\|"BC"\|null, circa: bool\|null }`. Null JSON = empty field |
| **A2** | Year: number input (free type, min 1). Month: `<select>` (1-12, disabled until year). Day: `<select>` (1-N per month, disabled until month). Layout: `[Year] [Month] [Day] [Era] [Circa]` |
| **A3** | Era: `<select>` (A.D./B.C., disabled until year, defaults to A.D.) |
| **A4** | Circa: checkbox (disabled until year, defaults to false) |
| **A5** | Cascading clear: clearing year nullifies all other fields; clearing month nullifies day |
| **A6** | Day validation: max days computed from month + year (leap-year aware). If current day exceeds new max, auto-clear day |
| **A7** | All inputs respect `ctx.disabled` (field locked by workflow/permissions) |
| **A8** | Informational config screen (no global settings). Hooks: `manualFieldExtensions`, `renderFieldExtension`, `renderConfigScreen` |
| **A9** | Deploy to Vercel, register on DatoCMS Marketplace |

## Fit Check: R × A

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Allow editors to enter historical/partial dates where year, month, and/or day may be unknown | Core goal | ✅ |
| R1 | Year not mandatory overall but required to enable month, circa, era. Cascading clear | Must-have | ✅ |
| R2 | Era toggle (B.C. / A.D.), defaults to A.D. | Must-have | ✅ |
| R3 | Circa boolean, defaults to false | Must-have | ✅ |
| R4 | Stored as integers, year ≥ 1, no year 0, field can be null | Must-have | ✅ |
| R5 | Fields displayed inline | Must-have | ✅ |
| R6 | DatoCMS field extension (JSON field type) | Must-have | ✅ |
| R7 | Day validation with leap years | Must-have | ✅ |
| R8 | Queryable via GraphQL as individual components | Must-have | ✅ |
| R9 | Deployed to Vercel, published to Marketplace | Must-have | ✅ |
