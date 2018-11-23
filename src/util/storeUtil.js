const formatKey = key => key.replace(/\W/g, '_');

export function setLocalStorage(key, value) {
  sessionStorage.setItem(formatKey(key), value);
}

export function getLocalStorage(key) {
  return sessionStorage.getItem(formatKey(key));
}

export function removeLocalStorage(key) {
  sessionStorage.removeItem(formatKey(key));
}

export default { setLocalStorage, getLocalStorage, removeLocalStorage };
