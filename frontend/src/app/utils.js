/* eslint-disable no-undef */
export default function fetch_(method, url, body=null, withToken=true, headers_=null) {
  let headers = headers_ || new Headers();
  if (withToken)
    headers.append("Authorization", "Token " + localStorage.token);

  let href = "http://" + location.hostname + ":8000/" + url;
  let request = new Request(href, {
    method,
    headers,
    body,
  });

  return fetch(request);
}
