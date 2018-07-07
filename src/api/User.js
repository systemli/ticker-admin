import {ApiUrl} from "./Api";
import AuthSingleton from "../components/AuthService";

const Auth = AuthSingleton.getInstance();

/**
 * @returns {Promise<Response>}
 */
export function getUsers() {
    return Auth.fetch(`${ApiUrl}/admin/users`);
}

/**
 * @param {object} data
 * @returns {Promise<Response>}
 */
export function postUser(data) {
    return Auth.fetch(`${ApiUrl}/admin/users`, {
        body: JSON.stringify(data),
        method: 'POST'
    });
}

/**
 * @param {object} data
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function putUser(data, id) {
    return Auth.fetch(`${ApiUrl}/admin/users/${id}`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}

/**
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function deleteUser(id) {
    return Auth.fetch(`${ApiUrl}/admin/users/${id}`, {
        method: 'DELETE'
    });
}
