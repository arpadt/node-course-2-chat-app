const moment = require('moment');

// 7:15 pm

const someTimestamp = moment().valueOf();

const createdAt = 1234;
let date = moment(createdAt);
console.log(date.format('h:mm a'));