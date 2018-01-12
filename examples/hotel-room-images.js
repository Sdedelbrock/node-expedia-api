var expedia = require("../lib/expedia")();

// a complete list of options is available at http://developer.ean.com/docs/room-images/
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "HotelRoomImagesRequest": {
    "hotelId": "122212",
  }
};

expedia.hotels.roomImages(options)
  .then(data => { console.log(JSON.stringify(data)); })
  .catch(err => { console.error(err); })
