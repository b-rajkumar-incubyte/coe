export default function isLeapYear(year: number): boolean {
    if(year % 4 === 0 && year % 100 !== 0) return true;  
    return year % 400 === 0;
}