import { initDragAndDrop } from './DnD';
import { removeItem } from './removeItem';
import { addItem } from './addItem';
import { loadFromLocalStorage } from './localStorage';

const container = document.querySelector('.container');
container.addEventListener('click', removeItem);
container.addEventListener('click', addItem);
initDragAndDrop(container);

const loadInitialData = () => {
    const columns = document.querySelectorAll('.column');
    columns.forEach((column, index) => {
        const list = column.querySelector('.list');
        const listKey = `list-${index + 1}`;
        list.dataset.listKey = listKey;
        const items = loadFromLocalStorage(listKey);
        items.forEach(itemText => {
            const newItem = document.createElement('li');
            newItem.classList.add('item');
            newItem.innerHTML = `${itemText}<span class="remove-icon">×</span>`;
            list.appendChild(newItem);
        });
    });
};

loadInitialData();