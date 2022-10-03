import Vec3 from "../../Maths/Vec3.js";
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
    projectileSpeed;
    direction;
    position;
    attackRequested;
    //attack speed
    attackCooldown;
    attackTimer;
    lifetime;
    damageEnts;
    weaponType;
    constructor(damage, shoots, range, projectileSpeed, attackCooldown, weaponType, attackTimeAlive) {
        super(ComponentTypeEnum.WEAPON);
        this.damage = damage;
        this.shoots = shoots;
        this.range = range;
        this.projectileSpeed = projectileSpeed;
        this.attackCooldown = attackCooldown;
        this.attackTimer = 0;
        this.weaponType = weaponType;
        this.lifetime = attackTimeAlive;
        this.damageEnts = new Array();
        this.direction = new Vec3({ x: 0, y: 0, z: 0 });
    }
}
//# sourceMappingURL=WeaponComponent.js.map