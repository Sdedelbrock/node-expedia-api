var expedia = require("../lib/expedia")({apiKey:"cbrzfta369qwyrm9t5b8y8kf",cid:"55505"});

// a complete list of options is available at http://developer.ean.com/docs/book-reservation/
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "HotelRoomReservationRequest": {
    "hotelId": "106347",
    "arrivalDate": "9/30/2013",
    "departureDate": "10/2/2013",
    "supplierType": "E",
    "rateKey": "af00b688-acf4-409e-8bdc-fcfc3d1cb80c",
    "roomTypeCode": "198058",
    "rateCode": "484072",
    "chargeableRate": "231.18",
    "RoomGroup": {
      "Room": {
        "numberOfAdults": "2",
        "firstName": "test",
        "lastName": "tester",
        "bedTypeId": "23",
        "smokingPreference": "NS"
      }
    },
    "ReservationInfo": {
      "email": "test@travelnow.com",
      "firstName": "test",
      "lastName": "tester",
      "homePhone": "2145370159",
      "workPhone": "2145370159",
      "creditCardType": "CA",
      "creditCardNumber": "5401999999999999",
      "creditCardIdentifier": "123",
      "creditCardExpirationMonth": "11",
      "creditCardExpirationYear": "2015"
    },
    "AddressInfo": {
      "address1": "travelnow",
      "city": "Seattle",
      "stateProvinceCode": "WA",
      "countryCode": "US",
      "postalCode": "98004"
    }
  }
};

expedia.reservation.book(options, function(err, res){
    if(err)throw new Error(err);
    console.log(res);
});

