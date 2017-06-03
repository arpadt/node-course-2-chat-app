const expect = require('expect');

const {Rooms} = require('./rooms');

describe('Rooms', () => {
    let roomsList;

    beforeEach( () => {
        roomsList = new Rooms();

        roomsList.rooms = ['Node Course', 'MongoDB Course'];
    });

    it('should add a new room', () => {
        let newRoom = 'Angular Course';
        let res = roomsList.addRoom(newRoom);
        let lastRoom = roomsList.rooms[roomsList.rooms.length - 1];

        expect(res).toBe(newRoom);
        expect(lastRoom).toBe(newRoom);
        expect(roomsList.rooms.length).toBe(3);
    });

    it('should not add an existing room', () => {
        let existingRoom = 'Node Course';
        let res = roomsList.addRoom(existingRoom);

        expect(res).toBe(undefined);
        expect(roomsList.rooms.length).toBe(2);
    });

    it('should remove room from list when last user exits', () => {
        let numberOfUsers = 0;
        let roomToCheck = 'Node Course';
        let res = roomsList.removeRoom(roomToCheck, numberOfUsers);

        expect(res).toBe(undefined);
        expect(roomsList.rooms.indexOf(roomToCheck)).toBe(-1);
        expect(roomsList.rooms.length).toBe(1);
    });

    it('should not remove room when users are still in', () => {
        let numberOfUsers = 1;
        let roomToCheck = 'Node Course';
        let res = roomsList.removeRoom(roomToCheck, numberOfUsers);

        expect(res).toBe(undefined);
        expect(roomsList.rooms.length).toBe(2);
    });

    it('should return array of rooms', () => {
        let res = roomsList.getRoomList();

        expect(res).toBeA('array');
        expect(res).toEqual(roomsList.rooms);
    });

});