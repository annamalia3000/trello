let draggedElement;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let initialPosition = { 
    left: 0, 
    top: 0 
};

export function initDragAndDrop (container) {
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

            initialPosition.left = rect.left + window.scrollX;
            initialPosition.top = rect.top + window.scrollY;

            draggedElement.style.left = `${initialPosition.left}px`;
            draggedElement.style.top = `${initialPosition.top}px`;
            draggedElement.style.width = `${rect.width}px`;
            draggedElement.style.height = `${rect.height}px`;
            draggedElement.style.position = 'absolute';

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

        const potentialList = document.elementFromPoint(e.clientX, e.clientY)?.closest('.list');

        if (potentialList) {
            const placeholder = document.createElement('li');
            placeholder.classList.add('placeholder');
            placeholder.style.height = `${draggedElement.offsetHeight}px`;

            const newItems = Array.from(potentialList.querySelectorAll('.item'));
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
        }
    };

    const onMouseUp = (e) => {
        if (!isDragging || !draggedElement) return;

        const newList = document.elementFromPoint(e.clientX, e.clientY)?.closest('.list');

        if (newList) {
            draggedElement.parentElement.removeChild(draggedElement);

            const placeholder = newList.querySelector('.placeholder');
            if (placeholder) {
                newList.insertBefore(draggedElement, placeholder);
                placeholder.remove();
            } else {
                newList.appendChild(draggedElement);
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
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
    });
};
