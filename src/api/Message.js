import {API_URL} from "./Api";

/**
 *
 * @returns {Promise<any>}
 */
export function getMessages(ticker) {
    return fetch(`${API_URL}/admin/tickers/${ticker}/messages`).then(response => response.json());
}

/**
 *
 * @param ticker
 * @param text
 * @returns {Promise<any>}
 */
export function postMessage(ticker, text) {
    return fetch(`${API_URL}/admin/tickers/${ticker}/messages`, {
        body: JSON.stringify({
            text: text
        }),
        headers: {'content-type': 'application/json'},
        method: 'POST'
    }).then(response => response.json());
}

/**
 *
 * @param ticker
 * @param message
 * @returns {Promise<any>}
 */
export function deleteMessage(ticker, message) {
    return fetch(`${API_URL}/admin/tickers/${ticker}/messages/${message}`, {
        headers: {'content-type': 'application/json'},
        method: 'DELETE'
    }).then(response => response.json());
}
