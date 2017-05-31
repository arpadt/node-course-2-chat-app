let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0; // remove leading and trailing whitespace
};

let toLowerCase = (str) => str.toLowerCase();

module.exports = {isRealString, toLowerCase};