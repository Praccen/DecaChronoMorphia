import Vec2 from "../Maths/Vec2.js";
import GuiObject from "./GuiObject.js";
export default class Slider extends GuiObject {
    position;
    textSize;
    inputNode;
    label;
    constructor() {
        super("floating-div");
        this.position = new Vec2();
        this.textSize = 42;
        // make an input node and a label node
        this.inputNode = document.createElement("input");
        this.inputNode.type = "range";
        this.label = document.createElement("label");
        this.label.textContent = this.textString;
        this.div.appendChild(this.label);
        this.div.appendChild(this.inputNode);
    }
    getElement() {
        return this.div;
    }
    getInputElement() {
        return this.inputNode;
    }
    getValue() {
        return Number(this.inputNode.value);
    }
    draw() {
        this.position2D = this.position;
        this.fontSize = this.textSize;
        this.label.textContent = this.textString;
        this.drawObject();
    }
}
//# sourceMappingURL=Slider.js.map