import {ApiUrl} from "./Api";
import AuthSingleton from "../components/AuthService";

const Auth = AuthSingleton.getInstance();

/**
 * @param {string} ticker
 * @returns {Promise<Response>}
 */
export function getMessages(ticker) {
    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`);
}

/**
 *
 * @param {string} ticker
 * @param {string} text
 * @returns {Promise<Response>}
 */
export function postMessage(ticker, text, geoInformation) {
    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
        body: JSON.stringify({
            text: text,
            geo_information: geoInformation
        }),
        method: 'POST'
    });
}

/**
 *
 * @param {string} ticker
 * @param {string} message
 * @returns {Promise<any>}
 */
export function deleteMessage(ticker, message) {
    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages/${message}`, {
        method: 'DELETE'
    });
}
