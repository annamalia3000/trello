import { moveItemInLocalStorage, moveItemBetweenListsInLocalStorage } from './localStorage';

let draggedElement;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let initialPosition = { 
    left: 0, 
    top: 0 
};
let initialIndex;
let initialListKey;

export function initDragAndDrop(container) {
    container.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('item')) {
            e.preventDefault();
            draggedElement = e.target;
            draggedElement.classList.add('dragged');
            isDragging = true;
            container.classList.add('dragging');
            document.body.classList.add('dragging');
    
            const rect = draggedElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
    
            initialPosition.left = e.clientX - offsetX;
            initialPosition.top = e.clientY - offsetY;
    
            draggedElement.style.left = `${initialPosition.left}px`;
            draggedElement.style.top = `${initialPosition.top}px`;
            draggedElement.style.width = `${rect.width}px`;
            draggedElement.style.height = `${rect.height}px`;
            draggedElement.style.position = 'absolute';
    
            initialListKey = draggedElement.closest('.list').dataset.listKey;
            initialIndex = Array.from(draggedElement.parentElement.children).indexOf(draggedElement);

            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', onMouseMove);
        }
    });

    const onMouseMove = (e) => {
        if (!isDragging || !draggedElement) return;

        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;

        draggedElement.style.left = `${left}px`;
        draggedElement.style.top = `${top}px`;

        container.querySelectorAll('.placeholder').forEach(el => el.remove());

        const potentialColumn = document.elementFromPoint(e.clientX, e.clientY).closest('.column');
        if (potentialColumn) {
            const placeholder = document.createElement('li');
            placeholder.classList.add('placeholder');
            placeholder.style.height = `${draggedElement.offsetHeight}px`;
            const potentialList = potentialColumn.querySelector('.list');
            const newItems = Array.from(potentialList.querySelectorAll('.item'));

            if (newItems.length !== 0) {
                let insertBeforeElement = null;
                
                newItems.forEach((item) => {
                    const itemRect = item.getBoundingClientRect();
                    const itemTop = itemRect.top;
                    const itemBottom = itemRect.bottom;
                    
                    if (e.clientY < (itemTop + itemBottom) / 2) {
                        insertBeforeElement = item;
                    }
                });
            
                if (insertBeforeElement) {
                    potentialList.insertBefore(placeholder, insertBeforeElement);
                } else {
                    potentialList.appendChild(placeholder);
                }
            } else {
                potentialList.appendChild(placeholder);
            }
                     
        }
    };

    const onMouseUp = (e) => {
        if (!isDragging || !draggedElement) return;

        const newList = document.elementFromPoint(e.clientX, e.clientY)?.closest('.list');

        if (newList) {
            let newIndex;
            const placeholder = newList.querySelector('.placeholder');

            if (placeholder) {
                newIndex = Array.from(newList.children).indexOf(placeholder);
                newList.insertBefore(draggedElement, placeholder);
                placeholder.remove();
            } else {
                newIndex = newList.children.length;
                newList.appendChild(draggedElement);
            }

            const newListKey = newList.dataset.listKey;

            if (newListKey === initialListKey) {
                moveItemInLocalStorage(newListKey, initialIndex, newIndex);
            } else {
                moveItemBetweenListsInLocalStorage(initialListKey, newListKey, initialIndex, newIndex);
            }
        } else {
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
        document.body.classList.remove('dragging');
        container.querySelectorAll('.placeholder').forEach(el => el.remove());
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
    });
}
