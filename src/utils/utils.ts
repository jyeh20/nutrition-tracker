import { CalorieTracker, DbCalorieTracker } from "@/models/Food";

/**
 *
 * @param d1 Date
 * @param d2 Date to compare
 * @returns Whether the dates represent the same day
 * https://stackoverflow.com/questions/43855166/how-to-tell-if-two-dates-are-in-the-same-day-or-in-the-same-hour
 */
export const sameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const dbCalorieTrackerToRegularTracker = (
  tracker: DbCalorieTracker
): CalorieTracker => {
  console.log(tracker);
  return {
    ...tracker,
    date: tracker.date.toDate(),
  };
};

export const getMacroPerHundredGrams = (
  servingSizeInUnits: number,
  amountToNormalize: number
): number => {
  return (amountToNormalize * 100) / servingSizeInUnits;
};

export const calculateMacroFromNormalizedValue = (
  servingSize: number,
  macroPerHundredGrams: number
) => {
  return (servingSize * macroPerHundredGrams) / 100;
};

export const roundToHundreths = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
