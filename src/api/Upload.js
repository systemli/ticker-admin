import {ApiUrl} from "./Api";
import AuthSingleton from "../components/AuthService";

const Auth = AuthSingleton.getInstance();

/**
 *
 * @param {FormData} formData
 * @returns {Promise<Response>}
 */
export function postUpload(formData) {
    return Auth.fetch(`${ApiUrl}/admin/upload`, {
        body: formData,
        method: 'POST'
    });
}
