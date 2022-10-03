import { Component, ComponentTypeEnum } from "./Component.js";
export default class DoorComponent extends Component {
    isOpen;
    constructor() {
        super(ComponentTypeEnum.DOOR);
        this.isOpen = false;
    }
}
//# sourceMappingURL=DoorComponent.js.map