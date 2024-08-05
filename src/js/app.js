const container = document.querySelector('.container');

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-icon')) {
        const item = e.target.closest('.item');
        item.remove();
    }
});

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-item')) {
        const currentList = e.target.closest('.column').querySelector('.list');
        const addCard = e.target;

        addCard.style.display = 'none'; 
        createEditor(currentList, addCard);
        
    }
});

const createEditor = (currentList, addCard) => {

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
    removeIcon. textContent = '×';

    removeIcon.addEventListener('click', () => {
        editorElement.remove();
        addCard.style.display = 'block'; 
    });

    editorElement.appendChild(inputElement);
    editorElement.appendChild(addButton);
    editorElement.appendChild(removeIcon);

    currentList.insertAdjacentElement('beforeend', editorElement);

    addButton.addEventListener('click', () => {
        const inputValue = inputElement.value;
        if (inputValue) {
            createItem(inputValue, currentList);
            addCard.style.display = 'block'; 
            editorElement.remove();
        }
    });
};

const createItem = (text, currentList) => {
    const newItem = document.createElement('li');
    newItem.classList.add('item');
    newItem.innerHTML = `${text}<span class="remove-icon">×</span>`;

    currentList.appendChild(newItem);
};
