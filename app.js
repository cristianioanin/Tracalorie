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

  // Get calories from the Edamam API

  const getAPIResponse = async function (food) {
    const response = await fetch(`https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=${app_id}&app_key=${app_key}&page=0`);

    const responseData = await response.json();
    const nutrientsData = responseData.hints[0].food.nutrients;
    const calories = new Calories(nutrientsData);

    return calories;
  }

  return {
    getCalories: function (food) {
      return getAPIResponse(food);
    }
  }
})();

// ITEM CONTROLLER
const ItemController = (function (APICtrl) {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      { id: 0, name: 'Cheese', calories: { energy: 406.0, protein: 24.04, fat: 33.82, carbs: 1.33 } },
      { id: 1, name: 'Cookie', calories: { energy: 1200, protein: 55, fat: 120, carbs: 26 } },
      { id: 2, name: 'Eggs', calories: { energy: 650, protein: 15, fat: 25, carbs: 18 } }
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },

    logData: function () {
      return data;
    }
  }
})(APIController);


// UI CONTROLLER
const UIController = (function () {
  const UISelectors = {
    itemList: '#item-list'
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
  }

  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        this.calories = item.calories.energy;
        this.fat = item.calories.fat;
        this.carbs = item.calories.carbs;
        this.protein = item.calories.protein;

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
          </div>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    }
  }
})();


// MAIN APP CONTROLLER
const AppController = (function (ItemCtrl, APICtrl, UICtrl, StorageCtrl) {
  return {
    init: function () {
      // Get items from data structure
      const items = ItemCtrl.getItems();

      // Render list with above items
      UICtrl.populateItemList(items);
    }
  }
})(ItemController, APIController, UIController, StorageController);

// INITIALIZE App
AppController.init();