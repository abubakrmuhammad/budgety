import { getCurrentMonthYear } from '../utils';

class UI {
  constructor() {
    this.DOM = {
      get date() {
        return document.querySelector('.budget__title--month');
      },
      get budgetValue() {
        return document.querySelector('.budget__value');
      },
      get budgetIncome() {
        return document.querySelector('.budget__income--value');
      },
      get budgetExpenses() {
        return document.querySelector('.budget__expenses--value');
      },
      addForm: {
        get form() {
          return document.querySelector('.add__form');
        },
        get type() {
          return document.querySelector('.add__type');
        },
        get description() {
          return document.querySelector('.add__description');
        },
        get value() {
          return document.querySelector('.add__value');
        }
      },
      get main() {
        return document.querySelector('.main');
      },
      itemsList: {
        get inc() {
          return document.querySelector('.income__list');
        },
        get exp() {
          return document.querySelector('.expenses__list');
        }
      }
    };
  }

  get addFormValues() {
    const { type, description, value } = this.DOM.addForm;

    return {
      type: type.value,
      description: description.value,
      value: parseFloat(value.value, 10)
    };
  }

  validateAddForm() {
    const { type, description, value } = this.addFormValues;

    if (!type || !description || !value)
      throw new Error('Please fill all the required Fields.');
    if (description.length < 3)
      throw new Error('Description should be atleast 3 letters.');
    if (value <= 0) throw new Error('Value should be greater than zero.');
  }

  updateDate() {
    this.DOM.date.textContent = getCurrentMonthYear();
  }

  renderItem(item) {
    this.DOM.itemsList[item.type].insertAdjacentHTML('beforeend', item.html);
  }

  removeItem(type, id) {
    const item = document.getElementById(`${type}-${id}`);
    item.parentNode.removeChild(item);
  }

  clearFields() {
    this.DOM.addForm.description.value = '';
    this.DOM.addForm.value.value = '';

    this.DOM.addForm.description.focus();
  }

  updateBudget({ budget, inc, exp }) {
    const { budgetValue, budgetIncome, budgetExpenses } = this.DOM;
    budgetValue.textContent = `${budget < 0 ? '-' : '+'} ${Math.abs(budget)}`;
    budgetIncome.textContent = inc;
    budgetExpenses.textContent = exp;
  }
}

export default UI;
