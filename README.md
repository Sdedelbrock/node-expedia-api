[![NPM](https://nodei.co/npm/expedia.png)](https://nodei.co/npm/expedia/)

##Expedia API
Small client interface for the [Expedia EAN api](http://developer.ean.com/).  Provides an interface for the following methods:  
- **Hotel List** Retrieve a list of hotels by location or a list of specific hotel ids  
- **Hotel Information**  Retrive detailed information about a hotel from a hotel id  
- **Room Availability** Retrieve all available rooms at a specific hotel that accommodate the provided guest count and any other criteria.  
- **Room Images** Retrieve a list room images for a specific hotelId organized by room type  
- **Payment Types** Retrieves credit card types compatible current request settings  
- **Book Reservation** Requests a reservation for the specified room(s).   
- **Itinerary Request** Retrieve an existing itinerary's status and details, confirm the status of a previously requested booking, or retrieve a list of itineraries from a specified date span.  
- **Cancel Reservation** Cancel an existing reservation for a single room.  
- **Ping Request** Send a ping request to expedia API servers to determine if service is available in the event of a suspected outage or ISP issue, or to obtain EAN's Unix server time when troubleshooting issues with signature authentication.  
- **Geo Functions** Obtain location data such as a specific destinationId, latitude/longitude coordinates, and the number of active properties available within the location.  

##Installation
Install with npm:  
```npm install expedia```

##Initialization
Usage requires a Expedia Api key and CID.  For development use you can use the CIN 55505.  You can obtain your api key from the [Expedia EAN api documentation](http://developer.ean.com/).

```javascript
 var options = {
        cid     : "YOUR CID",
        apiKey  : "YOUR EAN API KEY",
        locale  : "en_US",  // optional defaults to en_US
        currencyCode :"USD"  // optional defaults to USD
    };

var expedia = require("expedia")(options);
```

##Usage
Expedia requires that you pass in a customer ip, unique session identifier, and browser agent.  The remaining parameters are defined in the  [Expedia EAN api documentation](http://developer.ean.com/).  Please see the example directory for more options.

```javascript
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "LocationInfoRequest": {
    "locale": "en_US",
    "destinationString": "Seattle, WA"
  }
};

expedia.geoSearch(options, function(err, res){
    if(err)throw new Error(err);
    console.log(res);
});
```
