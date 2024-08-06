const container = document.querySelector('.container');

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-icon') && !isDragging) {
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

let draggedElement;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

container.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('item')) {
        e.preventDefault();
        draggedElement = e.target;
        draggedElement.classList.add('dragged');
        isDragging = true;
        container.classList.add('dragging');

        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        draggedElement.style.width = `${rect.width}px`;
        draggedElement.style.height = `${rect.height}px`;

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }
});

const onMouseMove = (e) => {
    if (!isDragging || !draggedElement) return;

    draggedElement.style.left = `${e.clientX - offsetX}px`;
    draggedElement.style.top = `${e.clientY - offsetY}px`;
};

const onMouseUp = (e) => {
    if (!isDragging || !draggedElement) return;

    draggedElement.classList.remove('dragged');
    isDragging = false;
    draggedElement.style.width = '';
    draggedElement.style.height = '';
    container.classList.remove('dragging');

    const newList = document.elementFromPoint(e.clientX, e.clientY).closest('.list');
    if (newList) {
        const rect = draggedElement.getBoundingClientRect();
        const newItems = newList.querySelectorAll('.item');

        // Find the insert position
        let beforeElement = null;
        newItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (e.clientY < itemRect.top + itemRect.height / 2) {
                beforeElement = item;
            }
        });

        if (beforeElement) {
            newList.insertBefore(draggedElement, beforeElement);
        } else {
            newList.appendChild(draggedElement);
        }
    }

    draggedElement = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
};

container.addEventListener('dragover', (e) => {
    e.preventDefault();
});

container.addEventListener('drop', (e) => {
    e.preventDefault();
});
