import { handleAddItem } from './addItem';

export function createItem(text, currentList) {
    const newItem = document.createElement('li');
    newItem.classList.add('item');
    newItem.innerHTML = `${text}<span class="remove-icon">×</span>`;

    return newItem;
};

export function createEditor(currentList, addItem) {
    const editorElement = document.createElement('div');
    editorElement.classList.add('editor');

    const inputElement = document.createElement('input');
    inputElement.classList.add('input-item');
    inputElement.placeholder = 'Enter a title for this card...';

    const addButton = document.createElement('button');
    addButton.classList.add('add-btn');
    addButton.textContent = 'Add Card';

    const removeIcon = document.createElement('span');
    removeIcon.classList.add('remove-icon-editor');
    removeIcon.textContent = '×';

    removeIcon.addEventListener('click', () => {
        editorElement.remove();
        addItem.style.display = 'block'; 
    });

    editorElement.appendChild(inputElement);
    editorElement.appendChild(addButton);
    editorElement.appendChild(removeIcon);

    currentList.insertAdjacentElement('beforeend', editorElement);

    addButton.addEventListener('click', () => {
        const inputValue = inputElement.value;
        if (inputValue) {
            const listKey = currentList.dataset.listKey;
            handleAddItem(listKey, inputValue, currentList);
            addItem.style.display = 'block'; 
            editorElement.remove();
        }
    });
};
