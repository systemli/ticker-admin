/**
 * @type {{getInstance}}
 */
let AuthSingleton = (function () {
  let instance

  /**
   * @returns {AuthService}
   */
  function createInstance() {
    return new AuthService()
  }

  return {
    /**
     * @returns {AuthService}
     */
    getInstance: function () {
      if (!instance) {
        instance = createInstance()
      }

      return instance
    },
  }
})()

class AuthService {
  constructor() {
    this.fetch = this.fetch.bind(this)
    this.checkResponse = this.checkResponse.bind(this)
  }

  /**
   * @param {Request|string} url
   * @param {object} options
   * @returns {Promise<Response>}
   */
  fetch(url, options) {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    //With formData the Content-Type will be set automatically
    if (options !== undefined && options.body instanceof FormData) {
      headers = {}
    }

    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')

    return fetch(url, { headers, ...options })
      .then(this.checkResponse)
      .then(response => response.json())
  }

  /**
   * @param {Response} response
   * @returns {Response}
   * @throws Error
   */
  checkResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      return response.json().then(data => {
        let error = new Error()

        error.message = data.error.message
          ? data.error.message
          : 'Unknown error'
        error.code = data.error.code
        error.response = response

        throw error
      })
    }
  }
}

export default AuthSingleton
