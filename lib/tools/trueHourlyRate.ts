/**
 * Tool #1 — True Hourly Rate Calculator
 *
 * Logic (from spec):
 *   Total hours worked per year = weeks × (billable hours + unpaid hours)
 *   Required gross income = (desired take-home + annual expenses) ÷ (1 − tax buffer %)
 *   True hourly rate = required gross income ÷ (weeks × billable hours per week)
 */

export interface TrueHourlyRateInputs {
  /** Desired annual take-home income */
  desiredTakeHome: number;
  /** Working weeks per year (default 48) */
  workingWeeks: number;
  /** Billable hours per week */
  billableHoursPerWeek: number;
  /** Unpaid hours per week (admin, pitching, unbilled) */
  unpaidHoursPerWeek: number;
  /** Estimated annual business expenses */
  annualExpenses: number;
  /** Tax / savings buffer as a decimal (e.g. 0.25 for 25%) */
  taxBuffer: number;
  /** Currently charging rate (optional — for comparison) */
  currentRate?: number;
}

export interface TrueHourlyRateResult {
  /** Total hours worked per year (billable + unpaid) */
  totalHoursPerYear: number;
  /** Billable hours per year */
  billableHoursPerYear: number;
  /** Required gross income before tax */
  requiredGrossIncome: number;
  /** The true rate the user needs to charge */
  trueHourlyRate: number;
  /**
   * Effective rate when unpaid time is included —
   * i.e. what they earn per total hour worked (not just billed)
   */
  effectiveRateIncludingUnpaid: number;
  /** Difference between true rate and current rate (if provided) */
  rateGap?: number;
  /** true if current rate is below what's needed */
  isUndercharging?: boolean;
}

export function calcTrueHourlyRate(
  inputs: TrueHourlyRateInputs
): TrueHourlyRateResult {
  const {
    desiredTakeHome,
    workingWeeks,
    billableHoursPerWeek,
    unpaidHoursPerWeek,
    annualExpenses,
    taxBuffer,
    currentRate,
  } = inputs;

  // Guard against divide-by-zero
  if (workingWeeks <= 0 || billableHoursPerWeek <= 0) {
    throw new Error("Working weeks and billable hours must be greater than 0.");
  }
  if (taxBuffer >= 1) {
    throw new Error("Tax buffer must be less than 100%.");
  }

  // Step 1: total hours
  const totalHoursPerYear =
    workingWeeks * (billableHoursPerWeek + unpaidHoursPerWeek);
  const billableHoursPerYear = workingWeeks * billableHoursPerWeek;

  // Step 2: required gross income
  const requiredGrossIncome =
    (desiredTakeHome + annualExpenses) / (1 - taxBuffer);

  // Step 3: true hourly rate (charged only on billable hours)
  const trueHourlyRate = requiredGrossIncome / billableHoursPerYear;

  // Bonus: effective rate when all hours (including unpaid) are included
  const effectiveRateIncludingUnpaid =
    requiredGrossIncome / totalHoursPerYear;

  // Comparison with current rate
  let rateGap: number | undefined;
  let isUndercharging: boolean | undefined;
  if (currentRate !== undefined && currentRate > 0) {
    rateGap = trueHourlyRate - currentRate;
    isUndercharging = rateGap > 0;
  }

  return {
    totalHoursPerYear,
    billableHoursPerYear,
    requiredGrossIncome,
    trueHourlyRate,
    effectiveRateIncludingUnpaid,
    rateGap,
    isUndercharging,
  };
}
