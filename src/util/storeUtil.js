const formatKey = key => key.replace(/\W/g, '_');

export function setLocalStorage(key, value) {
  localStorage.setItem(formatKey(key), value);
}

export function getLocalStorage(key) {
  return localStorage.getItem(formatKey(key));
}

export function removeLocalStorage(key) {
  localStorage.removeItem(formatKey(key));
}

export default { setLocalStorage, getLocalStorage, removeLocalStorage };
