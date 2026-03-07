import { type RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import { get } from "../utils/get";
import { getDaysInMonth } from "../utils/getDaysInMonth";
import s from "./styles.module.css";

type DateValue = {
	year: number | null;
	month: number | null;
	day: number | null;
	era: "AD" | "BC" | null;
	circa: boolean | null;
};

type Props = {
	ctx: RenderFieldExtensionCtx;
};

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

export default function ConditionalDateEditor({ ctx }: Props) {
	const value = get(ctx.formValues, ctx.fieldPath) as DateValue | null;
	const year = value?.year ?? null;
	const month = value?.month ?? null;
	const day = value?.day ?? null;
	const era = value?.era ?? null;
	const circa = value?.circa ?? null;

	const hasYear = year !== null;
	const hasMonth = month !== null;
	const disabled = ctx.disabled;

	const maxDays = hasYear && hasMonth ? getDaysInMonth(month, year) : 31;

	function update(patch: Partial<DateValue>) {
		const next = { ...value, ...patch };

		// If everything is null, store null
		if (next.year == null && next.month == null && next.day == null && next.era == null && next.circa == null) {
			ctx.setFieldValue(ctx.fieldPath, null);
			return;
		}

		ctx.setFieldValue(ctx.fieldPath, next);
	}

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;

		if (raw === "") {
			// Cascading clear: year cleared → clear everything
			ctx.setFieldValue(ctx.fieldPath, null);
			return;
		}

		const parsed = parseInt(raw, 10);
		if (isNaN(parsed) || parsed < 1) return;

		const patch: Partial<DateValue> = { year: parsed };

		// Set defaults for era and circa when year is first entered
		if (!hasYear) {
			patch.era = "AD";
			patch.circa = false;
		}

		// Auto-clear day if it exceeds new max for the current month
		if (month !== null && day !== null) {
			const newMax = getDaysInMonth(month, parsed);
			if (day > newMax) {
				patch.day = null;
			}
		}

		update(patch);
	};

	const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const raw = e.target.value;

		if (raw === "") {
			// Cascading clear: month cleared → clear day
			update({ month: null, day: null });
			return;
		}

		const newMonth = parseInt(raw, 10);
		const patch: Partial<DateValue> = { month: newMonth };

		// Auto-clear day if it exceeds new max
		if (day !== null && year !== null) {
			const newMax = getDaysInMonth(newMonth, year);
			if (day > newMax) {
				patch.day = null;
			}
		}

		update(patch);
	};

	const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const raw = e.target.value;
		update({ day: raw === "" ? null : parseInt(raw, 10) });
	};

	const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		update({ era: e.target.value as "AD" | "BC" });
	};

	const handleCircaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		update({ circa: e.target.checked });
	};

	return (
		<Canvas ctx={ctx}>
			<div className={s.row}>
				<label className={s.field}>
					<span className={s.label}>Year</span>
					<input
						type="number"
						min={1}
						value={year ?? ""}
						onChange={handleYearChange}
						placeholder="Year"
						className={s.input}
						disabled={disabled}
					/>
				</label>

				<label className={s.field}>
					<span className={s.label}>Month</span>
					<select
						value={month ?? ""}
						onChange={handleMonthChange}
						disabled={disabled || !hasYear}
						className={s.select}
					>
						<option value="">—</option>
						{MONTHS.map((name, i) => (
							<option key={i + 1} value={i + 1}>{name}</option>
						))}
					</select>
				</label>

				<label className={s.field}>
					<span className={s.label}>Day</span>
					<select
						value={day ?? ""}
						onChange={handleDayChange}
						disabled={disabled || !hasMonth}
						className={s.select}
					>
						<option value="">—</option>
						{Array.from({ length: maxDays }, (_, i) => (
							<option key={i + 1} value={i + 1}>{i + 1}</option>
						))}
					</select>
				</label>

				<label className={s.field}>
					<span className={s.label}>Era</span>
					<select
						value={era ?? "AD"}
						onChange={handleEraChange}
						disabled={disabled || !hasYear}
						className={s.select}
					>
						<option value="AD">A.D.</option>
						<option value="BC">B.C.</option>
					</select>
				</label>

				<label className={s.fieldCheckbox}>
					<input
						type="checkbox"
						checked={circa ?? false}
						onChange={handleCircaChange}
						disabled={disabled || !hasYear}
					/>
					<span className={s.label}>Circa</span>
				</label>
			</div>
		</Canvas>
	);
}
