import axios from 'axios'

interface RequestObj {
  baseUrl?: string
  endpoint: string
  data?: any
  method?: string
  contentType?: string
}

function serialize(data: any) {
  return Object.keys(data)
    .map((keyName) => `${encodeURIComponent(keyName)}=${data[keyName] ? encodeURIComponent(data[keyName]) : ''}`)
    .join('&')
}

export const toResultObject = (promise: any) => {
  return promise.then((result: any) => ({ success: true, result })).catch((error: Error) => ({ success: false, error }))
}

export async function request({
  baseUrl = 'https://api.coingecko.com/api/v3',
  endpoint = '',
  data = null,
  method = 'GET',
  contentType = 'application/json',
  ...config
}: RequestObj) {
  let url = `${baseUrl}/${endpoint}`
  url = method === 'GET' && data !== null ? `${url}?${serialize(data)}` : url

  const options = {
    url,
    method,
    data:
      data === null || method === 'GET' ? undefined : contentType === 'application/json' ? JSON.stringify(data) : data,
    headers: {
      Accept: 'application/json',
      'Content-Type': contentType,
    },
    ...config,
  }

  return axios.request(options)
}

export const Coingecko = {
  getPrices: ({ ids }: { ids: Array<string> }) =>
    request({
      endpoint: `simple/price`,
      data: {
        ids: ids.join(','),
        vs_currencies: 'USD',
      },
    }),
}
