const starshipService = require('./services/starshipsService.js');

var arguments = process.argv ; 
const distance = parseInt(arguments[2]) || 1000000;

starshipService.processShips(distance)
    .then(res => console.log(res))
    .catch(err => console.log(err));
