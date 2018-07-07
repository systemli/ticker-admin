import {ApiUrl} from "./Api";
import AuthSingleton from "../components/AuthService";

const Auth = AuthSingleton.getInstance();

/**
 * @returns {Promise<Response>}
 */
export function getTickers() {
    return Auth.fetch(`${ApiUrl}/admin/tickers`);
}

/**
 *
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function getTicker(id) {
    return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`);
}

/**
 *
 * @param {object} data
 * @returns {Promise<Response>}
 */
export function postTicker(data) {
    return Auth.fetch(`${ApiUrl}/admin/tickers`, {
        body: JSON.stringify(data),
        method: 'POST'
    });
}

/**
 *
 * @param {object} data
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function putTicker(data, id) {
    return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}

/**
 *
 * @param data
 * @param id
 * @returns {Promise<any>}
 */
export function putTickerTwitter(data, id) {
    return AuthSingleton.getInstance().fetch(`${ApiUrl}/admin/tickers/${id}/twitter`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}

/**
 *
 * @param id
 */
export function deleteTicker(id) {
    return AuthSingleton.getInstance().fetch(`${ApiUrl}/admin/tickers/${id}`, {
        method: 'DELETE'
    });
}
