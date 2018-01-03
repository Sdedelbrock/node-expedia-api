var expedia = require("../lib/expedia")();

// a complete list of options is available at http://developer.ean.com/docs/hotel-list/
var options = {
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Node.js",
  "city": "Seattle",
  "stateProvinceCode": "WA",
  "latitude": 47.6062,
  "longitude": -122.332,
  "countryCode": "US",
  "arrivalDate": "12/30/2018",
  "departureDate": "12/31/2018",
  "searchRadius": 15,
  "searchRadiusUnit": "MI",
  "room1": 2,
  "numberOfResults": "20"
};

expedia.hotels.list(options)
  .then(data => { console.log(JSON.stringify(data)); })
  .catch(err => { console.error(err); })
