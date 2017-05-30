// store user related data
[{
    id: '',
    name: 'Arpad',
    room: 'The Office Fans'
}]

// addUser(id, name, room)
// removeUser(id) when someone leaves the room
// getUser(id) when sending someone a message
// getUserList(room) which users are in the room

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // return user that was removed
        let user = this.users.filter( (user) => user.id === id)[0];
        
        if (user) {
            this.users = this.users.filter( (user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        // return user object
        let userToFind = this.users.filter( (user) => user.id === id);

        return userToFind[0];
    }

    getUserList(room) {
        // get list of users in the specific room, return an array of names
        let users = this.users.filter( (user) => user.room === room);
        let namesArray = users.map( (user) => user.name);

        return namesArray;
    }
}

// set of data and methods
// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }

//     getUserDescription() {
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }

// // instance
// let me = new Person('Arpad', 41);
// let description = me.getUserDescription();
// console.log(description);

module.exports = {Users};