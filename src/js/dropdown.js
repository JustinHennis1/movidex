// dropdown.js
export function clearSelection() {
    const menus = document.querySelectorAll('.dropdownmenu');
    menus.forEach((menu) => {
        menu.style.display = 'none';
    });
}
