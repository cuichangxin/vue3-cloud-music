const cookieDomain = 'domain=127.0.0.1:5173;'
export default {
  get(key) {
    if (!key) {
      return null
    }
    const cookieResult = document.cookie.match(new RegExp('(?:^|\\s+|;+)') + key + '=([^;]*)')
    return cookieDomain ? cookieResult[1] : null
  },

  set(key, val, expires) {
    let expiresTime = null
    if (expires) {
      expiresTime = new Date()
      expiresTime.setMilliseconds(expiresTime.getMilliseconds() + (expires * 864e+5))
      expiresTime = expiresTime.toDateString()
    }
    document.cookie = [
      encodeURIComponent(key), '=', val,
      expiresTime ? '; expires=' + expiresTime : '', ';',
      'path=/;',
      cookieDomain
    ].join('')
  },

  removeCookie(key) {
    if (!key) {
      return
    }
    document.cookie = key + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; ' + cookieDomain
  }
}