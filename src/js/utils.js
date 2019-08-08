export class Alert {
  constructor() {
    const element = document.createElement('div');
    element.classList.add('alert');
    element.addEventListener('animationend', () => {
      if (this.element.classList.contains('alert--hidden')) {
        this.element.parentElement.removeChild(this.element);
        this.visible = false;
      }
    });
    element.addEventListener('click', () => this.remove());

    this.message = '';
    this.type = null;
    this.element = element;
    this.visible = false;
    this.timeoutId = NaN;
  }

  settings(type, message) {
    this.type = type;
    this.message = message;
  }

  render(type, message, timeout = 5000) {
    if (!this.visible || this.message !== message) {
      clearTimeout(this.timeoutId);

      this.settings(type, message);
      this.element.classList.remove('alert--error');
      this.element.classList.remove('alert--success');

      this.element.textContent = this.message;
      this.element.classList.add(`alert--${this.type}`);

      this.element.classList.remove('alert--hidden');

      document.body.insertAdjacentElement('afterbegin', this.element);
      this.visible = true;

      this.timeoutId = setTimeout(() => {
        this.remove();
      }, timeout);
    }
  }

  remove() {
    this.element.classList.add('alert--hidden');
  }
}

export class MyStorage {
  constructor() {}

  saveData(data) {
    localStorage.setItem(btoa('data'), btoa(JSON.stringify(data)));
  }

  parseItems(items, BudgetItem) {
    const inc = items.inc.map(income => {
      const { type, description, value, percentage, id } = income;
      return new BudgetItem(type, description, value, percentage, id, true);
    });

    const exp = items.exp.map(expense => {
      const { type, description, value, percentage, id } = expense;
      return new BudgetItem(type, description, value, percentage, id, true);
    });

    return { inc, exp };
  }

  retrieveData() {
    const data = localStorage.getItem(btoa('data'));

    if (data) return JSON.parse(atob(data));
    return null;
  }
}

export function getCurrentMonthYear() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December'
  ];

  const now = new Date();

  const monthNumber = now.getMonth();
  const year = now.getFullYear();

  const month = months[monthNumber];

  return `${month} ${year}`;
}

export function formatPercentage(number) {
  return number ? `${number}%` : '---';
}

export function formatCurrency(number) {
  let formattedNumber = number.toFixed(2);
  let [int, dec] = formattedNumber.split('.');

  formattedNumber = '';

  if (int.length > 3) {
    int = int.split('').reverse();

    int.forEach((digit, i) => {
      if ((i + 1) % 3 === 0) {
        formattedNumber += `${digit},`;
      } else formattedNumber += digit;
    });

    formattedNumber = formattedNumber
      .split('')
      .reverse()
      .join('');

    if (formattedNumber.startsWith(','))
      formattedNumber = formattedNumber.slice(1);
  }

  formattedNumber = `${formattedNumber || int}.${dec}`;

  return formattedNumber;
}

export function capitalizeFirstLetter(string) {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;
}
