import { Component, ComponentTypeEnum } from "./Component.js";
export default class MovementComponent extends Component {
    health;
    constructor(health) {
        super(ComponentTypeEnum.HEALTH);
        this.health = health;
    }
}
//# sourceMappingURL=HealthComponent.js.map