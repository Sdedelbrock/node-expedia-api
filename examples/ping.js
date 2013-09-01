var expedia = require("../lib/expedia")({apiKey:"cbrzfta369qwyrm9t5b8y8kf",cid:"55505"});

// Simple echo server, response should match input
var options = {
  "customerSessionId" : "thisisauniqueID",
  "customerIpAddress" : "127.0.0.1",
  "customerUserAgent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko)",
  "PingRequest": { "echo": "This message should be echoed back to you." }
};

expedia.ping(options, function(err, res){
    if(err)throw new Error(err);
    console.log(res);
});

