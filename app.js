// STORAGE CONTROLLER
const StorageController = (function () {

})();


// API CONTROLLER
const APIController = (function () {
  const app_id = '5300f098';
  const app_key = '2ef77d6d1f61b4f695c95ebac0d0cd92';

  // Calories object controller
  const Calories = function (nutrients) {
    this.energy = nutrients.ENERC_KCAL; // kcal
    this.protein = nutrients.PROCNT; // g
    this.fat = nutrients.FAT; // g
    this.carbs = nutrients.CHOCDF; // g
  }

  return {
    // Get calories from the Edamam API
    getAPIResponse: async function (food) {
      const response = await fetch(`https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=${app_id}&app_key=${app_key}&page=1`);

      const responseData = await response.json();

      return responseData;
    },

    newCaloriesObject: function (nutrients) {
      return new Calories(nutrients);
    }
  }
})();


// UI CONTROLLER
const UIController = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    addIcon: '#add-icon',
    itemNameInput: '#item-name',
    itemQuantityInput: '#item-quantity',
    totalCalories: '#total-calories',
    totalFat: '#total-fat',
    totalCarbs: '#total-carbs',
    totalProtein: '#total-protein',
  }

  const nutritionBar = function (totalCalories, nutrient, nutrientGrams) {
    let percentage;

    if (nutrient === 'fat') {
      percentage = Math.round((nutrientGrams * 9) / totalCalories * 100);
    } else {
      percentage = Math.round((nutrientGrams * 4) / totalCalories * 100);
    }

    return percentage;
  };

  function URLEncode(string) {
    return string.replace(' ', '%20');
  };

  function URLDecode(string) {
    return string.replace('%20', ' ');
  };

  return {
    renderItemToDOM: function (item) {
      let markup = '';

      this.calories = item.calories.energy === undefined ? 0 : item.calories.energy;
      this.fat = item.calories.fat === undefined ? 0 : item.calories.fat;
      this.carbs = item.calories.carbs === undefined ? 0 : item.calories.carbs;
      this.protein = item.calories.protein === undefined ? 0 : item.calories.protein;

      if (this.fat && this.carbs && this.protein) {
        markup += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${URLDecode(item.name)}</strong>
            <a href="#" class="secondary-content" style="margin-left:1rem">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            <strong>
              <em class="pull-right">${Math.round(this.calories)} Calories</em>
            </strong>          
            <table class="striped">
              <tr>
                <td class="red lighten-1 center-align" style="width:${nutritionBar(this.calories, 'fat', this.fat)}%" id="first-td">
                  <span>${Math.round(this.fat * 9)}</span>
                </td>
                <td class="orange lighten-1 center-align" style="width:${nutritionBar(this.calories, 'carbs', this.carbs)}%" id="middle-td">
                  <span>${Math.round(this.carbs * 4)}</span>
                </td>
                <td class="green lighten-1 center-align" style="width:${nutritionBar(this.calories, 'protein', this.protein)}%" id="last-td">
                  <span>${Math.round(this.protein * 4)}</span>
                </td>
              </tr>
            </table>
          </li>
        `;
      } else if (!this.fat && this.carbs && this.protein) {
        markup += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${URLDecode(item.name)}</strong>
            <a href="#" class="secondary-content" style="margin-left:1rem">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            <strong>
              <em class="pull-right">${Math.round(this.calories)} Calories</em>
            </strong>          
            <table class="striped">
              <tr>
                <td class="orange lighten-1 center-align" style="width:${nutritionBar(this.calories, 'carbs', this.carbs)}%" id="first-td">
                  <span>${Math.round(this.carbs * 4)}</span>
                </td>
                <td class="green lighten-1 center-align" style="width:${nutritionBar(this.calories, 'protein', this.protein)}%" id="last-td">
                  <span>${Math.round(this.protein * 4)}</span>
                </td>
              </tr>
            </table>
          </li>
        `;
      } else if (this.fat && !this.carbs && this.protein) {
        markup += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${URLDecode(item.name)}</strong>
            <a href="#" class="secondary-content" style="margin-left:1rem">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            <strong>
              <em class="pull-right">${Math.round(this.calories)} Calories</em>
            </strong>          
            <table class="striped">
              <tr>
                <td class="red lighten-1 center-align" style="width:${nutritionBar(this.calories, 'fat', this.fat)}%" id="first-td">
                  <span>${Math.round(this.fat * 9)}</span>
                </td>
                <td class="green lighten-1 center-align" style="width:${nutritionBar(this.calories, 'protein', this.protein)}%" id="last-td">
                  <span>${Math.round(this.protein * 4)}</span>
                </td>
              </tr>
            </table>
          </li>
        `;
      } else if (this.fat && this.carbs && !this.protein) {
        markup += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${URLDecode(item.name)}</strong>
            <a href="#" class="secondary-content" style="margin-left:1rem">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            <strong>
              <em class="pull-right">${Math.round(this.calories)} Calories</em>
            </strong>          
            <table class="striped">
              <tr>
                <td class="red lighten-1 center-align" style="width:${nutritionBar(this.calories, 'fat', this.fat)}%" id="first-td">
                  <span>${Math.round(this.fat * 9)}</span>
                </td>
                <td class="orange lighten-1 center-align" style="width:${nutritionBar(this.calories, 'carbs', this.carbs)}%" id="last-td">
                  <span>${Math.round(this.carbs * 4)}</span>
                </td>
              </tr>
            </table>
          </li>
        `;
      } else {
        markup += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${URLDecode(item.name)}</strong>
            <a href="#" class="secondary-content" style="margin-left:1rem">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            <strong>
              <em class="pull-right">${Math.round(this.calories)} Calories</em>
            </strong>
          </li>
        `;
      }

      return markup;
    },

    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        html += this.renderItemToDOM(item);
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: URLEncode(document.querySelector(UISelectors.itemNameInput).value),
        quantity: document.querySelector(UISelectors.itemQuantityInput).value
      }
    },

    addListItem: function (item) {
      // Show the list
      this.showList();

      // Create <li> element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = this.renderItemToDOM(item);

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Loop through listItems after converting the returned node list to an array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = this.renderItemToDOM(item);
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      item.remove();
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemQuantityInput).value = '';
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = Math.round(totalCalories.data.totalCalories);
      document.querySelector(UISelectors.totalFat).textContent = (totalCalories.data.totalFat).toFixed(2);
      document.querySelector(UISelectors.totalCarbs).textContent = (totalCalories.data.totalCarbs).toFixed(2);
      document.querySelector(UISelectors.totalProtein).textContent = (totalCalories.data.totalProtein).toFixed(2);
    },

    clearEditState: function () {
      this.clearInput();

      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(item => item.remove());
    },

    getSelectors: function () {
      return UISelectors;
    }
  }
})();


// ITEM CONTROLLER
const ItemController = (function (APICtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();

  // Item constructor
  const Item = function (id, name, calories, quantity) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.quantity = quantity;
  }

  // Data Structure / State
  const data = {
    items: [ /* array for holding data structure items */],
    currentItem: null,
    totalCalories: 0,
    totalFat: 0,
    totalCarbs: 0,
    totalProtein: 0
  }

  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, quantity, updatingID) {
      APICtrl.getAPIResponse(name).then(result => {
        const nutrients = result.hints[0].food.nutrients;
        console.log(nutrients);

        // Quantity to Number
        quantity = parseInt(quantity);

        function ifQuantity(quantity, object) {
          for (let key in object) {
            if (quantity) {
              object[key] = (object[key] * (quantity / 100)).toFixed(2);
            } else {
              object[key] = object[key].toFixed(2);
            }
          }

          return object;
        }

        const calories = isNaN(quantity) ? APICtrl.newCaloriesObject(ifQuantity(quantity, nutrients)) : APICtrl.newCaloriesObject(ifQuantity(quantity, nutrients));

        // Create ID
        let ID;

        if (updatingID === null) {
          if (data.items.length > 0) {
            ID = data.items[data.items.length - 1].id + 1;
          } else {
            ID = 0;
          }
        } else {
          ID = updatingID;
        }


        // Create new item
        const newItem = new Item(ID, name, calories, quantity);

        // Add the newly created item to the data structure
        updatingID === null ? data.items.push(newItem) : data.items[updatingID] = newItem;

        if (updatingID === null) {
          UICtrl.addListItem(newItem);
        } else {
          UICtrl.updateListItem(newItem);
        }

        // Get total Calories
        const totalCalories = this.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove spinner
        const UISelectors = UICtrl.getSelectors();
        const addIcon = document.querySelector(UISelectors.addIcon);
        addIcon.classList.remove('fa-spinner', 'fa-spin');
        addIcon.classList.add('fa-plus');

        return newItem;
      })
        .catch(error => console.log(`${error.name}: Input returned undefined`));
    },

    getItemById: function (id) {
      let found = null;

      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    updateItem: function (name, quantity) {
      quantity = parseInt(quantity);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item = this.addItem(name, quantity, data.currentItem.id);

          found = item;
        }
      });

      return found;
    },

    deleteItem: function (id) {
      // Get all ids
      const ids = data.items.map(item => item.id);

      // Get index of the id to delete
      const index = ids.indexOf(id);

      // Remove item from data structure
      data.items.splice(index, 1);

      const totalCalories = this.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
    },

    clearAllItems: function () {
      data.items.length = 0;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    addItemToForm: function () {
      function URLDecode(string) {
        return string.replace('%20', ' ');
      };

      document.querySelector(UISelectors.itemNameInput).value = URLDecode(this.getCurrentItem().name);
      document.querySelector(UISelectors.itemQuantityInput).value = isNaN(this.getCurrentItem().quantity) ? '' : this.getCurrentItem().quantity;

      UICtrl.showEditState();
    },

    getTotalCalories: function () {
      let calories = 0,
        fat = 0,
        carbs = 0,
        protein = 0;

      data.items.forEach(item => {
        calories += isNaN(Number(item.calories.energy)) ? 0 : Number(item.calories.energy);
        fat += isNaN(Number(item.calories.fat)) ? 0 : Number(item.calories.fat);
        carbs += isNaN(Number(item.calories.carbs)) ? 0 : Number(item.calories.carbs);
        protein += isNaN(Number(item.calories.protein)) ? 0 : Number(item.calories.protein);
      });

      // Set total calories in data structure
      data.totalCalories = calories;
      data.totalFat = fat;
      data.totalCarbs = carbs;
      data.totalProtein = protein;

      return { totalCalories, totalFat, totalCarbs, totalProtein } = { data };
    },

    logData: function () {
      return data;
    }
  }
})(APIController, UIController);


// MAIN APP CONTROLLER
const AppController = (function (ItemCtrl, APICtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();
  // Load event-listeners
  const loadEventListeners = function () {
    // Item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable Submit on Enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.wich === 13) {
        e.preventDefault();

        return false;
      }
    });

    // Edit Icon event-listener for 'click'
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Cancel button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => {
      UICtrl.clearEditState();

      e.preventDefault();
    });

    // Clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsEvent);
  }

  // Add item / submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for item name as required input
    const element = document.querySelector(UISelectors.itemNameInput);
    if (!element.value) {
      element.classList.add('name__input');
      setTimeout(() => {
        element.classList.remove('name__input');
      }, 1500);
    }

    if (input.name) {
      const addIcon = document.querySelector(UISelectors.addIcon);
      addIcon.classList.remove('fa-plus');
      addIcon.classList.add('fa-spinner', 'fa-spin');

      // Add item to the data structure and the UI
      ItemCtrl.addItem(input.name, input.quantity, null);

      // Clear input fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.quantity);

    // Clear Edit State
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Click to edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Get id from listId variable
      const listIdSplit = listId.split('-');
      const id = parseInt(listIdSplit[1]);

      // Get item 
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set item as current item to edit in the data structure
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      ItemCtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Delete item event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Clear all items event function
  const clearAllItemsEvent = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Remove all items from the UI
    UICtrl.removeItems();

    UICtrl.hideList();
  }

  return {
    init: function () {
      // Clear edit state
      UICtrl.clearEditState();

      // Get items from data structure
      const items = ItemCtrl.getItems();

      // Check if data structure holds any items
      if (!items.length) {
        UICtrl.hideList();
      } else {
        // Render list with above items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemController, APIController, UIController, StorageController);

// INITIALIZE App
AppController.init();