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

export function alertMessage(message, type = 'success') {
  alert.addEventListener('click', () => {
    alert.classList.add('alert--timeout');

    alert.addEventListener('animationend', () => {
      alert.parentNode.removeChild(alert);
    });
  });
}

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
