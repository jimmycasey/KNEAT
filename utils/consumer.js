const fetch = require('node-fetch');

module.exports.getData = async function (url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log("Error consuming API " + error);
    }
};
