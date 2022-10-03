export var ComponentTypeEnum;
(function (ComponentTypeEnum) {
    ComponentTypeEnum[ComponentTypeEnum["ANIMATION"] = 0] = "ANIMATION";
    ComponentTypeEnum[ComponentTypeEnum["BOUNDINGBOX"] = 1] = "BOUNDINGBOX";
    ComponentTypeEnum[ComponentTypeEnum["COLLISION"] = 2] = "COLLISION";
    ComponentTypeEnum[ComponentTypeEnum["DOOR"] = 3] = "DOOR";
    ComponentTypeEnum[ComponentTypeEnum["GRAPHICS"] = 4] = "GRAPHICS";
    ComponentTypeEnum[ComponentTypeEnum["MESHCOLLISION"] = 5] = "MESHCOLLISION";
    ComponentTypeEnum[ComponentTypeEnum["MOVEMENT"] = 6] = "MOVEMENT";
    ComponentTypeEnum[ComponentTypeEnum["PARTICLESPAWNER"] = 7] = "PARTICLESPAWNER";
    ComponentTypeEnum[ComponentTypeEnum["POSITION"] = 8] = "POSITION";
    ComponentTypeEnum[ComponentTypeEnum["MAPTILE"] = 9] = "MAPTILE";
    ComponentTypeEnum[ComponentTypeEnum["PLAYER"] = 10] = "PLAYER";
    ComponentTypeEnum[ComponentTypeEnum["CONNECTION"] = 11] = "CONNECTION";
    ComponentTypeEnum[ComponentTypeEnum["ENEMY"] = 12] = "ENEMY";
    ComponentTypeEnum[ComponentTypeEnum["POLYMORPH"] = 13] = "POLYMORPH";
    ComponentTypeEnum[ComponentTypeEnum["POINTLIGHT"] = 14] = "POINTLIGHT";
    ComponentTypeEnum[ComponentTypeEnum["WEAPON"] = 15] = "WEAPON";
    ComponentTypeEnum[ComponentTypeEnum["DAMAGE"] = 16] = "DAMAGE";
    ComponentTypeEnum[ComponentTypeEnum["HEALTH"] = 17] = "HEALTH";
    ComponentTypeEnum[ComponentTypeEnum["AUDIO"] = 18] = "AUDIO";
    ComponentTypeEnum[ComponentTypeEnum["PROJECTILE"] = 19] = "PROJECTILE";
})(ComponentTypeEnum || (ComponentTypeEnum = {}));
export class Component {
    _type;
    constructor(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
}
//# sourceMappingURL=Component.js.map