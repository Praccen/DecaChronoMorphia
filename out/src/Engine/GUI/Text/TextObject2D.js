import Vec3 from "../../Maths/Vec3.js";
import GuiObject from "../GuiObject.js";
export default class TextObject2D extends GuiObject {
    position;
    size;
    textNode;
    constructor() {
        super("floating-div");
        this.position = new Vec3();
        this.size = 42;
        // make a text node for its content
        this.textNode = document.createTextNode("");
        this.div.appendChild(this.textNode);
    }
    draw() {
        this.position2D = this.position;
        this.fontSize = this.size;
        this.textNode.textContent = this.textString;
        this.drawObject();
    }
}
//# sourceMappingURL=TextObject2D.js.map