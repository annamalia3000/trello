import { initDragAndDrop } from './DnD';
import { removeItem } from './removeItem';
import { addItem } from './addItem';

const container = document.querySelector('.container');

container.addEventListener('click', removeItem);

container.addEventListener('click', addItem);

initDragAndDrop(container);
