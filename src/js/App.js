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

  addItem({ type, description, value }) {
    try {
      this.UI.validateAddForm();

      const budgetItem = new BudgetItem(type, description, value);
      this.data.items[type].push(budgetItem);

      this.UI.renderItem(budgetItem);

      this.UI.clearFields();

      this.alert.render('success', 'Item successfully Added!');
    } catch (error) {
      this.alert.render('error', error.message);
    }
  }

  setupEventListeners() {
    this.UI.DOM.addForm.form.addEventListener('submit', event => {
      event.preventDefault();
      this.addItem(this.UI.addFormValues);
    });

    this.UI.DOM.addForm.type.addEventListener('change', () => {
      if (this.UI.DOM.addForm.type.value === 'exp')
        this.UI.DOM.addForm.form.classList.add('red');
      else this.UI.DOM.addForm.form.classList.remove('red');
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
