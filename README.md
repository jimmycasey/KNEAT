## Dependencies
Node Version: v10.22.0

## Setup
npm install

## Process all ships for number of stops, defaults to 1,000,000 if no distance is passed in.
node main.js <distance>

## Run tests
jest

## If having problems running locally, can be built with docker instead
- docker build -t kneat .
- docker run kneat