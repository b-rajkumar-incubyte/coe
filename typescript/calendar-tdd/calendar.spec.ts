import isLeapYear from "./calendar";

describe('isLeapYear', () => {
    it('should be true for a year divisible by 400', () => {
        expect(isLeapYear(1600)).toBe(true);
    })

    it('should be false for a year which is divisible by 100 by not by 400', () => {
        expect(isLeapYear(1800)).toBe(false);
    })

    it('should be true for year which is divisible by 4 but not by 100', () => {
        expect(isLeapYear(2004)).toBe(true);
    })

    it('should be false for a year which is not divisible by 4', () => {
        expect(isLeapYear(2017)).toBe(false);
    })
});