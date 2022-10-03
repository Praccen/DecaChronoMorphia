import { Component, ComponentTypeEnum } from "./Component.js";
export default class DamageComponent extends Component {
    damage;
    timeAlive;
    lifetime;
    ownerId;
    constructor(damage, lifetime, ownerId) {
        super(ComponentTypeEnum.DAMAGE);
        this.damage = damage;
        this.timeAlive = 0;
        this.lifetime = lifetime;
        this.ownerId = ownerId;
    }
}
//# sourceMappingURL=DamageComponent.js.map