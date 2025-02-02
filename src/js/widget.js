import paySystems from "./pay-systems";
import structuredClone from "@ungap/structured-clone";
import { isValidCard, isValidLuhn } from "./validators";

export class CardValidatorWidget {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("container is not HTMLElement");
    }

    this._container = container;
  }

  cardValidation() {
    const inputValue = this._input.value;
    const paySystem = this.getPaySystem(inputValue);

    if (paySystem) {
      if (isValidCard(inputValue, paySystem.info) && isValidLuhn(inputValue)) {
        this.cleanPaySystem();
        this.hideMessage();
        this.showMessage(
          `The card is valid, ${paySystem.label} payment system.`,
          "valid",
        );
        this.checkedPaySystem(paySystem.value);
      } else {
        this.cleanPaySystem();
        this.showMessage("The card is not valid", "invalid");
      }
    } else {
      this.showMessage("Payment system not found", "invalid");
    }
  }

  checkedPaySystem(value) {
    this._cards.forEach((card) => {
      if (card.classList.contains(value)) {
        card.classList.add("checked");
      } else {
        card.classList.add("transparent");
      }
    });
  }

  cleanPaySystem() {
    this._cards.forEach((card) => {
      card.classList.remove("checked", "transparent");
    });
  }

  bindToDOM() {
    this._container.innerHTML = CardValidatorWidget.markup;

    this._element = this._container.querySelector(CardValidatorWidget.selector);
    this._cards = this._element.querySelectorAll(
      CardValidatorWidget.cardSelector,
    );
    this._form = this._element.querySelector(CardValidatorWidget.formSelector);
    this._input = this._element.querySelector(
      CardValidatorWidget.inputSelector,
    );
    this._submitter = this._element.querySelector(
      CardValidatorWidget.submitterSelector,
    );
    this._message = this._element.querySelector(
      CardValidatorWidget.messageSelector,
    );

    this._input.addEventListener("input", () => this.showPaySystem());
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.cardValidation();
    });
  }

  getPaySystem(value) {
    const start_1 = Number(value[0]);
    const start_2 = Number(value[0] + value[1]);

    const paySystem = structuredClone(
      paySystems.find((paySystem) => {
        const paySystemStarts = paySystem.info.map((info) => info.start);

        return (
          paySystemStarts.includes(start_1) || paySystemStarts.includes(start_2)
        );
      }),
    );

    if (paySystem) {
      paySystem.info = paySystem.info.find((info) => {
        return info.start === start_1 || info.start === start_2;
      });
    }

    return paySystem;
  }

  hideMessage() {
    this._input.className = "card-validator-widget__input";
    this._message.className = "card-validator-widget__message";
    this._message.textContent = "";
  }

  showMessage(text, type) {
    this._input.classList.add(type);
    this._message.classList.add(type);
    this._message.textContent = text;
  }

  showPaySystem() {
    const inputValue = this._input.value;
    const inputValueLength = inputValue.length;

    if (inputValueLength < 2) {
      this.cleanPaySystem();
      this.hideMessage();
    } else if (inputValueLength === 2) {
      const paySystem = this.getPaySystem(inputValue);

      if (paySystem) {
        this.hideMessage();
        this.checkedPaySystem(paySystem.value);
      } else {
        this.showMessage("Payment system not found", "invalid");
      }
    }
  }

  static get cardSelector() {
    return ".card-validator-widget__card";
  }

  static get formSelector() {
    return ".card-validator-widget__form";
  }

  static get inputSelector() {
    return ".card-validator-widget__input";
  }

  static get markup() {
    return (
      `
        <div class="card-validator-widget">
          <h1 class="card-validator-widget__title">Credit Card Validator</h1>
          <ul class="card-validator-widget__cards">
      ` +
      paySystems
        .map((paySystem) => {
          return `
            <li class="card-validator-widget__card ${paySystem.value}">
              <span class="visually-hidden">${paySystem.label}</span>
            </li>
          `;
        })
        .join("") +
      `
          </ul>
          <form class="card-validator-widget__form">
            <input class="card-validator-widget__input" placeholder="Credit card number" type="text">
            <button class="card-validator-widget__btn" type="submit">Click to Validate</button>
          </form>
          <p class="card-validator-widget__message"></p>
        </div>
      `
    );
  }

  static get messageSelector() {
    return ".card-validator-widget__message";
  }

  static get selector() {
    return ".card-validator-widget";
  }

  static get submitterSelector() {
    return ".card-validator-widget__btn";
  }
}
