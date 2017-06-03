class Rooms {

// addRoom(room) - someone joins a new room
// getRoomList returns an array of rooms
// removeRoom(room, numberOfUsers) - checks if last user leaves the room, returns room

    constructor() {
        this.rooms = [];
    }

    addRoom(newRoom) {
        let isRoomExisting = this.rooms.filter( (room) => room === newRoom);

        if (isRoomExisting.length === 1) {
            return;
        } else {
            this.rooms.push(newRoom);
        }

        return newRoom;
    }

    removeRoom(roomToCheck, numberOfUsers) {
        let roomtoFind = this.rooms.filter( (room) => room === roomToCheck)[0];

        if (roomtoFind) {
            if (numberOfUsers) {
                return;
            } else {
                this.rooms = this.rooms.filter( (room) => room !== roomToCheck);
            }
        }
        return;
    }

    getRoomList() {
        return this.rooms;
    }

}

module.exports = {Rooms};