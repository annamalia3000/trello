import { createItem, createEditor } from './createItem';
export function addItem(e) {
    if (e.target.classList.contains('add-item')) {
        const currentList = e.target.closest('.column').querySelector('.list');
        const addCard = e.target;

        addCard.style.display = 'none'; 
        createEditor(currentList, addCard);
    }
};