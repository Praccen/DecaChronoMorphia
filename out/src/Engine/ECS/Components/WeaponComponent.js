import { Component, ComponentTypeEnum } from "./Component.js";
export var WeaponTypeEnum;
(function (WeaponTypeEnum) {
    WeaponTypeEnum[WeaponTypeEnum["SWORD"] = 0] = "SWORD";
    WeaponTypeEnum[WeaponTypeEnum["ARROW"] = 1] = "ARROW";
    WeaponTypeEnum[WeaponTypeEnum["MAGIC"] = 2] = "MAGIC";
})(WeaponTypeEnum || (WeaponTypeEnum = {}));
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
    weaponType;
    constructor(damage, shoots, range, attackCooldown, weaponType) {
        super(ComponentTypeEnum.WEAPON);
        this.damage = damage;
        this.shoots = shoots;
        this.range = range;
        this.attackCooldown = attackCooldown;
        this.attackTimer = 0;
        this.weaponType = weaponType;
    }
}
//# sourceMappingURL=WeaponComponent.js.map