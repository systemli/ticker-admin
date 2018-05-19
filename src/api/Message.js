import {ApiUrl} from "./Api";
import AuthService from "../components/AuthService";

/**
 *
 * @returns {Promise<any>}
 */
export function getMessages(ticker) {
    const Auth = new AuthService(ApiUrl);

    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`);
}

/**
 *
 * @param ticker
 * @param text
 * @returns {Promise<any>}
 */
export function postMessage(ticker, text) {
    const Auth = new AuthService(ApiUrl);

    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
        body: JSON.stringify({
            text: text
        }),
        method: 'POST'
    });
}

/**
 *
 * @param ticker
 * @param message
 * @returns {Promise<any>}
 */
export function deleteMessage(ticker, message) {
    const Auth = new AuthService(ApiUrl);

    return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages/${message}`, {
        method: 'DELETE'
    });
}
