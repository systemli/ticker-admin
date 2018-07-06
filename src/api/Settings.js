import {ApiUrl} from "./Api";
import AuthService from "../components/AuthService";

/**
 *
 * @returns {Promise<any>}
 */
export function getInactiveSettings() {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`);
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export function putInactiveSettings(data) {
    const Auth = new AuthService();

    return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`, {
        body: JSON.stringify(data),
        method: 'PUT'
    });
}
