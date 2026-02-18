import { ApiUrl, apiHeaders } from './Api'
import {
  fetchInactiveSettingsApi,
  fetchTelegramSettingsApi,
  putInactiveSettingsApi,
  putTelegramSettingsApi,
  fetchSignalGroupSettingsApi,
  putSignalGroupSettingsApi,
} from './Settings'

describe('fetchInactiveSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 1,
          name: 'inactive_settings',
          value: {
            headline: 'headline',
            subHeadline: 'subHeadline',
            description: 'description',
            author: 'author',
            email: 'email',
            homepage: 'homepage',
            twitter: 'twitter',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchInactiveSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchInactiveSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchInactiveSettingsApi('token')
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, { headers: apiHeaders('token') })
  })
})

describe('putInactiveSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 1,
          name: 'inactive_settings',
          value: {
            headline: 'headline',
            subHeadline: 'subHeadline',
            description: 'description',
            author: 'author',
            email: 'email',
            homepage: 'homepage',
            twitter: 'twitter',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putInactiveSettingsApi('token', {
      headline: 'headline',
      subHeadline: 'subHeadline',
      description: 'description',
      author: 'author',
      email: 'email',
      homepage: 'homepage',
      twitter: 'twitter',
    })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify(data.data.setting.value),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putInactiveSettingsApi('token', {
      headline: 'headline',
      subHeadline: 'subHeadline',
      description: 'description',
      author: 'author',
      email: 'email',
      homepage: 'homepage',
      twitter: 'twitter',
    })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({
        headline: 'headline',
        subHeadline: 'subHeadline',
        description: 'description',
        author: 'author',
        email: 'email',
        homepage: 'homepage',
        twitter: 'twitter',
      }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putInactiveSettingsApi('token', {
      headline: 'headline',
      subHeadline: 'subHeadline',
      description: 'description',
      author: 'author',
      email: 'email',
      homepage: 'homepage',
      twitter: 'twitter',
    })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/inactive_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({
        headline: 'headline',
        subHeadline: 'subHeadline',
        description: 'description',
        author: 'author',
        email: 'email',
        homepage: 'homepage',
        twitter: 'twitter',
      }),
    })
  })
})

describe('fetchTelegramSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 2,
          name: 'telegram_settings',
          value: {
            token: '****wxyz',
            botUsername: 'test_bot',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTelegramSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, { headers: apiHeaders('token') })
  })

  it('should return error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTelegramSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, { headers: apiHeaders('token') })
  })

  it('should return error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchTelegramSettingsApi('token')
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, { headers: apiHeaders('token') })
  })
})

describe('putTelegramSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 2,
          name: 'telegram_settings',
          value: {
            token: '****abcd',
            botUsername: 'updated_bot',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTelegramSettingsApi('token', { token: 'new-bot-token' })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ token: 'new-bot-token' }),
    })
  })

  it('should return error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTelegramSettingsApi('token', { token: 'new-bot-token' })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ token: 'new-bot-token' }),
    })
  })

  it('should return error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTelegramSettingsApi('token', { token: 'new-bot-token' })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/telegram_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ token: 'new-bot-token' }),
    })
  })
})

describe('fetchSignalGroupSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 3,
          name: 'signal_group_settings',
          value: {
            apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
            account: '+1234567890',
            avatar: '/path/to/avatar.png',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchSignalGroupSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, { headers: apiHeaders('token') })
  })

  it('should return error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchSignalGroupSettingsApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, { headers: apiHeaders('token') })
  })

  it('should return error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchSignalGroupSettingsApi('token')
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, { headers: apiHeaders('token') })
  })
})

describe('putSignalGroupSettingsApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = {
      status: 'success',
      data: {
        setting: {
          id: 3,
          name: 'signal_group_settings',
          value: {
            apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
            account: '+1234567890',
            avatar: '/path/to/avatar.png',
          },
        },
      },
    }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putSignalGroupSettingsApi('token', {
      apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
      account: '+1234567890',
      avatar: '/path/to/avatar.png',
    })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({
        apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
        account: '+1234567890',
        avatar: '/path/to/avatar.png',
      }),
    })
  })

  it('should return error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putSignalGroupSettingsApi('token', {
      apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
      account: '+1234567890',
      avatar: '/path/to/avatar.png',
    })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({
        apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
        account: '+1234567890',
        avatar: '/path/to/avatar.png',
      }),
    })
  })

  it('should return error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putSignalGroupSettingsApi('token', {
      apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
      account: '+1234567890',
      avatar: '/path/to/avatar.png',
    })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/settings/signal_group_settings`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({
        apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
        account: '+1234567890',
        avatar: '/path/to/avatar.png',
      }),
    })
  })
})
