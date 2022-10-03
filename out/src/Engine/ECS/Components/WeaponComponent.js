import { Component, ComponentTypeEnum } from "./Component.js";
export default class WeaponComponent extends Component {
    damage;
    shoots; //if this weapon shoots a projectile
    range; //how long the attack reaches
    direction;
    position;
    attackRequested;
    //attack speed
    attackCooldown;
    attackTimer;
    constructor(damage, shoots, range, attackCooldown) {
        super(ComponentTypeEnum.WEAPON);
        this.damage = damage;
        this.shoots = shoots;
        this.range = range;
        this.attackCooldown = attackCooldown;
        this.attackTimer = 0;
    }
}
//# sourceMappingURL=WeaponComponent.js.map