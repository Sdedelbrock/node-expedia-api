/**
 * Author : Shiem Edelbrock
 * License:  Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 **/

var querystring = require('querystring');
var request = require('request-promise');
var color = require('cli-color');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = function(options) {

    // development and production ean endpoints
    var generalBaseUrl = "http://api.ean.com/ean-services/rs/hotel/v3/";
    var bookingBaseUrl = "https://book.api.ean.com/ean-services/rs/hotel/v3/";
    var secret = options.secret || null;
    var defaults = {
        cid: null,
        minorRev: "99",
        apiKey: null,
        locale: "en_US",
        currencyCode: "USD"
    };

    options = _.assign(defaults, _.omit(options, 'secret'));

    if (options.apiKey === null) throw new Error("Api Key is required");
    if (options.cid === null) throw new Error("CID is required");
    if (options.cid == 55505) console.log(color.red.bold.underline("|WARNING|") + color.red.bold(" CID 55505 is for development only, for production you must use another value"));
    if (options.secret === null) {
        throw new Error('Secret is required');
    }

    // add a callable endpoint to help us build the URL
    var endpoint = function(endpoint, type) {
        var baseUrl = (type == "booking") ? bookingBaseUrl : generalBaseUrl,
            timestamp = Math.floor(Date.now() / 1000),
            sig = '&sig=' + crypto.createHash('md5').update(options.apiKey + secret + timestamp).digest('hex');

        return baseUrl + endpoint + "?" + querystring.stringify(options) + sig;
    };

    function _normalizeParameters(parameters) {
        if (typeof parameters !== 'object') {
            throw new Error("Parameters must be passed in as an object");
        }

        return querystring.stringify(parameters);
    }

    // Check to make sure default parameters are set
    function _checkParameters(params) {
        if (typeof params !== 'object') throw new Error("Parameters must be passed in as an object");
        if (!params.customerIpAddress) throw new Error("Customer ip address must be sent in as customerIpAddress");
        if (!params.customerUserAgent) throw new Error("Customer user agent string address must be sent in as customerUserAgent");
    }

    function _handleResponse(response) {
        var result;

        try {
            result = response.HotelRoomReservationResponse;

            if (result && result.EanWsError) { 
                let error = {
                    error: result.EanWsError.verboseMessage,
                    details: result.EanWsError
                };

                return error;
            } else {
                return result;
            }

        } catch (e) {
            let error = {
                error: 'Error trying to parse response',
                details: {
                    error: e,
                    response: response
                }
            };

            return error;
        }


    }

    function _get(method, parameters, cb, type) {
        var url = endpoint(method, type) + _normalizeParameters(parameters),
            fn = request({
                uri: url,
                json: true
            });

        if (typeof cb === 'function') {
            fn.then(function(response) {
                cb(null, response);
            }).catch(function(error) {
                cb({
                    error: "http request error",
                    details: error
                });
            });
        } else {
            return fn;
        }
    }

    function _post(method, parameters, cb, type) {
        var url = endpoint(method, type);

        var body = _.assign(options, parameters);

        var fn = request({
                method: 'POST',
                uri: url,
                json: true,
                body: _normalizeParameters(body),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'  // Set automatically 
                }
            });

        fn
            .then(body => {
                let response = _handleResponse(body);

                if (response.error) {
                    cb(response);
                } else {
                    cb(null, response);
                }

            })
            .catch(err => err);
    }

    return {
        // Utility functions
        ping: function(params, cb) {
            _checkParameters(params);
            return _get("ping", params, cb, "general");
        },
        geoSearch: function(params, cb) {
            _checkParameters(params);
            return _get("geoSearch", params, cb, "general");
        },
        optionsChange: function(nOpt) {
            options = _.assign(options, nOpt);
            return options;
        },
        // Hotel specific methods
        hotels: {
            list: function(params, cb) {
                _checkParameters(params);
                return _get("list", params, cb, "general");
            },
            info: function(params, cb) {
                _checkParameters(params);
                return _get("info", params, cb, "general");
            },
            availability: function(params, cb) {
                _checkParameters(params);
                return _get("avail", params, cb, "general");
            },
            roomImages: function(params, cb) {
                _checkParameters(params);
                return _get("roomImages", params, cb, "general");
            },
            acceptedPayments: function(params, cb) {
                _checkParameters(params);
                return _get("paymentInfo", params, cb, "general");
            }
        },
        // Reservation/Itinerary specific methods
        reservation: {
            book: function(params, cb) {
                //_checkParameters(params);
                _post("res", params, cb, "booking");
            },
            get: function(params, cb) {
                _checkParameters(params);
                return _get("itin", params, cb, "general");
            },
            cancel: function(params, cb) {
                _checkParameters(params);
                return _get("cancel", params, cb, "general");
            }
        }
    };
};