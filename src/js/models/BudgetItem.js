import uniqid from 'uniqid';
import { formatCurrency } from '../utils';

class BudgetItem {
  constructor(type, description, value, percentage, id, retrieved = false) {
    this.id = id || uniqid(`${type}-`);
    this.type = type;
    this.description = description;
    this.value = value;
    this.percentage = percentage || null;
    this.retrieved = retrieved;
  }

  get html() {
    return `
    <div class="item ${this.retrieved ? 'retrieved' : 'new'}" id="${this.id}">
      <div class="item__description">${this.description}</div>
      <div class="item__value">${formatCurrency(this.value)}</div>
      <div class="item__percentage ${this.type}">${this.percentage ||
      '---'}</div>
      <button class="item__delete">
        <i class="ion-ios-close-outline"></i>
      </button>
    </div>
  `;
  }

  calculatePercentage(inc) {
    this.percentage = parseInt((this.value / inc) * 100, 10);
  }
}

export default BudgetItem;
