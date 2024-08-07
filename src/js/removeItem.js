import { removeItemFromLocalStorage } from './localStorage';

export const removeItem =  (e) => {
    if (e.target.classList.contains('remove-icon')) {
        const item = e.target.closest('.item');
        const currentList = e.target.closest('.list');
        const listKey = currentList.dataset.listKey;
        const items = Array.from(currentList.querySelectorAll('.item'));
        const itemIndex = items.indexOf(item);

        removeItemFromLocalStorage(listKey, itemIndex);
        item.remove();
    }
};