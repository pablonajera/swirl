import chalk from 'chalk'
import hash from 'stable-hash'

class LocalCache {
  storagePrefix = 'SWIRL_DATA'
  constructor ({
    maxSize = Number.MAX_SAFE_INTEGER,
    useLocalStorage = false
  }) {
    this.maxSize = maxSize
    this.dataMap = new Map()
    if (useLocalStorage) {
      this.storage = window?.localStorage ?? null
      this.rehydrateFromLocalStorage()
    } else {
      this.storage = null
    }
  }

  rehydrateFromLocalStorage () {
    if (this.storage != null) {
      Object.keys(this.storage).forEach((key) => {
        if (key?.startsWith(this.storagePrefix)) {
          const value = this.storage?.getItem(key)
          if (typeof value === 'string') {
            this.dataMap.set(key, value)
          }
        }
      })
    } else {
      console.log(chalk.red('LocalStorage not found, possibly because this is not running in the browser. Using only in-memory cache.'))
    }
  }

  generateStorageKey (key) {
    const normalizedKey = key.toLowerCase().replace(/\/$/, '')
    return hash(`${this.storagePrefix}_${normalizedKey}`)
  }

  set (key, value) {
    const storageKey = this.generateStorageKey(key)
    const jsonValue = JSON.stringify(value)
    if (this.storage != null) {
      this.storage.setItem(storageKey, jsonValue)
    }
    this.dataMap.set(storageKey, jsonValue)
    this.maintainSize()
  }

  get (key) {
    const storageKey = this.generateStorageKey(key)
    const value = this.dataMap.get(storageKey)
    if (value != null) {
      this.dataMap.delete(storageKey)
      this.dataMap.set(storageKey, value)
      return JSON.parse(value)
    }
    return null
  }

  has (key) {
    const storageKey = this.generateStorageKey(key)
    return this.dataMap.has(storageKey)
  }

  maintainSize () {
    if (this.dataMap.size > this.maxSize) {
      const oldestKey = this.dataMap.keys().next().value
      this.dataMap.delete(oldestKey)
    }
  }
}

const cache = new LocalCache({
  maxSize: 100,
  useLocalStorage: true
})

function deepCompare (x, y) {
  return hash(x) === hash(y)
}

function parametrize (params) {
  const queryParams = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
  return queryParams
}

function pick (obj, keys) {
  const newObj = {}
  keys.forEach((key) => {
    newObj[key] = obj[key]
  })
  return newObj
}

function get (url, {
  parameters = null,
  disableCache = false,
  options = {}
}) {
  const cleanedOptions = pick(options, ['headers', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'referrerPolicy', 'integrity'])
  const response = {
    data: undefined,
    isLoading: true,
    error: undefined,
    statusCode: undefined
  }
  let finalUrl = url
  if (parameters != null) {
    const queryString = parametrize(parameters)
    finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }
  if (!disableCache && cache.has(finalUrl)) {
    response.data = cache.get(finalUrl)
    response.isLoading = false
  }
  fetch(finalUrl, {
    method: 'GET',
    ...cleanedOptions
  }).then(async (apiResponse) => {
    response.statusCode = apiResponse.status
    if (apiResponse.ok) {
      const responseData = await apiResponse.json()
      return responseData
    }
    return await Promise.reject(response)
  }).then((responseData) => {
    if (!deepCompare(responseData, response.data)) {
      response.data = responseData
      if (!disableCache) {
        cache.set(url, responseData)
      }
    }
  }).catch((error) => {
    response.error = error
  })
    .finally(() => {
      response.isLoading = false
    })
  return response
}

function makeRequest ({
  url,
  method,
  parameters = {},
  body = {},
  options = {}
}) {
  const cleanedOptions = pick(options, ['headers', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'referrerPolicy', 'integrity'])
  const response = {
    data: undefined,
    isLoading: true,
    error: undefined,
    statusCode: undefined
  }
  if (parameters != null) {
    const queryString = parametrize(parameters)
    if (url.includes('?')) {
      url = `${url}&${queryString}`
    } else {
      url = `${url}?${queryString}`
    }
  }
  fetch(url, {
    method,
    body: JSON.stringify(body),
    ...cleanedOptions
  }).then(async (apiResponse) => {
    response.statusCode = apiResponse.status
    if (apiResponse.ok) {
      return await apiResponse.json()
    }
    return await Promise.reject(response)
  }).then((responseData) => {
    response.data = responseData
  }).catch((error) => {
    response.error = error
  })
    .finally(() => {
      response.isLoading = false
    })
  return response
}

function post ({
  url,
  body = {},
  parameters = {},
  options = {}
}) {
  return makeRequest({
    url,
    method: 'POST',
    body,
    parameters,
    options
  })
}

function patch ({
  url,
  body = {},
  parameters = {},
  options = {}
}) {
  return makeRequest({
    url,
    method: 'PATCH',
    body,
    parameters,
    options
  })
}

function del ({
  url,
  body = {},
  parameters = {},
  options = {}
}) {
  return makeRequest({
    url,
    method: 'DELETE',
    body,
    parameters,
    options
  })
}

function put ({
  url,
  body = {},
  parameters = {},
  options = {}
}) {
  return makeRequest({
    url,
    method: 'PUT',
    body,
    parameters,
    options
  })
}

class RequestError extends Error {
  constructor (message, info, status) {
    super(message)
    this.info = info
    this.status = status
  }
}

export { RequestError, del, get, patch, post, put }
