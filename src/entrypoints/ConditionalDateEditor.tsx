import { type RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, FormLabel, TextInput, SelectInput, SwitchInput } from "datocms-react-ui";
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

type Option = { label: string; value: string };

const MONTH_OPTIONS: Option[] = [
	{ label: "January", value: "1" },
	{ label: "February", value: "2" },
	{ label: "March", value: "3" },
	{ label: "April", value: "4" },
	{ label: "May", value: "5" },
	{ label: "June", value: "6" },
	{ label: "July", value: "7" },
	{ label: "August", value: "8" },
	{ label: "September", value: "9" },
	{ label: "October", value: "10" },
	{ label: "November", value: "11" },
	{ label: "December", value: "12" },
];

const ERA_OPTIONS: Option[] = [
	{ label: "A.D.", value: "AD" },
	{ label: "B.C.", value: "BC" },
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

	const dayOptions: Option[] = Array.from({ length: maxDays }, (_, i) => ({
		label: String(i + 1),
		value: String(i + 1),
	}));

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
			next.era = "AD";
			next.circa = false;
		}

		if (month !== null && day !== null) {
			const newMax = getDaysInMonth(month, parsed);
			if (day > newMax) next.day = null;
		}

		save(next);
	};

	const handleMonthChange = (option: Option | null) => {
		if (!option) {
			save({ ...value, month: null, day: null });
			return;
		}

		const newMonth = parseInt(option.value, 10);
		const next = { ...value, month: newMonth };

		if (day !== null && year !== null) {
			const newMax = getDaysInMonth(newMonth, year);
			if (day > newMax) next.day = null;
		}

		save(next);
	};

	const handleDayChange = (option: Option | null) => {
		save({ ...value, day: option ? parseInt(option.value, 10) : null });
	};

	const handleEraChange = (option: Option | null) => {
		if (option) {
			save({ ...value, era: option.value as "AD" | "BC" });
		}
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
					<SelectInput
						id="month"
						value={month != null ? MONTH_OPTIONS.find((o) => o.value === String(month)) ?? null : null}
						onChange={handleMonthChange}
						options={MONTH_OPTIONS}
						isDisabled={disabled || !hasYear}
						isClearable
						placeholder="—"
						menuPortalTarget={document.body}
					/>
				</div>

				<div className={s.fieldSmall}>
					<FormLabel htmlFor="day">Day</FormLabel>
					<SelectInput
						id="day"
						value={day != null ? dayOptions.find((o) => o.value === String(day)) ?? null : null}
						onChange={handleDayChange}
						options={dayOptions}
						isDisabled={disabled || !hasMonth}
						isClearable
						placeholder="—"
						menuPortalTarget={document.body}
					/>
				</div>

				<div className={s.fieldSmall}>
					<FormLabel htmlFor="era">Era</FormLabel>
					<SelectInput
						id="era"
						value={era != null ? ERA_OPTIONS.find((o) => o.value === era) ?? ERA_OPTIONS[0] : ERA_OPTIONS[0]}
						onChange={handleEraChange}
						options={ERA_OPTIONS}
						isDisabled={disabled || !hasYear}
						placeholder="—"
						menuPortalTarget={document.body}
					/>
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
