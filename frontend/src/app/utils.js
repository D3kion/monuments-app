/* eslint-disable no-undef */
export function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + "=")) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

const fetch_ = global.fetch;
export function fetch(method, url, body=null, withToken=true, headers_=null) {
  const headers = headers_ || new Headers();
  if (withToken) {
    headers.append("Authorization", "Token " + localStorage.token);
  }

  if (!csrfSafeMethod(method)) {
    headers.append("X-CSRFToken", getCookie("csrftoken"));
  }

  const href = `${location.protocol}://${location.host}/${url}`;
  const request = new Request(href, { method, body, headers });

  return fetch_(request);
}
