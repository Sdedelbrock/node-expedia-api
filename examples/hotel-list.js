var expedia = require("../lib/expedia")({apiKey:"cbrzfta369qwyrm9t5b8y8kf",cid:"55505"});

// a complete list of options is available at http://developer.ean.com/docs/hotel-list/
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "HotelListRequest": {
    "city": "Seattle",
    "stateProvinceCode": "WA",
    "countryCode": "US",
    "arrivalDate": "9/30/2013",
    "departureDate": "10/2/2013",
    "RoomGroup": {
      "Room": { "numberOfAdults": "2" }
    },
    "numberOfResults": "25"
  }
}

expedia.hotels.list(options, function(err, res){
    if(err)throw new Error(err);
    console.log(res);
});

