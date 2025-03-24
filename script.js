const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

const displayItems = () => {
  const itemsFromStorage = getItemFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  addItemToDOM(newItem);

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = ''; // Clears Input Field after adding an item
};

const addItemToDOM = (item) => {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
};

const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);

  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  }
};

// Remove list item
const removeItem = (item) => {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from Storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter(
    (storedItem) => storedItem !== item
  );

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

// Clear list item
const clearItems = () => {
  if (confirm('Are you sure?')) {
    // Remove all child element from itemList
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
  }
};

// Filter items
const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.textContent.toLowerCase();

    // Shows the item if it contains the search text, otherwise hides it
    item.style.display = itemName.includes(text) ? 'flex' : 'none';
  });
};

// Check the state of the Application
const checkUI = () => {
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    itemFilter.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    itemFilter.style.display = 'block';
    clearBtn.style.display = 'block';
  }
};

// Initialize app
const init = () => {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
