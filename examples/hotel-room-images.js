var expedia = require("../lib/expedia")({apiKey:"cbrzfta369qwyrm9t5b8y8kf",cid:"55505"});

// a complete list of options is available at http://developer.ean.com/docs/room-images/
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "HotelRoomImagesRequest": {
    "hotelId": "106347",
  }
};

expedia.hotels.roomImages(options, function(err, res){
    if(err)throw new Error(err);
    console.log(res);
});

