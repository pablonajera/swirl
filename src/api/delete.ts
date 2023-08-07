import { useState, useEffect } from 'react'
import { makeRequest } from '../utils/make-request'
import { type Response } from '../types/response'
import { parametrize } from '../utils/parametrize'
import { pick } from '../utils/pick'

export function del<T> ({
  url,
  body = {},
  parameters = {},
  options = {}
}: {
  url: string
  body?: any
  parameters?: Record<string, any> | null
  options?: RequestInit
}): Response<T> {
  return makeRequest({ url, method: 'DELETE', body, parameters, options })
}

export function useDelete<T> ({
  url,
  body = {},
  parameters = {},
  options = {}
}: {
  url: string
  body?: any
  parameters?: Record<string, any> | null
  options?: RequestInit
}): Response<T> {
  const cleanedOptions = pick(options, [
    'headers',
    'mode',
    'credentials',
    'cache',
    'redirect',
    'referrer',
    'referrerPolicy',
    'integrity'
  ])

  if (cleanedOptions.headers == null) {
    cleanedOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined)

  let finalUrl = url
  if (parameters != null) {
    const queryString = parametrize(parameters)
    finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }

  useEffect(() => {
    fetch(finalUrl, {
      method: 'DELETE',
      body: JSON.stringify(body),
      ...cleanedOptions
    })
      .then(async (apiResponse) => {
        setStatusCode(apiResponse.status)
        if (apiResponse.ok) {
          const responseData = await apiResponse.json()
          return responseData
        }
        return await Promise.reject(apiResponse)
      })
      .then((responseData) => {
        setData(responseData)
      })
      .catch((apiError) => {
        setError(apiError)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return {
    data,
    isLoading,
    error,
    statusCode
  }
}
