(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common/http'), require('rxjs/Observable'), require('query-string'), require('rxjs/add/observable/of'), require('rxjs/add/observable/throw'), require('rxjs/add/operator/switchMap'), require('rxjs/ReplaySubject'), require('rxjs/add/operator/do'), require('rxjs/add/operator/finally'), require('rxjs/add/operator/map'), require('rxjs/add/operator/mapTo'), require('rxjs/add/operator/publishReplay'), require('rxjs/add/operator/take')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common/http', 'rxjs/Observable', 'query-string', 'rxjs/add/observable/of', 'rxjs/add/observable/throw', 'rxjs/add/operator/switchMap', 'rxjs/ReplaySubject', 'rxjs/add/operator/do', 'rxjs/add/operator/finally', 'rxjs/add/operator/map', 'rxjs/add/operator/mapTo', 'rxjs/add/operator/publishReplay', 'rxjs/add/operator/take'], factory) :
	(factory((global['oauth2-session'] = {}),global.http,global.Observable,global.queryString,null,null,null,global.ReplaySubject));
}(this, (function (exports,http,Observable,queryString,of,_throw,switchMap,ReplaySubject) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var BaseAuthenticator = (function () {
    function BaseAuthenticator() {
    }
    return BaseAuthenticator;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var OAuth2PasswordGrant = (function (_super) {
    __extends(OAuth2PasswordGrant, _super);
    function OAuth2PasswordGrant(httpClient) {
        var _this = _super.call(this) || this;
        _this.httpClient = httpClient;
        return _this;
    }
    /**
     * @param {?} credentials
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.authenticate = /**
     * @param {?} credentials
     * @return {?}
     */
    function (credentials) {
        var /** @type {?} */ params = __assign({}, credentials, { 'grant_type': 'password' });
        return this.request(this.serverTokenEndpoint, params)
            .switchMap(function (response) {
            var /** @type {?} */ accessToken = response['access_token'];
            if (!(accessToken || accessToken.length)) {
                return Observable.Observable.throw(new Error('access_token is missing in server response'));
            }
            var /** @type {?} */ expiresIn = response['expires_in'];
            var /** @type {?} */ expiresAt = OAuth2PasswordGrant.absolutizeExpirationTime(expiresIn);
            return Observable.Observable.of(__assign({}, response, { 'expires_at': expiresAt }));
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.refresh = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var /** @type {?} */ expiresIn = data['expires_in'];
        var /** @type {?} */ refreshToken = data['refresh_token'];
        var /** @type {?} */ params = {
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        };
        return this.request(this.serverTokenEndpoint, params)
            .switchMap(function (response) {
            expiresIn = response['expires_in'] || expiresIn;
            refreshToken = response['refresh_token'] || refreshToken;
            var /** @type {?} */ data = __assign({}, response, { 'expires_in': expiresIn, 'expires_at': OAuth2PasswordGrant.absolutizeExpirationTime(expiresIn), 'refresh_token': refreshToken });
            return Observable.Observable.of(data);
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.restore = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (this.isValid(data)) {
            if (this.isExpired(data)) {
                return this.refresh(data);
            }
            return Observable.Observable.of(data);
        }
        return Observable.Observable.of(null);
    };
    /**
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.request = /**
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    function (url, params) {
        if (params === void 0) { params = {}; }
        var /** @type {?} */ headers = new http.HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        var /** @type {?} */ body = queryString.stringify(__assign({}, params, { client_id: this.clientId, client_secret: this.clientSecret }));
        return this.httpClient.post(url, body, { headers: headers });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.isExpired = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return !data['expires_at'] || data['expires_at'] < Date.now();
    };
    /**
     * @param {?} data
     * @return {?}
     */
    OAuth2PasswordGrant.prototype.isValid = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return !!data['access_token'];
    };
    /**
     * @param {?} expiresIn
     * @return {?}
     */
    OAuth2PasswordGrant.absolutizeExpirationTime = /**
     * @param {?} expiresIn
     * @return {?}
     */
    function (expiresIn) {
        if (expiresIn) {
            return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
        }
    };
    return OAuth2PasswordGrant;
}(BaseAuthenticator));

var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var OAuth2Bearer = (function () {
    function OAuth2Bearer() {
    }
    /**
     * @param {?} data
     * @param {?} headers
     * @return {?}
     */
    OAuth2Bearer.prototype.authorize = /**
     * @param {?} data
     * @param {?} headers
     * @return {?}
     */
    function (data, headers) {
        var /** @type {?} */ authorized = __assign$1({}, headers);
        var /** @type {?} */ token = data['access_token'];
        if (token && token.length) {
            authorized['Authorization'] = "Bearer " + token;
        }
        return authorized;
    };
    return OAuth2Bearer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LocalStorage = (function () {
    function LocalStorage() {
    }
    /**
     * @param {?=} data
     * @return {?}
     */
    LocalStorage.prototype.persist = /**
     * @param {?=} data
     * @return {?}
     */
    function (data) {
        if (data === void 0) { data = {}; }
        var /** @type {?} */ jsonText = JSON.stringify(data);
        localStorage.setItem(this.key, jsonText);
        return Observable.Observable.of(true);
    };
    /**
     * @return {?}
     */
    LocalStorage.prototype.restore = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ jsonText = localStorage.getItem(this.key) || '{}';
        return Observable.Observable.of(JSON.parse(jsonText));
    };
    /**
     * @return {?}
     */
    LocalStorage.prototype.clear = /**
     * @return {?}
     */
    function () {
        localStorage.removeItem(this.key);
        return Observable.Observable.of(true);
    };
    return LocalStorage;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Session = (function () {
    // store: SessionStore;
    function Session(authenticator, authorizer, store) {
        var _this = this;
        this.authenticator = authenticator;
        this.authorizer = authorizer;
        this.store = store;
        this.data$ = new ReplaySubject.ReplaySubject(1);
        this.authenticated = this.data$.map(Session.isAuthenticatedHelper);
        this.data$.subscribe(function (data) { return _this.store.persist(data); });
    }
    Object.defineProperty(Session.prototype, "onAuthenticated", {
        get: /**
         * @return {?}
         */
        function () {
            return this.authenticated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Session.prototype, "isAuthenticated", {
        get: /**
         * @return {?}
         */
        function () {
            return this.authenticated.take(1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} credentials
     * @return {?}
     */
    Session.prototype.authenticate = /**
     * @param {?} credentials
     * @return {?}
     */
    function (credentials) {
        var _this = this;
        return this.isAuthenticated
            .switchMap(function (isAuthenticated) {
            if (isAuthenticated) {
                return Observable.Observable.throw(new Error('You must invalidate session first before you can authenticate it.'));
            }
            return _this.authenticator.authenticate(credentials);
        })
            .do(function (content) { return _this.data$.next({ content: content }); })
            .mapTo(true);
    };
    /**
     * @param {?=} headers
     * @return {?}
     */
    Session.prototype.authorize = /**
     * @param {?=} headers
     * @return {?}
     */
    function (headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        return this.data$.take(1)
            .switchMap(function (data) {
            if (!Session.isAuthenticatedHelper(data)) {
                return Observable.Observable.throw(new Error('Session must be authenticated before you can authorize headers.'));
            }
            var /** @type {?} */ authenticator = _this.authenticator;
            var /** @type {?} */ authorizer = _this.authorizer;
            if (authenticator.isValid(data.content)) {
                if (!authenticator.isExpired(data.content)) {
                    return Observable.Observable.of(authorizer.authorize(data.content, headers));
                }
                if (!_this.refresh$) {
                    _this.refresh$ = authenticator.refresh(data.content)
                        .do(function (content) { return _this.data$.next({ content: content }); })
                        .finally(function () { _this.refresh$ = undefined; })
                        .publishReplay(1)
                        .refCount();
                }
                return _this.refresh$.map(function (content) { return authorizer.authorize(content, headers); });
            }
            return Observable.Observable.throw(new Error('Session data is invalid.'));
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.invalidate = /**
     * @return {?}
     */
    function () {
        this.data$.next({});
        return Observable.Observable.of(true);
    };
    /**
     * @return {?}
     */
    Session.prototype.restore = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.store.restore()
            .switchMap(function (restoredData) {
            if (restoredData.content) {
                return _this.authenticator.restore(restoredData.content);
            }
            return Observable.Observable.of(null);
        })
            .do(function (content) { return _this.data$.next({ content: content }); }, function (error) { return _this.data$.next({ content: null }); })
            .map(function (content) { return !!content; });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Session.isAuthenticatedHelper = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return (data && data.content);
    };
    return Session;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

exports.OAuth2PasswordGrant = OAuth2PasswordGrant;
exports.OAuth2Bearer = OAuth2Bearer;
exports.LocalStorage = LocalStorage;
exports.Session = Session;

Object.defineProperty(exports, '__esModule', { value: true });

})));
