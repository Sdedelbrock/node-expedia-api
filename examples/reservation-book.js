var expedia = require("../lib/expedia")({
    apiKey: "cbrzfta369qwyrm9t5b8y8kf",
    cid: "55505"
});

// a complete list of options is available at http://developer.ean.com/docs/book-reservation/
var options = {
    "customerSessionId": "0ABAAC0E-B501-FF91-5952-099A2F397163",
    "customerIpAddress": "188.163.105.77",
    "customerUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
    "hotelId": 106347,
     "arrivalDate": "02/03/2017",
     "departureDate": "02/05/2017",
    "supplierType": "E",
    "rateKey": "af00b688-acf4-409e-8bdc-fcfc3d1cb80c",
    "roomTypeCode": "198058",
    "rateCode": "484072",
    "chargeableRate": "231.18",
    // "RoomGroup": {
    //     "Room": {
            "room1": 2,
            "room1firstName": "test",
            "room1lastName": "tester",
            "room1bedTypeId": "23",
            "room1smokingPreference": "NS",
        // }
    // },
    // "ReservationInfo": {
        "email": "test@travelnow.com",
        "firstName": "test",
        "lastName": "tester",
        "homePhone": "2145370159",
        "workPhone": "2145370159",
        "creditCardType": "CA",
        "creditCardNumber": "5401999999999999",
        "creditCardIdentifier": "123",
        "creditCardExpirationMonth": "11",
        "creditCardExpirationYear": "2019",
    // },
    // "AddressInfo": {
        "address1": "travelnow",
        "city": "Seattle",
        "stateProvinceCode": "WA",
        "countryCode": "US",
        "postalCode": "98004"
    // }
};

expedia.reservation.book(options, function(err, res) {
    if (err) throw new Error(err);
    console.log(res);
});
