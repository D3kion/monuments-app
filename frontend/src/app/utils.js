export default function fetch_(method, url, withToken=true, body={}) {
  let headers = new Headers({
    'Content-Type': 'application/json',
  })
  if (withToken)
    headers.append('Authorization', 'Token ' + localStorage.token)

  let href = 'http://' + location.hostname + ':8000/' + url
  let request = new Request(href, {
    method,
    headers,
    body,
  })

  return fetch(request)
}
