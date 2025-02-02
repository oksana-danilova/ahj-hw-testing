import { CardValidatorWidget } from "./widget";

const container = document.querySelector("#app");
const widget = new CardValidatorWidget(container);
widget.bindToDOM();
