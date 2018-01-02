var expedia = require("../lib/expedia")();

// a complete list of options is available at http://developer.ean.com/docs/hotel-list/
var options = {
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Node.js",
  "HotelListRequest": {
    "city": "Seattle",
    "stateProvinceCode": "WA",
    "countryCode": "US",
    "arrivalDate": "12/30/2018",
    "departureDate": "12/31/2018",
    "RoomGroup": {
      "Room": { "numberOfAdults": "2" }
    },
    "numberOfResults": "20"
  }
};

expedia.hotels.list(options)
  .then(data => { console.log(JSON.stringify(data)); })
  .catch(err => { console.error(err); })
