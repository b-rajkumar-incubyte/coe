import isLeapYear from "./calendar";

describe('isLeapYear', () => {
    it('should be true for a year divisible by 400', () => {
        expect(isLeapYear(400)).toBe(true);
    })
});