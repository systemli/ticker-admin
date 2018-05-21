import {ApiUrl} from "./Api";
import AuthService from "../components/AuthService";

/**
 *
 * @returns {Promise<any>}
 */
export function getUsers() {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/users`);
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function postUser(data) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/users`, {
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
export function putUser(data, id) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/users/${id}`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}
