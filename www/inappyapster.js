/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

(function () {
    // special patch to correctly work on Ripple emulator (CB-9760)
    if (window.parent && !!window.parent.ripple) { // https://gist.github.com/triceam/4658021
        module.exports = window.open.bind(window); // fallback to default window.open behaviour
        return;
    }

    var exec = require('cordova/exec');
    var channel = require('cordova/channel');
    var modulemapper = require('cordova/modulemapper');
    var urlutil = require('cordova/urlutil');

    function InAppYapster () {
        this.channels = {
            'beforeload': channel.create('beforeload'),
            'loadstart': channel.create('loadstart'),
            'loadstop': channel.create('loadstop'),
            'loaderror': channel.create('loaderror'),
            'exit': channel.create('exit'),
            'customscheme': channel.create('customscheme'),
            'message': channel.create('message')
        };
    }

    InAppYapster.prototype = {

        _eventHandler: function (event) {
            if (event && (event.type in this.channels)) {
                if (event.type === 'beforeload') {
                    this.channels[event.type].fire(event, this._loadAfterBeforeload);
                } else {
                    this.channels[event.type].fire(event);
                }
            }
        },
        _loadAfterBeforeload: function (strUrl) {
            strUrl = urlutil.makeAbsolute(strUrl);
            exec(null, null, 'InAppYapster', 'loadAfterBeforeload', [strUrl]);
        },
        close: function (eventname) {
            exec(null, null, 'InAppYapster', 'close', []);
        },
        show: function (eventname) {
            exec(null, null, 'InAppYapster', 'show', []);
        },
        hide: function (eventname) {
            exec(null, null, 'InAppYapster', 'hide', []);
        },
        addEventListener: function (eventname, f) {
            if (eventname in this.channels) {
                this.channels[eventname].subscribe(f);
            }
        },
        removeEventListener: function (eventname, f) {
            if (eventname in this.channels) {
                this.channels[eventname].unsubscribe(f);
            }
        },

        executeScript: function (injectDetails, cb) {
            if (injectDetails.code) {
                exec(cb, null, 'InAppYapster', 'injectScriptCode', [injectDetails.code, !!cb]);
            } else if (injectDetails.file) {
                exec(cb, null, 'InAppYapster', 'injectScriptFile', [injectDetails.file, !!cb]);
            } else {
                throw new Error('executeScript requires exactly one of code or file to be specified');
            }
        },

        insertCSS: function (injectDetails, cb) {
            if (injectDetails.code) {
                exec(cb, null, 'InAppYapster', 'injectStyleCode', [injectDetails.code, !!cb]);
            } else if (injectDetails.file) {
                exec(cb, null, 'InAppYapster', 'injectStyleFile', [injectDetails.file, !!cb]);
            } else {
                throw new Error('insertCSS requires exactly one of code or file to be specified');
            }
        },
        
        initialize: function (opts) {
            var yapsterBaseUrl = opts.baseUrl;
            var beforeloadCB = function(params, callback) {
                console.log("_beforeloadCallback");
                console.log("_beforeloadCallback: " + yapsterBaseUrl);
                if (params.url.startsWith("file:///") ||
                    params.url.startsWith(yapsterBaseUrl)) {
                    // Load this URL in the inAppYapster.
                    callback(params.url);
                } else if (params.url.startsWith("itms") ||
                           params.url.startsWith("https://itunes.apple.com") ||
                           params.url.startsWith("https://play.google.com/store/apps/details")) {
                    var otherOpts = {baseUrl: params.url};
                    cordova.InAppBrowser.open(params.url, "_system", "")
                }  else {
                    // The callback is not invoked, so the page will not be loaded.
                    alert("Can't open the url from this Yapster version. Please download the full Yapster app.");
                }
            }

            this.addEventListener('beforeload', beforeloadCB);
        },
    };

    module.exports = function (opts, strWindowName, strWindowFeatures, callbacks) {
        // Don't catch calls that write to existing frames (e.g. named iframes).
        if (window.frames && window.frames[strWindowName]) {
            var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
            return origOpenFunc.apply(window, arguments);
        }

        var strUrl = null;
        console.log("opening yapster");
        var yapsterBaseUrl = opts.baseUrl;
        console.log("baseUrl: " + yapsterBaseUrl);

        var platform = "unknown";
        if (cordova && cordova.platformId) {
            platform = cordova.platformId;
        }
        let host = opts.baseUrl;
        let authToken = opts.authToken;
        let fullUrl = `${host}?lite&api-key=${authToken}&platform=${platform}`;
        let options = "hidden=yes,location=no,beforeload=yes,hidenavigationbuttons=yes,disallowoverscroll=yes";
        
        strUrl = urlutil.makeAbsolute(fullUrl);
        var iab = new InAppYapster();
        iab.initialize(opts);
        console.log("strUrl " + strUrl);
        
        callbacks = callbacks || {};
        for (var callbackName in callbacks) {
            iab.addEventListener(callbackName, callbacks[callbackName]);
        }
        var cb = function (eventname) {
            iab._eventHandler(eventname);
        };

        strWindowFeatures = strWindowFeatures || options;

        exec(cb, cb, 'InAppYapster', 'open', [strUrl, strWindowName, strWindowFeatures]);
        return iab;
    };
})();
