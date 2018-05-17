import {API_URL} from "./Api";

/**
 *
 * @returns {Promise<any>}
 */
export function getTickers() {
    return fetch(`${API_URL}/admin/tickers`).then(response => response.json());
}

/**
 *
 * @param id
 * @returns {Promise<any>}
 */
export function getTicker(id) {
    return fetch(`${API_URL}/admin/tickers/${id}`).then(response => response.json());
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function postTicker(data) {
    return fetch(`${API_URL}/admin/tickers`, {
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'},
        method: 'POST'
    }).then(response => response.json());
}

/**
 *
 * @param data
 * @param id
 * @returns {Promise<any>}
 */
export function putTicker(data, id) {
    return fetch(`${API_URL}/admin/tickers/${id}`, {
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'},
        method: 'PUT'
    }).then(response => response.json());
}

/**
 *
 * @param id
 */
export function deleteTicker(id) {
    return fetch(`${API_URL}/admin/tickers/${id}`, {
        headers: {'content-type': 'application/json'},
        method: 'DELETE'
    }).then(response => response.json());
}
