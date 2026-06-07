export default function isLeapYear(year: number): boolean {
    if (year === 0) throw new Error("Year must be a non-zero integer");
    if (year < 0) throw new Error("Year must be a positive integer");

    const isDivisibleBy4 = year % 4 === 0;
    const isDivisibleBy100 = year % 100 === 0;
    const isDivisibleBy400 = year % 400 === 0;

    if(isDivisibleBy400) return true;
    if(isDivisibleBy4 && !isDivisibleBy100) return true;

    return false;
}