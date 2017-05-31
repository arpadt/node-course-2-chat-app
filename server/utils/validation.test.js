const expect = require('expect');

const {isRealString, toLowerCase} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        let res = isRealString(42);
        expect(res).toBe(false);
    });

    it('should reject string with only spaces', () => {
        let res = isRealString('   ');
        expect(res).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        let res = isRealString('  Arpad  ');
        expect(res).toBe(true);
    });
});

describe('toLowerCase', () => {
    it('should make string to lower case', () => {
        let res = toLowerCase('Hi I Am A User');
        expect(res).toBe('hi i am a user');
    });
});
