import { Component, ComponentTypeEnum } from "./Component.js";
export var ProjectileGraphicsDirectionEnum;
(function (ProjectileGraphicsDirectionEnum) {
    ProjectileGraphicsDirectionEnum[ProjectileGraphicsDirectionEnum["RIGHT"] = 0] = "RIGHT";
    ProjectileGraphicsDirectionEnum[ProjectileGraphicsDirectionEnum["LEFT"] = 1] = "LEFT";
    ProjectileGraphicsDirectionEnum[ProjectileGraphicsDirectionEnum["UP"] = 2] = "UP";
    ProjectileGraphicsDirectionEnum[ProjectileGraphicsDirectionEnum["DOWN"] = 3] = "DOWN";
})(ProjectileGraphicsDirectionEnum || (ProjectileGraphicsDirectionEnum = {}));
export default class ProjectileComponent extends Component {
    projectileGraphicsDirection;
    weaponType;
    constructor(projectileGraphicsDirection, weaponType) {
        super(ComponentTypeEnum.PROJECTILE);
        this.projectileGraphicsDirection = projectileGraphicsDirection;
        this.weaponType = weaponType;
    }
}
//# sourceMappingURL=ProjectileComponent.js.map