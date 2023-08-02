import useSWR from 'swr';

class RequestError extends Error {
  constructor(message, info, status) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

async function fetcher(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorInfo = await response.json();
    throw new RequestError("An error occurred while fetching the data.", errorInfo, response.status);
  }
  return response.json();
}

function get(url, config) {
  const {
    data,
    error
  } = useSWR(url, fetcher, config);
  return {
    data,
    isLoading: !error && !data,
    error
  };
}

function makeNonCachingRequest({
  url,
  method,
  body,
  config
}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  const {
    data,
    error
  } = useSWR(() => fetcher(url, options), config);
  return {
    data,
    isLoading: !error && !data,
    error
  };
}

function post(url, body, config) {
  return makeNonCachingRequest({
    url,
    method: "POST",
    body,
    config
  });
}

function patch(url, body, config) {
  return makeNonCachingRequest({
    url,
    method: "PATCH",
    body,
    config
  });
}

function del(url, config) {
  return makeNonCachingRequest({
    url,
    method: "DELETE",
    body: undefined,
    config
  });
}

export { RequestError, del, get, patch, post };
