const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let message = generateMessage('Arpad', 'Test case');

        expect(message.from).toEqual('Arpad');
        expect(message.text).toEqual('Test case');
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let from = 'Heni';
        let latitude = 1;
        let longitude = 2;
        let url = 'https://www.google.com/maps?q=1,2';
        let message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
        expect(message.from).toEqual(from);
        expect(message.url).toEqual(url);
    });
});