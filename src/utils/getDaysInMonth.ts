export function getDaysInMonth(month: number, year: number): number {
	// month is 1-based (1=Jan, 12=Dec)
	// Using day 0 of the next month gives the last day of the current month
	return new Date(year, month, 0).getDate();
}
