import { type RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, FormLabel, TextInput, SwitchInput } from "datocms-react-ui";
import { get } from "../utils/get";
import { getDaysInMonth } from "../utils/getDaysInMonth";
import s from "./styles.module.css";

type DateValue = {
	year: number | null;
	month: number | null;
	day: number | null;
	era: "CE" | "BCE" | null;
	circa: boolean | null;
};

type Props = {
	ctx: RenderFieldExtensionCtx;
};

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const EMPTY_VALUE: DateValue = {
	year: null,
	month: null,
	day: null,
	era: null,
	circa: null,
};

function readValue(ctx: RenderFieldExtensionCtx): DateValue | null {
	const raw = get(ctx.formValues, ctx.fieldPath);
	if (raw == null) return null;
	if (typeof raw === "string") {
		try { return JSON.parse(raw); } catch { return null; }
	}
	return raw as DateValue;
}

export default function ConditionalDateEditor({ ctx }: Props) {
	const value = readValue(ctx) ?? EMPTY_VALUE;
	const { year, month, day, era, circa } = value;

	const hasYear = year !== null;
	const hasMonth = month !== null;
	const disabled = ctx.disabled;

	const maxDays = hasYear && hasMonth ? getDaysInMonth(month, year) : 31;

	function save(next: DateValue) {
		if (next.year == null && next.month == null && next.day == null && next.era == null && next.circa == null) {
			ctx.setFieldValue(ctx.fieldPath, null);
			return;
		}
		ctx.setFieldValue(ctx.fieldPath, JSON.stringify(next));
	}

	const handleYearChange = (newValue: string) => {
		if (newValue === "") {
			save(EMPTY_VALUE);
			return;
		}

		const parsed = parseInt(newValue, 10);
		if (isNaN(parsed) || parsed < 1) return;

		const next = { ...value, year: parsed };

		if (!hasYear) {
			next.era = "CE";
			next.circa = false;
		}

		if (month !== null && day !== null) {
			const newMax = getDaysInMonth(month, parsed);
			if (day > newMax) next.day = null;
		}

		save(next);
	};

	const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const raw = e.target.value;
		if (raw === "") {
			save({ ...value, month: null, day: null });
			return;
		}

		const newMonth = parseInt(raw, 10);
		const next = { ...value, month: newMonth };

		if (day !== null && year !== null) {
			const newMax = getDaysInMonth(newMonth, year);
			if (day > newMax) next.day = null;
		}

		save(next);
	};

	const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const raw = e.target.value;
		save({ ...value, day: raw === "" ? null : parseInt(raw, 10) });
	};

	const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		save({ ...value, era: e.target.value as "CE" | "BCE" });
	};

	const handleCircaChange = (newValue: boolean) => {
		save({ ...value, circa: newValue });
	};

	return (
		<Canvas ctx={ctx}>
			<div className={s.row}>
				<div className={s.field}>
					<FormLabel htmlFor="year">Year</FormLabel>
					<TextInput
						id="year"
						name="year"
						type="number"
						min={1}
						value={year != null ? String(year) : ""}
						onChange={handleYearChange}
						placeholder="Year"
						disabled={disabled}
					/>
				</div>

				<div className={s.field}>
					<FormLabel htmlFor="month">Month</FormLabel>
					<select
						id="month"
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
				</div>

				<div className={s.fieldSmall}>
					<FormLabel htmlFor="day">Day</FormLabel>
					<select
						id="day"
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
				</div>

				<div className={s.fieldSmall}>
					<FormLabel htmlFor="era">Era</FormLabel>
					<select
						id="era"
						value={era ?? "CE"}
						onChange={handleEraChange}
						disabled={disabled || !hasYear}
						className={s.select}
					>
						<option value="CE">CE</option>
						<option value="BCE">BCE</option>
					</select>
				</div>

				<div className={s.fieldCirca}>
					<FormLabel htmlFor="circa">Circa</FormLabel>
					<SwitchInput
						name="circa"
						value={circa ?? false}
						onChange={handleCircaChange}
						disabled={disabled || !hasYear}
					/>
				</div>
			</div>
		</Canvas>
	);
}
