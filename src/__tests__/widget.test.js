import paySystems from "../js/pay-systems";
import { CardValidatorWidget } from "../js/widget";

describe("module widget", () => {
  describe("class CardValidatorWidget", () => {
    describe("new CardValidatorWidget(container)", () => {
      test("success", () => {
        document.body.innerHTML = '<div id="app"></div>';

        const container = document.querySelector("#app");
        const widget = new CardValidatorWidget(container);

        expect(widget._container).toBeInstanceOf(HTMLElement);
      });

      test("throw", () => {
        document.body.innerHTML = "";

        const container = document.querySelector("#app");

        expect(() => new CardValidatorWidget(container)).toThrow(Error);
      });
    });

    describe("[CardValidatorWidget]", () => {
      let widget;

      const widgetClasses = {
        card: "card-validator-widget__card",
        input: "card-validator-widget__input",
        message: "card-validator-widget__message",
      };

      beforeAll(() => {
        document.body.innerHTML = '<div id="app"></div>';
        const container = document.querySelector("#app");
        widget = new CardValidatorWidget(container);
      });

      test(".bindToDOM()", () => {
        widget.bindToDOM();

        expect(widget._container.innerHTML).toEqual(CardValidatorWidget.markup);
        expect(widget._message.className).toBe(widgetClasses.message);
      });

      test(".showMessage()", () => {
        const text = "Тестовое сообщение";
        const type = "valid";

        widget.showMessage(text, type);

        expect(widget._input.className).toBe(`${widgetClasses.input} ${type}`);
        expect(widget._message.className).toBe(
          `${widgetClasses.message} ${type}`,
        );
        expect(widget._message.textContent).toBe(text);
      });

      test(".hideMessage()", () => {
        widget.hideMessage();

        expect(widget._input.className).toBe(widgetClasses.input);
        expect(widget._message.className).toBe(widgetClasses.message);
        expect(widget._message.textContent).toBe("");
      });

      test(".checkedPaySystem()", () => {
        const checkedPaySystem = paySystems[0];

        widget.checkedPaySystem(checkedPaySystem.value);

        paySystems.forEach((paySystem) => {
          expect(
            widget._container.querySelector(`.${paySystem.value}`).className,
          ).toBe(
            `${widgetClasses.card} ${paySystem.value} ${paySystem.value === checkedPaySystem.value ? "checked" : "transparent"}`,
          );
        });
      });

      test(".cleanPaySystem()", () => {
        widget.cleanPaySystem();

        paySystems.forEach((paySystem) => {
          expect(
            widget._container.querySelector(`.${paySystem.value}`).className,
          ).toBe(`${widgetClasses.card} ${paySystem.value}`);
        });
      });

      describe(".getPaySystem()", () => {
        test.each([
          { value: "5185016421053184", expected: "mastercard" },
          { value: "3541529934286103", expected: "jcb" },
          { value: "36865410416253", expected: "diners" },
          { value: "372860196586850", expected: "amex" },
          { value: "4716983987165598", expected: "visa" },
          { value: "6011815754814932", expected: "discover" },
          { value: "2211815754814932", expected: "mir" },
        ])('"$value" -> $expected', ({ value, expected }) => {
          const paySystem = widget.getPaySystem(value);

          expect(paySystem.value).toBe(expected);
        });
        test.each([
          { value: "1111111111111111", expected: undefined },
          { value: "0000000000000000", expected: undefined },
          { value: "", expected: undefined },
        ])('"$value" -> undefined', ({ value, expected }) => {
          const paySystem = widget.getPaySystem(value);

          expect(paySystem).toBe(expected);
        });
      });

      describe(".showPaySystem()", () => {
        test("called cleanPaySystem() and hideMessage()", () => {
          widget._input.value = "2";
          widget.cleanPaySystem = jest.fn();
          widget.hideMessage = jest.fn();
          widget.showPaySystem();

          expect(widget.cleanPaySystem).toHaveBeenCalled();
          expect(widget.hideMessage).toHaveBeenCalled();
        });

        test("called hideMessage() and checkedPaySystem()", () => {
          widget._input.value = "22";
          widget.hideMessage = jest.fn();
          widget.checkedPaySystem = jest.fn();
          widget.getPaySystem = jest.fn();
          widget.getPaySystem.mockReturnValue(true);
          widget.showPaySystem();

          expect(widget.hideMessage).toHaveBeenCalled();
          expect(widget.checkedPaySystem).toHaveBeenCalled();
        });

        test("not called hideMessage() and checkedPaySystem()", () => {
          widget._input.value = "22";
          widget.hideMessage = jest.fn();
          widget.checkedPaySystem = jest.fn();
          widget.getPaySystem = jest.fn();
          widget.getPaySystem.mockReturnValue(false);
          widget.showPaySystem();

          expect(widget.hideMessage).not.toHaveBeenCalled();
          expect(widget.checkedPaySystem).not.toHaveBeenCalled();
        });

        test("called showMessage()", () => {
          widget._input.value = "11";
          widget.showMessage = jest.fn();
          widget.showPaySystem();

          expect(widget.showMessage).toHaveBeenCalled();
        });
      });

      describe("addEventListener", () => {
        const eventClick = new MouseEvent("click");
        const eventInput = new KeyboardEvent("input");
        const eventSubmit = new Event("submit");

        beforeAll(() => {
          widget.bindToDOM();
        });

        test("_input -> input", () => {
          widget.showPaySystem = jest.fn();
          widget._input.dispatchEvent(eventInput);

          expect(widget.showPaySystem).toHaveBeenCalled();
        });

        test("_submitter -> click", () => {
          widget.cardValidation = jest.fn();
          widget._submitter.dispatchEvent(eventClick);

          expect(widget.cardValidation).toHaveBeenCalled();
        });

        test("_form -> submit", () => {
          eventSubmit.preventDefault = jest.fn();
          widget.cardValidation = jest.fn();
          widget._form.dispatchEvent(eventSubmit);

          expect(eventSubmit.preventDefault).toHaveBeenCalled();
          expect(widget.cardValidation).toHaveBeenCalled();
        });
      });
    });
  });
});
