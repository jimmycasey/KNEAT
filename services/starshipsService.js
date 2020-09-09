const consumer = require('../utils/consumer.js');

async function consumeStarshipsAPI() {
    const baseURL = "https://swapi.dev/api";
    const starshipsEndpoint = "/starships";
    var starshipsJSON = [];

    var returnedJSON = await consumer.getData(baseURL + starshipsEndpoint);
    starshipsJSON.push(...returnedJSON.results);
    var nextPage = returnedJSON.next;

    while (nextPage) {
        returnedJSON = await consumer.getData(nextPage);
        starshipsJSON.push(...returnedJSON.results);
        nextPage = returnedJSON.next;
    }
    return starshipsJSON;
}

function calculateConsumablesDurationInHrs(consumablesDuration) {
    const dayInHrs = 24;
    const weekInHrs = dayInHrs * 7;
    const monthInHrs = weekInHrs * 4.3;
    const yearInHrs = monthInHrs * 12;

    var amount = consumablesDuration.split(" ")[0].trim();
    var unit = consumablesDuration.split(" ")[1].toLowerCase().trim();

    if (unit.includes('day')) {
        return dayInHrs * amount;
    } else if (unit.includes('week')) {
        return weekInHrs * amount;
    } else if (unit.includes('month')) {
        return monthInHrs * amount;
    } else if (unit.includes('year')) {
        return yearInHrs * amount;
    }
}

function calculateRequiredStopsForShip(starship, distance) {
    if (!starship.consumables) {
        throw new Error("Please enter a valid distance.");
    }
    var consumablesDurationInHrs = calculateConsumablesDurationInHrs(starship.consumables);
    var totalHrsInflight = distance / starship.MGLT;
    return Math.floor(totalHrsInflight / consumablesDurationInHrs);
}

function isValidConsumableValue(starship) {
    return starship.consumables.includes('day') || starship.consumables.includes('week')
        || starship.consumables.includes('month') || starship.consumables.includes('year');
}

function isValidDistance(distance) {
    if (!distance || distance < 0 || typeof distance !== 'number') {
        throw new Error("Please enter a valid distance.");
    }
}

module.exports.determineTotalStopsForAllShips = async function (starshipsJSON, distance) {
    isValidDistance(distance);
    var resultsArray = [];
    for (starship of starshipsJSON) {
        if (starship.consumables === 'unknown' || starship.MGLT === 'unknown' || !isValidConsumableValue(starship)) {
            resultsArray.push({ name: starship.name, stops: "Data required to calculate total amount of stops is unavailable." });
        } else {
            var stops = await calculateRequiredStopsForShip(starship, distance);
            resultsArray.push({ name: starship.name, stops: stops });
        }
    }
    return resultsArray;
}

module.exports.processShips = async function (distance) {
    var starshipsJSON = await consumeStarshipsAPI();
    return this.determineTotalStopsForAllShips(starshipsJSON, distance)
}