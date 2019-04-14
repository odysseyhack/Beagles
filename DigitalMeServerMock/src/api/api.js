const BASE_PATH = "https://cem3gk697c.execute-api.eu-central-1.amazonaws.com/default".replace(
  /\/+$/,
  ""
);

export function registerinforequestPost(registerInfoRequestInput) {
  // https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = proxyurl + BASE_PATH + "/registerinforequest";

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(registerInfoRequestInput || {})
  };
  return fetch(url, options).then(handleResponse);
}

export function isinforequestauthorizedGet(requestId) {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const qs = "?" + getQueryString({ requestId: requestId });
  const url = proxyurl + BASE_PATH + "/isinforequestauthorized" + qs;

  const options = { method: "GET" };
  return fetch(url, options).then(handleResponse);
}

async function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error(response.status + " " + response.statusText);
  }
}

function getQueryString(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");
}
