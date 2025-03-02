export const cookie = {
  set: function({ name, value, days }) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + expireDate.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
  },

  get: function(name) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  },

  remove: function(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};

export const debounce = function(fn, delay) {
  let timeoutId;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const getStaticUrl = function(path) {
  return `${process.env.NODE_ENV === "production" ? "/google-sheets" : ""}${path}`;
};

export const convertToTitle = function(n) {
  if (n < 27) return String.fromCharCode(n + 64);

  let s = "";

  while (n > 0) {
    let temp = n % 26;
    temp = temp === 0 ? 26 : temp;
    s = String.fromCharCode(temp + 64) + s;
    n -= temp;
    n /= 26;
  }

  return s;
};
