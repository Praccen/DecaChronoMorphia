import Vec2 from "../Maths/Vec2.js";
export default class GuiObject {
    position2D;
    fontSize;
    scaleWithWindow;
    textString;
    center;
    removed;
    divContainerElement;
    div;
    constructor(cssClass) {
        this.removed = false;
        this.position2D = new Vec2();
        this.fontSize = 42;
        this.scaleWithWindow = true;
        this.textString = "";
        this.center = false;
        // look up the guicontainer
        this.divContainerElement = (document.getElementById("guicontainer"));
        // make the div
        this.div = document.createElement("div");
        // assign it a CSS class
        this.div.className = cssClass;
        // add it to the divcontainer
        this.divContainerElement.appendChild(this.div);
    }
    getElement() {
        return this.div;
    }
    setHidden(hidden) {
        this.div.hidden = hidden;
    }
    remove() {
        this.div.remove();
        this.removed = true;
    }
    drawObject() {
        let style = getComputedStyle(this.divContainerElement);
        this.div.style.left =
            parseInt(style.paddingLeft) +
                this.position2D.x * parseInt(style.width) +
                "px";
        this.div.style.top =
            parseInt(style.paddingTop) +
                this.position2D.y * parseInt(style.height) +
                "px";
        if (this.scaleWithWindow) {
            this.div.style.fontSize =
                this.fontSize * (parseInt(style.height) / 1080.0) + "px";
        }
        else {
            this.div.style.fontSize = this.fontSize + "px";
        }
        if (this.center) {
            this.div.style.transform = "translateX(-50%)";
        }
    }
}
//# sourceMappingURL=GuiObject.js.map