export default function isLeapYear(year: number): boolean {
    const isDivisibleBy4 = year % 4 === 0;
    const isDivisibleBy100 = year % 100 === 0;
    const isDivisibleBy400 = year % 400 === 0;

    if(isDivisibleBy400) return true;
    if(isDivisibleBy4 && !isDivisibleBy100) return true;

    return false;
}