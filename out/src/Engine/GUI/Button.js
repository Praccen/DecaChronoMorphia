import Vec2 from "../Maths/Vec2.js";
import GuiObject from "./GuiObject.js";
export default class Button extends GuiObject {
    position;
    textSize;
    inputNode;
    constructor() {
        super("floating-div");
        this.position = new Vec2();
        this.textSize = 42;
        // make an input node and a label node
        this.inputNode = document.createElement("input");
        this.inputNode.type = "button";
        this.inputNode.className = "button";
        this.div.appendChild(this.inputNode);
    }
    getElement() {
        return this.div;
    }
    getInputElement() {
        return this.inputNode;
    }
    onClick(fn) {
        this.inputNode.addEventListener("click", fn);
    }
    draw() {
        this.position2D = this.position;
        this.inputNode.value = this.textString;
        this.fontSize = this.textSize;
        this.drawObject();
    }
}
//# sourceMappingURL=Button.js.map