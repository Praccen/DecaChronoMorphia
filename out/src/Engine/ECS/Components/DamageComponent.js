import { Component, ComponentTypeEnum } from "./Component.js";
export default class DamageComponent extends Component {
    damage;
    constructor(damage) {
        super(ComponentTypeEnum.DAMAGE);
        this.damage = damage;
    }
}
//# sourceMappingURL=DamageComponent.js.map