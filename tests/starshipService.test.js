const fs = require('fs');
const starshipService = require('../services/starshipsService.js');
const YwingJSON = JSON.parse(fs.readFileSync(__dirname + '/Y-wing.json', 'utf8'));
const MillenniumFalconJSON = JSON.parse(fs.readFileSync(__dirname + '/MillenniumFalcon.json', 'utf8'));
const rebelTransportJSON = JSON.parse(fs.readFileSync(__dirname + '/rebelTransport.json', 'utf8'));

test("Returns correct number of stops for Rebel Transport", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([YwingJSON], 1000000);
    expect(result[0].stops).toBe(74);
});

test("Returns correct number of stops for Millennium Falcon", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([MillenniumFalconJSON], 1000000);
    expect(result[0].stops).toBe(9);
});

test("Returns correct number of stops for Y-wing", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([rebelTransportJSON], 1000000);
    expect(result[0].stops).toBe(11);
});

test("Handle when distance is negative", async () => {
    await expect(() =>
        starshipService.determineTotalStopsForAllShips([rebelTransportJSON], -1000000))
        .rejects.toEqual(Error('Please enter a valid distance.'));
});

test("Handle when distance is zero", async () => {
    await expect(() =>
        starshipService.determineTotalStopsForAllShips([rebelTransportJSON], 0))
        .rejects.toEqual(Error('Please enter a valid distance.'));
});

test("Handle when distance is non-numeric", async () => {
    await expect(() =>
        starshipService.determineTotalStopsForAllShips([rebelTransportJSON], "helloWorld"))
        .rejects.toEqual(Error('Please enter a valid distance.'));
});

test("Handle when starship MGLT is unknown", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([{ "name": "Athlone Cruiser", "consumables": "1 day", "MGLT": "unknown" }], 1000000);
    expect(result[0].stops).toBe("Data required to calculate total amount of stops is unavailable.");
});

test("Handle when starship consumables is unknown", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([{ "name": "Limerick Cruiser", "consumables": "unknown", "MGLT": "90" }], 1000000);
    expect(result[0].stops).toBe("Data required to calculate total amount of stops is unavailable.");
});

test("Handle when starship consumables is invalid", async () => {
    var result = await starshipService.determineTotalStopsForAllShips([{ "name": "Limerick Cruiser", "consumables": "nonsense", "MGLT": "90" }], 1000000);
    expect(result[0].stops).toBe("Data required to calculate total amount of stops is unavailable.");
});
