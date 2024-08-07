export const removeItem =  (e) => {
    if (e.target.classList.contains('remove-icon')) {
        const item = e.target.closest('.item');
        item.remove();
    }
};