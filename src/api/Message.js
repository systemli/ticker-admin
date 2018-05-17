import {API_URL} from "./Api";

/**
 *
 * @returns {Promise<any>}
 */
export function getMessages(ticker) {
    return fetch(`${API_URL}/admin/messages?ticker=${ticker}`).then(response => response.json());
}

/**
 *
 * @param id
 * @param text
 * @returns {Promise<any>}
 */
export function postMessage(id, text) {
    return fetch(`${API_URL}/admin/messages`, {
        body: JSON.stringify({
            text: text,
            ticker: parseInt(id, 10)
        }),
        headers: {'content-type': 'application/json'},
        method: 'POST'
    }).then(response => response.json());
}

/**
 *
 * @param id
 * @returns {Promise<any>}
 */
export function deleteMessage(id) {
    return fetch(`${API_URL}/admin/messages/${id}`, {
        headers: {'content-type': 'application/json'},
        method: 'DELETE'
    }).then(response => response.json());
}
