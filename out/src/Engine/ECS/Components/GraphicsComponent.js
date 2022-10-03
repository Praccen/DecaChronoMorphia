import { Component, ComponentTypeEnum } from "./Component.js";
export default class GraphicsComponent extends Component {
    object;
    constructor(object) {
        super(ComponentTypeEnum.GRAPHICS);
        this.object = object;
    }
}
//# sourceMappingURL=GraphicsComponent.js.map