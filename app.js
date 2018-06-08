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
      const response = await fetch(`https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=${app_id}&app_key=${app_key}&page=0`);

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
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemQuantityInput: '#item-quantity'
  }

  const nutritionBar = function (totalCalories, nutrient, nutrientGrams) {
    let percentage;

    if (nutrient === 'fat') {
      percentage = Math.round((nutrientGrams * 9) / totalCalories * 100);
    } else {
      percentage = Math.round((nutrientGrams * 4) / totalCalories * 100);
    }

    if (percentage >= 10 && percentage <= 80) {
      percentage = percentage;
    } else if (percentage < 10) {
      percentage = 10;
    } else if (percentage > 80) {
      percentage = 80;
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
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        this.calories = item.calories.energy === undefined ? 0 : item.calories.energy;
        this.fat = item.calories.fat === undefined ? 0 : item.calories.fat;
        this.carbs = item.calories.carbs === undefined ? 0 : item.calories.carbs;
        this.protein = item.calories.protein === undefined ? 0 : item.calories.protein;

        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}</strong>
          <a href="#" class="secondary-content" style="margin-left:1rem">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          <strong>
            <em class="pull-right">${this.calories} Calories</em>
          </strong>          
          <table class="striped">
            <tr>
              <td class="red lighten-4 center-align" style="width:${nutritionBar(this.calories, 'fat', this.fat)}%" id="first-td">Fat
              <span>${this.fat} g</span>
              </td>
              <td class="orange lighten-4 center-align" style="width:${nutritionBar(this.calories, 'carbs', this.carbs)}%" id="middle-td">Carbs
              <span>${this.carbs} g</span>
              </td>
              <td class="green lighten-4 center-align" style="width:${nutritionBar(this.calories, 'protein', this.protein)}%" id="last-td">Protein
              <span>${this.protein} g</span>
              </td>
            </tr>
          </table>
        </li>
        `;
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
      this.calories = item.calories.energy === undefined ? 0 : item.calories.energy;
      this.fat = item.calories.fat === undefined ? 0 : item.calories.fat;
      this.carbs = item.calories.carbs === undefined ? 0 : item.calories.carbs;
      this.protein = item.calories.protein === undefined ? 0 : item.calories.protein;

      // Show the list
      this.showList();

      // Create <li> element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `
        <strong>${URLDecode(item.name)}</strong>
        <a href="#" class="secondary-content" style="margin-left:1rem">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        <strong>
          <em class="pull-right">${Math.round(this.calories)} Calories</em>
        </strong>
        <table class="striped">
        <tr>
          <td class="red lighten-4 center-align" style="width:${nutritionBar(this.calories, 'fat', this.fat)}%" id="first-td">Fat
          <span>${this.fat} g</span>
          </td>
          <td class="orange lighten-4 center-align" style="width:${nutritionBar(this.calories, 'carbs', this.carbs)}%" id="middle-td">Carbs
          <span>${this.carbs} g</span>
          </td>
          <td class="green lighten-4 center-align" style="width:${nutritionBar(this.calories, 'protein', this.protein)}%" id="last-td">Protein
          <span>${this.protein} g</span>
          </td>
        </tr>
      </table>
      `;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
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

    getSelectors: function () {
      return UISelectors;
    }
  }
})();


// ITEM CONTROLLER
const ItemController = (function (APICtrl, UICtrl) {
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
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, quantity) {
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

        if (data.items.length > 0) {
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }

        // Create new item
        const newItem = new Item(ID, name, calories, quantity);
        console.log(newItem);

        // Add the newly created item to the data structure
        data.items.push(newItem);

        UICtrl.addListItem(newItem);

        return newItem;
      });
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
      // Add item to the data structure and the UI
      ItemCtrl.addItem(input.name, input.quantity);

      // Clear input fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  return {
    init: function () {
      // Get items from data structure
      const items = ItemCtrl.getItems();

      // Check if data structure holds any items
      if (!items.length) {
        UICtrl.hideList();
      } else {
        // Render list with above items
        UICtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemController, APIController, UIController, StorageController);

// INITIALIZE App
AppController.init();