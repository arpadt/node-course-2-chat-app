const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let message = generateMessage('Arpad', 'Test case');

        expect(message.from).toEqual('Arpad');
        expect(message.text).toEqual('Test case');
        expect(message.createdAt).toBeA('number');
    });
});