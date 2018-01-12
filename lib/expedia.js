/**
* Author : Shiem Edelbrock
* License:  Released under the WTFPL license - http://sam.zoy.org/wtfpl/
**/

var querystring = require('querystring');
var parser = require('jstoxml');
var rp = require('request-promise');
var color = require('cli-color');
const crypto = require('crypto');

module.exports = function (options, sendAsREST) {

    // development and production ean endpoints
    var generalBaseUrl = "https://api.ean.com/ean-services/rs/hotel/v3/";
    var bookingBaseUrl = "https://book.api.ean.com/ean-services/rs/hotel/v3/";
    var sendAsREST = true;
    var defaults = {
        cid     : '504735',
        apiKey  : '6la3and8iesgfqd29pkgtf5t4b',
        locale  : "en_US",
        secret  : '4rmebaks9fr1',
        currencyCode :"USD",
        minorRev: 30
    };

    options = _extend(defaults, options);
    if(options.apiKey === null) throw new Error("Api Key is required");
    if(options.cid === null) throw new Error("CID is required");
    if(options.cid == 55505) console.log(color.red.bold.underline("|WARNING|") + color.red.bold(" CID 55505 is for development only, for production you must use another value"));

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
            customerUserAgent : parameters.customerUserAgent,
            minorRev: parameters.minorRev
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

    function _errorChecker(response) {
        if (response.HotelListResponse && response.HotelListResponse.EanWsError) {
            if (response.HotelListResponse.EanWsError.presentationMessage === 'No Results Available') {
                return {
                    HotelListResponse: {
                        HotelList: {
                            '@size': '0',
                            '@activePropertyCount': '0',
                            HotelSummary: []
                        }
                    }
                };
            }

            throw new Error(response.HotelListResponse.EanWsError.presentationMessage);
        }

        return response;
    }


    function _createSighHash() {
        const currentUnixTimeStampInSeconds = parseInt(Date.now() / 1000);
        const data = `${options.apiKey}${options.secret}${currentUnixTimeStampInSeconds}`;
        const sigHash = crypto.createHash('md5').update(data).digest("hex");

        return sigHash;
    }

    function _get(method, parameters, type){
        parameters.sig = _createSighHash();
        var requestOptions = {
            uri: endpoint(method, type) + _normalizeParameters(parameters),
            json: true
        };

        return rp.get(requestOptions)
            .then(_errorChecker);
    }

    function _post(method, parameters, type){
        parameters.sig = _createSighHash();
        const requestOptions = {
            uri: endpoint(method, type) + _normalizeParameters(parameters),
            json: true
        };

        return rp.post(requestOptions)
            .then(_errorChecker);
    }

    return {
        // Utility functions
        ping : function(params){
            _checkParameters(params);

            return _get("ping", params, "general");
        },
        geoSearch : function(params){
            _checkParameters(params);

            return _get("geoSearch", params, "general");
        },
        // Hotel specific methods
        hotels:{
            list : function(params){
                _checkParameters(params);

                return _get("list", params, "general");
            },
            info : function(params){
                _checkParameters(params);

                return _get("info", params, "general");
            },
            availability : function(params){
                _checkParameters(params);

                return _get("avail", params, "general");
            },
            roomImages : function(params){
                _checkParameters(params);

                return _get("roomImages", params, "general");
            },
            acceptedPayments : function(params){
                _checkParameters(params);

                return _get("paymentInfo", params, "general");
            }
        },
        // Reservation/Itinerary specific methods
        reservation:{
            book : function(params){
                _checkParameters(params);

                return _post("res", params, "booking");
            },
            get : function(params){
                _checkParameters(params);

                return _get("itin", params, "general");
            },
            cancel : function(params){
                _checkParameters(params);

                return _get("cancel", params, "general");
            }
        }
    };
};
