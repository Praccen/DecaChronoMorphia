import { Component, ComponentTypeEnum } from "./Component.js";
export default class CollisionComponent extends Component {
    isStatic;
    currentCollisionEntities;
    hasForce;
    constructor() {
        super(ComponentTypeEnum.COLLISION);
        this.currentCollisionEntities = new Set();
        this.isStatic = false;
        this.hasForce = true;
    }
}
//# sourceMappingURL=CollisionComponent.js.map