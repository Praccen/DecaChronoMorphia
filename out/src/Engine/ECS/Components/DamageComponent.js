import { Component, ComponentTypeEnum } from "./Component.js";
export default class DamageComponent extends Component {
    damage;
    timeAlive;
    lifetime;
    constructor(damage, lifetime) {
        super(ComponentTypeEnum.DAMAGE);
        this.damage = damage;
        this.timeAlive = 0;
        this.lifetime = lifetime;
    }
}
//# sourceMappingURL=DamageComponent.js.map