import { ApiUrl } from './Api'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

/**
 * @returns {Promise<Response>}
 */
export function getInactiveSettings() {
  return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`)
}

/**
 * @returns {Promise<Response>}
 */
export function getRefreshInterval() {
  return Auth.fetch(`${ApiUrl}/admin/settings/refresh_interval`)
}

/**
 * @param {object} data
 * @returns {Promise<Response>}
 */
export function putInactiveSettings(data) {
  return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`, {
    body: JSON.stringify(data),
    method: 'PUT',
  })
}

/**
 * @param {object} data
 * @returns {Promise<Response>}
 */
export function putRefreshInterval(data) {
  return Auth.fetch(`${ApiUrl}/admin/settings/refresh_interval`, {
    body: JSON.stringify(data),
    method: 'PUT',
  })
}
