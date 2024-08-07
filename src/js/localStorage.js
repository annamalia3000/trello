export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

export function addItemToLocalStorage(listKey, item) {
    const list = loadFromLocalStorage(listKey);
    list.push(item);
    saveToLocalStorage(listKey, list);
}

export function removeItemFromLocalStorage(listKey, itemIndex) {
    const list = loadFromLocalStorage(listKey);
    list.splice(itemIndex, 1);
    saveToLocalStorage(listKey, list);
}