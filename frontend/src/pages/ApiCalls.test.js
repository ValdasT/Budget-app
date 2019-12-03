import { getCurrency, addTag, getFirstAndLastExpenseDate } from './ApiCalls';
// npm test -- --coverage

describe('getCurrency', () => {
    it('expect to return Dollar sign', () => {
        let settings = { currency: 'Dollar' };
        expect(getCurrency(settings)).toBe('$');
    });

    it('expect to return Pound sign', () => {
        let settingsForPound = { currency: 'GBD' };
        expect(getCurrency(settingsForPound)).toBe('£');
    });

    it('expect to return Eur sign', () => {
        let settingsForEur = { currency: 'Eur' };
        expect(getCurrency(settingsForEur)).toBe('€');
    });
});

describe('getTag', () => {
    it('expect to return array with tag', () => {
        let myArray = [{ name: 'John', tag: undefined, surname: 'Smith' }];
        expect(addTag(myArray, 'User')).toEqual([{ tag: 'User', name: 'John', surname: 'Smith' }]);
    });
});

describe('getFirstAndLastExpenseDate', () => {
    it('expect to first and last date', () => {
        let myArray = [{ createdAt: '1572190095856' }, { createdAt: '1572190095856' }, { createdAt: '1572190095856' }, { createdAt: '1574632800000' }];
        expect(getFirstAndLastExpenseDate(myArray)).toEqual({ "dateFrom": "10/27/2019", "dateTo": "11/25/2019" });
    });
});