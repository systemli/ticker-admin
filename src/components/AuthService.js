import decode from 'jwt-decode';
import {ApiUrl} from "../api/Api";

/**
 * @type {{getInstance}}
 */
let AuthSingleton = (function () {
    let instance;

    /**
     * @returns {AuthService}
     */
    function createInstance() {
        return new AuthService();
    }

    return {
        /**
         * @returns {AuthService}
         */
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        }
    }
})();

class AuthService {
    constructor() {
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.loggedIn = this.loggedIn.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.checkResponse = this.checkResponse.bind(this);
        this.refreshToken = this.refreshToken.bind(this);

        setInterval(() => this.refreshToken(), 5000);
    }

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Response>}
     */
    login(username, password) {
        return this.fetch(`${ApiUrl}/admin/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then((response) => {
            this.setToken(response.token);

            return Promise.resolve(response);
        });
    }

    /**
     * @returns {boolean}
     */
    loggedIn() {
        const token = this.getToken();

        return !!token && !this.isTokenExpired(token);
    }

    /**
     * @param {string} token
     * @returns {boolean}
     */
    isTokenExpired(token) {
        try {
            const decoded = decode(token);

            return decoded.exp < Date.now() / 1000;
        } catch (err) {
            return false;
        }
    }

    /**
     * @param {string} token
     */
    setToken(token) {
        localStorage.setItem('id_token', token);
    }

    /**
     * @returns {string | null}
     */
    getToken() {
        return localStorage.getItem('id_token');
    }

    /**
     * @param {string} token
     * @returns {number}
     */
    getTokenExpiration(token) {
        if (null !== token) {
            const decoded = decode(token);

            return parseInt(decoded.exp, 10);
        }

        return 0;
    }

    /**
     * @returns {Promise<Response>|void}
     */
    refreshToken() {
        if (!this.loggedIn()) {
            return;
        }

        let now = Date.now() / 1000;
        let expire = this.getTokenExpiration(this.getToken());
        let limit = 60;

        if (now >= (expire - limit)) {
            return this.fetch(`${ApiUrl}/admin/refresh_token`)
                .then(response => {
                    if (response.token !== undefined) {
                        this.setToken(response.token);
                    }

                    return Promise.resolve(response);
                });
        }
    }

    /**
     * @returns {void}
     */
    removeToken() {
        localStorage.removeItem('id_token');
    }

    /**
     * @returns {object}
     */
    getProfile() {
        return decode(this.getToken());
    }

    /**
     * @param {Request|string} url
     * @param {object} options
     * @returns {Promise<Response>}
     */
    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }

        return fetch(url, {headers, ...options})
            .then(this.checkResponse)
            .then((response) => response.json());
    }

    /**
     * @param {Response} response
     * @returns {Response}
     * @throws Error
     */
    checkResponse(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            return response.json().then(data => {
                console.log(response.status);
                console.log(data);
                let error = new Error();

                error.message = data.error.message ? data.error.message : "Unknown error";
                error.code = data.error.code;
                error.response = response;

                throw error;
            });
        }
    }
}

export default AuthSingleton;
