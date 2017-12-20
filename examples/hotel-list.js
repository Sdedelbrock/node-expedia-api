var expedia = require("../lib/expedia")();

// a complete list of options is available at http://developer.ean.com/docs/hotel-list/
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "HotelListRequest": {
    "city": "Seattle",
    "stateProvinceCode": "WA",
    "countryCode": "US",
    "arrivalDate": "12/30/2017",
    "departureDate": "12/31/2017",
    "RoomGroup": {
      "Room": { "numberOfAdults": "2" }
    },
    "numberOfResults": "20"
  }
}

expedia.hotels.list(options, function(err, res){
    console.log(err);
    if(err) throw new Error(err);
    console.log(JSON.stringify(res));
});

