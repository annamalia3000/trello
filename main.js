/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/localStorage.js
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
function addItemToLocalStorage(listKey, item) {
  const list = loadFromLocalStorage(listKey);
  list.push(item);
  saveToLocalStorage(listKey, list);
}
function removeItemFromLocalStorage(listKey, itemIndex) {
  const list = loadFromLocalStorage(listKey);
  list.splice(itemIndex, 1);
  saveToLocalStorage(listKey, list);
}
function moveItemInLocalStorage(listKey, oldIndex, newIndex) {
  const list = loadFromLocalStorage(listKey);
  const [movedItem] = list.splice(oldIndex, 1);
  list.splice(newIndex, 0, movedItem);
  saveToLocalStorage(listKey, list);
}
function moveItemBetweenListsInLocalStorage(sourceListKey, targetListKey, itemIndex, targetIndex) {
  const sourceList = loadFromLocalStorage(sourceListKey);
  const [movedItem] = sourceList.splice(itemIndex, 1);
  const targetList = loadFromLocalStorage(targetListKey);
  targetList.splice(targetIndex, 0, movedItem);
  saveToLocalStorage(sourceListKey, sourceList);
  saveToLocalStorage(targetListKey, targetList);
}
;// CONCATENATED MODULE: ./src/js/DnD.js

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
function initDragAndDrop(container) {
  container.addEventListener('mousedown', e => {
    if (e.target.classList.contains('item')) {
      e.preventDefault();
      draggedElement = e.target;
      draggedElement.classList.add('dragged');
      isDragging = true;
      container.classList.add('dragging');
      document.body.classList.add('dragging');
      const rect = draggedElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left + 5;
      offsetY = e.clientY - rect.top + 10;
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
  const onMouseMove = e => {
    if (!isDragging || !draggedElement) return;
    const left = e.clientX - offsetX;
    const top = e.clientY - offsetY;
    draggedElement.style.left = `${left}px`;
    draggedElement.style.top = `${top}px`;
    container.querySelectorAll('.placeholder').forEach(el => el.remove());
    const potentialColumn = document.elementFromPoint(e.clientX, e.clientY)?.closest('.column');
    if (potentialColumn) {
      const potentialList = potentialColumn.querySelector('.list');
      const newItems = Array.from(potentialList.querySelectorAll('.item'));
      let insertBeforeElement = null;
      if (newItems.length > 0) {
        for (const item of newItems) {
          const itemRect = item.getBoundingClientRect();
          const itemMiddleY = itemRect.top + itemRect.height / 2;
          if (e.clientY < itemMiddleY) {
            insertBeforeElement = item;
            break;
          }
        }
      }
      const placeholder = document.createElement('li');
      placeholder.classList.add('placeholder');
      placeholder.style.height = `${draggedElement.offsetHeight}px`;
      if (insertBeforeElement) {
        potentialList.insertBefore(placeholder, insertBeforeElement);
      } else {
        potentialList.appendChild(placeholder);
      }
    }
  };
  const onMouseUp = e => {
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
    draggedElement.removeAttribute('style');
    draggedElement.classList.remove('dragged');
    draggedElement = null;
    isDragging = false;
    container.classList.remove('dragging');
    document.body.classList.remove('dragging');
    container.querySelectorAll('.placeholder').forEach(el => el.remove());
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
}
;// CONCATENATED MODULE: ./src/js/removeItem.js

function removeItem(e) {
  if (e.target.classList.contains('remove-icon')) {
    const item = e.target.closest('.item');
    const currentList = e.target.closest('.list');
    const listKey = currentList.dataset.listKey;
    const items = Array.from(currentList.querySelectorAll('.item'));
    const itemIndex = items.indexOf(item);
    removeItemFromLocalStorage(listKey, itemIndex);
    item.remove();
  }
}
;
;// CONCATENATED MODULE: ./src/js/createItem.js

function createItem(text) {
  const newItem = document.createElement('li');
  newItem.classList.add('item');
  newItem.innerHTML = `${text}<span class="remove-icon">×</span>`;
  return newItem;
}
;
function createEditor(currentList, addItem) {
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
}
;
;// CONCATENATED MODULE: ./src/js/addItem.js


function addItem(e) {
  if (e.target.classList.contains('add-item')) {
    const currentList = e.target.closest('.column').querySelector('.list');
    const addCard = e.target;
    addCard.style.display = 'none';
    createEditor(currentList, addCard);
  }
}
;
function handleAddItem(listKey, itemText, currentList) {
  const newItem = createItem(itemText);
  addItemToLocalStorage(listKey, itemText);
  currentList.appendChild(newItem);
}
;// CONCATENATED MODULE: ./src/js/app.js




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
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map