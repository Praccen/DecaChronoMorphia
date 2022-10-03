import { Component, ComponentTypeEnum } from "./Component.js";
export var ProjectileTypeEnum;
(function (ProjectileTypeEnum) {
    ProjectileTypeEnum[ProjectileTypeEnum["FIRE"] = 0] = "FIRE";
    ProjectileTypeEnum[ProjectileTypeEnum["ARROW"] = 1] = "ARROW";
})(ProjectileTypeEnum || (ProjectileTypeEnum = {}));
export default class ProjectileComponent extends Component {
    projectileType;
    flipped;
    constructor(projectileType) {
        super(ComponentTypeEnum.PROJECTILE);
        this.projectileType = projectileType;
    }
}
//# sourceMappingURL=ProjectileComponent.js.map