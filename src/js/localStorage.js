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

export function moveItemInLocalStorage(listKey, oldIndex, newIndex) {
    const list = loadFromLocalStorage(listKey);
    const [ movedItem ] = list.splice(oldIndex, 1);
    list.splice(newIndex, 0, movedItem);
    saveToLocalStorage(listKey, list);
}

export function moveItemBetweenListsInLocalStorage(sourceListKey, targetListKey, itemIndex, targetIndex) {
    const sourceList = loadFromLocalStorage(sourceListKey);
    const [ movedItem ] = sourceList.splice(itemIndex, 1);
    const targetList = loadFromLocalStorage(targetListKey);
    targetList.splice(targetIndex, 0, movedItem);
    saveToLocalStorage(sourceListKey, sourceList);
    saveToLocalStorage(targetListKey, targetList);
}
