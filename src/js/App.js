import BudgetItem from './models/BudgetItem';
import UI from './views/UI';
import { Alert, MyStorage, capitalizeFirstLetter } from './utils';

class App {
  constructor() {
    this.data = {
      items: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
    };
    this.alert = new Alert();
    this.UI = new UI();
    this.storage = new MyStorage();
  }

  calculateTotals(type) {
    this.data.totals[type] = this.data.items[type].reduce((total, item) => {
      return total + item.value;
    }, 0);
  }

  calculateBudget() {
    return this.data.totals.inc - this.data.totals.exp;
  }

  updateBudget() {
    this.calculateTotals('inc');
    this.calculateTotals('exp');

    this.data.budget = this.calculateBudget();

    this.UI.updateBudget({
      budget: this.data.budget,
      inc: this.data.totals.inc,
      exp: this.data.totals.exp
    });

    this.updatePercentages();
  }

  calculatePercentages(type) {
    this.data.items[type].forEach(item => {
      item.calculatePercentage(this.data.totals.inc);
    });
  }

  updatePercentages() {
    this.data.percentage = parseInt(
      (this.data.totals.exp / this.data.totals.inc) * 100,
      10
    );

    this.calculatePercentages('inc');
    this.calculatePercentages('exp');

    this.UI.updatePercentages({
      totalPercentage: this.data.percentage,
      exp: this.data.items.exp,
      inc: this.data.items.inc
    });
  }

  updateItemsCount() {
    this.UI.updateItemsCount(this.data.items);
  }

  saveData() {
    this.storage.saveData(this.data);
  }

  retrieveData() {
    const retrievedData = this.storage.retrieveData();
    if (!retrievedData) return;

    const parsedItems = this.storage.parseItems(
      retrievedData.items,
      BudgetItem
    );

    retrievedData.items = parsedItems;

    this.data = retrievedData;
  }

  renderRetrievedItems(type) {
    this.data.items[type].forEach((item, i) => {
      setTimeout(() => {
        this.UI.renderItem(item);
      }, i * 200);
    });
  }

  addItem({ type, description, value }) {
    try {
      this.UI.validateAddForm();

      const budgetItem = new BudgetItem(type, description, value);
      this.data.items[type].push(budgetItem);

      this.UI.renderItem(budgetItem);

      this.UI.clearFields();

      this.updateBudget();

      this.updateItemsCount();

      this.saveData();

      this.alert.render(
        'success',
        `${type === 'inc' ? 'Income' : 'Expense'} successfully Added!`
      );
    } catch (error) {
      console.error(error);
      this.alert.render('error', error.message);
    }
  }

  removeItem(itemId) {
    const [type, id] = itemId.split('-');

    const indexOfItem = this.data.items[type].findIndex(item => {
      return item.id === `${type}-${id}`;
    });

    this.data.items[type].splice(indexOfItem, 1);

    this.UI.removeItem(type, id);

    this.updateBudget();

    this.updateItemsCount();

    this.saveData();

    this.alert.render(
      'success',
      `${type === 'inc' ? 'Income' : 'Expense'} Deleted Successfully!`
    );
  }

  setupEventListeners() {
    const { DOM } = this.UI;

    DOM.addForm.form.addEventListener('submit', event => {
      event.preventDefault();
      this.addItem(this.UI.addFormValues);
    });

    DOM.addForm.type.addEventListener('change', () => {
      if (DOM.addForm.type.value === 'exp')
        DOM.addForm.form.classList.add('red');
      else DOM.addForm.form.classList.remove('red');

      DOM.addForm.description.focus();
    });

    DOM.main.addEventListener('click', event => {
      const itemId = event.target.parentNode.parentNode.id;

      if (itemId.startsWith('inc') || itemId.startsWith('exp'))
        this.removeItem(itemId);
    });
  }

  init() {
    console.log('App has been Started!');
    this.setupEventListeners();

    this.retrieveData();

    this.renderRetrievedItems('inc');
    this.renderRetrievedItems('exp');

    this.updateBudget();
    this.updateItemsCount();

    this.UI.clearFields();

    this.UI.updateDate();
  }
}

export default App;
