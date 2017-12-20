/**
* Author : Shiem Edelbrock
* License:  Released under the WTFPL license - http://sam.zoy.org/wtfpl/
**/

var querystring = require('querystring');
var parser = require('jstoxml');
var request = require('request');
var color = require('cli-color');
const crypto = require('crypto');

module.exports = function (options, sendAsREST) {
    
    // development and production ean endpoints
    var generalBaseUrl = "https://api.ean.com/ean-services/rs/hotel/v3/";
    var bookingBaseUrl = "https://book.api.ean.com/ean-services/rs/hotel/v3/";
    var sendAsREST = false;
    var defaults = {
        cid     : '504735',
        apiKey  : '6la3and8iesgfqd29pkgtf5t4b',
        locale  : "en_US",
        secret  : '4rmebaks9fr1',
        currencyCode :"USD"
    };

    options = _extend(defaults, options);
    const currentUnixTimeStampInSeconds = parseInt(Date.now() / 1000);
    const data = `${defaults.apiKey}${defaults.secret}${currentUnixTimeStampInSeconds}`;
    const sigHash = crypto.createHash('md5').update(data).digest("hex");
    if(options.apiKey === null) throw new Error("Api Key is required");
    if(options.cid === null) throw new Error("CID is required");
    if(options.cid == 55505) console.log(color.red.bold.underline("|WARNING|") + color.red.bold(" CID 55505 is for development only, for production you must use another value"));
    options.sig = sigHash;
    // add a callable endpoint to help us build the URL
    var endpoint = function (endpoint, type){
        var baseUrl = (type == "booking") ? bookingBaseUrl : generalBaseUrl;
        return baseUrl + endpoint + "?" + querystring.stringify(options) + "&";
    };

    // Simple extend for our defaults
    function _extend(settings1,settings2){
        var newSettings = {};
        for (var name in settings1) { newSettings[name] = settings1[name]; }
        for (var name in settings2) { newSettings[name] = settings2[name]; }

        return newSettings;
    }

    // Normalize nested json to xml and then querystring it
    function _normalizeParameters(parameters, request){
        if(typeof parameters !== 'object'){
            throw new Error("Parameters must be passed in as an object");
        }

        // Extract customer from request object
        var customer = {
            customerSessionId : parameters.customerSessionId,
            customerIpAddress : parameters.customerIpAddress,
            customerUserAgent : parameters.customerUserAgent
        };
        delete(parameters.customerSessionId);
        delete(parameters.customerIpAddress);
        delete(parameters.customerUserAgent);

        customer = querystring.stringify(customer);

        var paramsAsString = customer +"&json&";
        if (sendAsREST){
            paramsAsString += querystring.stringify(parameters);
        }
        else {
            paramsAsString += querystring.stringify({"xml" : parser.toXML(parameters)});
        }
        return paramsAsString;
    }

    // Check to make sure default parameters are set
    function _checkParameters(params){
        if(typeof params !== 'object') throw new Error("Parameters must be passed in as an object");
        if(!params.customerIpAddress) throw new Error("Customer ip address must be sent in as customerIpAddress");
        if(!params.customerUserAgent) throw new Error("Customer user agent string address must be sent in as customerUserAgent");
    }

    function _handleResponse(response, cb){
        var result;
        try{
            result = JSON.parse(response);
        }
        catch (error){
            cb({error:"Error trying to parse response", details:{error:error, response:response}});
        }
        if(result && result.EanWsError){
            cb({error:result.EanWsError.verboseMessage, details:result.EanWsError});
        }
        else{
            cb(null, result);
        }
    }

    function _get(method, parameters, cb, type){
        var url = endpoint(method, type) + _normalizeParameters(parameters);
        
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                _handleResponse(body, cb);
            }
            else if(error){
                cb({error:"http request error", details : error});
            }
            else{
                cb({error:"http request error", details :{response : response,body : body}});
            }
        });
    }

    function _post(method, parameters, cb, type){
        var url = endpoint(method, type) + _normalizeParameters(parameters);
        request.post(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                _handleResponse(body, cb);
            }
            else if(error){
                cb({error:"http request error", details : error});
            }
            else{
                cb({error:"http request error", details :{response : response,body : body}});
            }
        });
    }

    return {
        // Utility functions
        ping : function(params, cb){
            _checkParameters(params);
            _get("ping", params, cb, "general");
        },
        geoSearch : function(params, cb){
            _checkParameters(params);
            _get("geoSearch", params, cb, "general");
        },
        // Hotel specific methods
        hotels:{
            list : function(params, cb){
                _checkParameters(params);
                _get("list", params, cb, "general");
            },
            info : function(params, cb){
                _checkParameters(params);
                _get("info", params, cb, "general");
            },
            availability : function(params, cb){
                _checkParameters(params);
                _get("avail", params, cb, "general");
            },
            roomImages : function(params, cb){
                _checkParameters(params);
                _get("roomImages", params, cb, "general");
            },
            acceptedPayments : function(params, cb){
                _checkParameters(params);
                _get("paymentInfo", params, cb, "general");
            }
        },
        // Reservation/Itinerary specific methods
        reservation:{
            book : function(params, cb){
                _checkParameters(params);
                _post("res", params, cb, "booking");
            },
            get : function(params, cb){
                _checkParameters(params);
                _get("itin", params, cb, "general");
            },
            cancel : function(params, cb){
                _checkParameters(params);
                _get("cancel", params, cb, "general");
            }
        }
    };
};
