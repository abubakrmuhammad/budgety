import BudgetItem from './models/BudgetItem';
import UI from './views/UI';
import { Alert } from './utils';

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
  }

  addItem({ type, description, value }) {
    try {
      this.UI.validateAddForm();

      const budgetItem = new BudgetItem(type, description, value);
      this.data.items[type].push(budgetItem);

      this.UI.renderItem(budgetItem);

      this.UI.clearFields();

      this.updateBudget();

      this.alert.render('success', 'Item successfully Added!');
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
    });

    DOM.main.addEventListener('click', event => {
      const itemId = event.target.parentNode.parentNode.id;

      if (itemId.startsWith('inc') || itemId.startsWith('exp'))
        this.removeItem(itemId);
    });

    document.getElementById('debug').addEventListener('click', () => {
      console.log(this.data);
    });
  }

  init() {
    console.log('App has been Started!');
    this.setupEventListeners();

    this.UI.updateDate();
  }
}

export default App;
