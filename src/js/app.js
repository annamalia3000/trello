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
let initialPosition = {
    left:0,
    top: 0
};

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

        initialPosition.left = rect.left;
        initialPosition.top = rect.top;

        draggedElement.style.left = `${rect.left}px`;
        draggedElement.style.top = `${rect.top}px`;
        draggedElement.style.width = `${rect.width}px`;
        draggedElement.style.height = `${rect.height}px`;
        draggedElement.style.position = 'absolute';

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }
});

const onMouseMove = (e) => {
    if (!isDragging || !draggedElement) return;

    draggedElement.style.left = `${e.clientX - offsetX}px`;
    draggedElement.style.top = `${e.clientY - offsetY - 20}px`;
    
    container.querySelectorAll('.placeholder').forEach(el => el.remove());
    const potentialList = document.elementFromPoint(e.clientX, e.clientY).closest('.list');

    const placeholder = document.createElement('li');
    placeholder.classList.add('placeholder');
    placeholder.style.height = `${draggedElement.offsetHeight}px`;

    const newItems = Array.from(container.querySelectorAll('.item'));
    let insertBeforeElement = null;
        
    for (let item of newItems) {
        const itemRect = item.getBoundingClientRect();
        if (e.clientY < itemRect.top + itemRect.height / 2) {
            insertBeforeElement = item;
            break;
        }
    }

    if (insertBeforeElement) {
        potentialList.insertBefore(placeholder, insertBeforeElement);
    } else {
        potentialList.appendChild(placeholder);
    }
};

const onMouseUp = (e) => {
    if (!isDragging || !draggedElement) return;

    const newList = document.elementFromPoint(e.clientX, e.clientY).closest('.list');

    if (newList) {
        draggedElement.parentElement.removeChild(draggedElement);

        const placeholder = newList.querySelector('.placeholder');
        if (placeholder) {
            newList.insertBefore(draggedElement, placeholder);
            placeholder.remove();
        } else {
            newList.appendChild(draggedElement);
        }
    }  else {
        draggedElement.style.left = `${initialPosition.left}px`;
        draggedElement.style.top = `${initialPosition.top}px`;
    }

    draggedElement.style.left = '';
    draggedElement.style.top = '';
    draggedElement.style.width = '';
    draggedElement.style.height = '';
    draggedElement.style.position = '';

    draggedElement.classList.remove('dragged');
    draggedElement = null;
    isDragging = false;
    container.classList.remove('dragging');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
};

container.addEventListener('dragover', (e) => {
    e.preventDefault();
});

container.addEventListener('drop', (e) => {
    e.preventDefault();
});
