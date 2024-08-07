import { createItem, createEditor } from './createItem';
import { addItemToLocalStorage } from './localStorage';

export function addItem(e) {
    if (e.target.classList.contains('add-item')) {
        const currentList = e.target.closest('.column').querySelector('.list');
        const addCard = e.target;

        addCard.style.display = 'none';
        createEditor(currentList, addCard);
    }
};

export function handleAddItem(listKey, itemText, currentList) {
    const newItem = createItem(itemText);
    addItemToLocalStorage(listKey, itemText);
    currentList.appendChild(newItem);
}
