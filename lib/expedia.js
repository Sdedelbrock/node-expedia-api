/**
* Author : Shiem Edelbrock
* License:  Released under the WTFPL license - http://sam.zoy.org/wtfpl/
**/

var querystring = require('querystring');
var parser = require('jstoxml');
var request = require('request');
var color = require('cli-color');

module.exports = function (options) {

    var baseUrl = "https://api.eancdn.com/ean-services/rs/hotel/v3/",
    defaults = {
        cid     : null,
        apiKey  : null,
        locale  : "en_US",
        currencyCode :"USD"
    };

    options = _extend(defaults, options);

    if(options.apiKey === null) throw new Error("Api Key is required");
    if(options.cid === null) throw new Error("CID is required");
    if(options.cid == 55505) console.log(color.red.bold.underline("|WARNING|") + color.red.bold(" CID 55505 is for development only, for production you must use another value"));
    // add a callable endpoint to help us build the URL
    var endpoint = function (endpoint){
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
    function _normalizeParamaters(parameters, request){
        if(typeof parameters !== 'object'){
            throw new Error("Paramaters must be passed in as an object");
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
        var xml = querystring.stringify({"xml" : parser.toXML(parameters)});
        return customer +"&json&" + xml;
    }

    // Check to make sure default parameters are set
    function _checkParameters(params){
        if(typeof params !== 'object') throw new Error("Paramaters must be passed in as an object");
        if(!params.customerSessionId) throw new Error("Customer session id must be sent in as customerSessionId");
        if(!params.customerSessionId) throw new Error("Customer ip address must be sent in as customerIpAddress");
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
        if(result.EanWsError){
            cb({error:result.EanWsError.verboseMessage, details:result.EanWsError});
        }
        else{
            cb(null, result);
        }
    }

    function _get(method, parameters, cb){
        var url = endpoint(method) + _normalizeParamaters(parameters);
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                _handleResponse(body, cb);
            }
            else if(error){
                cb({error:"http request error", details : error});
            }
            else{
                cb({error:"http request error", details :{respone : response,body : body}});
            }
        });
    }

    function _post(method, parameters, cb){
        var url = endpoint(method) + _normalizeParamaters(parameters);
        request.post(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                _handleResponse(body, cb);
            }
            else if(error){
                cb({error:"http request error", details : error});
            }
            else{
                cb({error:"http request error", details :{respone : response,body : body}});
            }
        });
    }

    return {
        // Utility functions
        ping : function(params, cb){
            _checkParameters(params);
            _get("ping", params, cb);
        },
        geoSearch : function(params, cb){
            _checkParameters(params);
            _get("geoSearch", params, cb);
        },
        // Hotel specific methods
        hotels:{
            list : function(params, cb){
                _checkParameters(params);
                _get("list", params, cb);
            },
            info : function(params, cb){
                _checkParameters(params);
                _get("info", params, cb);
            },
            availability : function(params, cb){
                _checkParameters(params);
                _get("avail", params, cb);
            },
            roomImages : function(params, cb){
                _checkParameters(params);
                _get("roomImages", params, cb);
            },
            acceptedPayments : function(params, cb){
                _checkParameters(params);
                _get("paymentInfo", params, cb);
            }
        },
        // Reservation/Itinerary specific methods
        reservation:{
            book : function(params, cb){
                _checkParameters(params);
                _post("res", params, cb);
            },
            get : function(params, cb){
                _checkParameters(params);
                _get("itin", params, cb);
            },
            cancel : function(params, cb){
                _checkParameters(params);
                _get("cancel", params, cb);
            }
        }
    };
};
