import {ApiUrl} from "./Api";
import AuthService from "../components/AuthService";

/**
 *
 * @returns {Promise<any>}
 */
export function getTickers() {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/tickers`);
}

/**
 *
 * @param id
 * @returns {Promise<any>}
 */
export function getTicker(id) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`);
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function postTicker(data) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/tickers`, {
        body: JSON.stringify(data),
        method: 'POST'
    });
}

/**
 *
 * @param data
 * @param id
 * @returns {Promise<any>}
 */
export function putTicker(data, id) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}

/**
 *
 * @param id
 */
export function deleteTicker(id) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`, {
        method: 'DELETE'
    });
}
