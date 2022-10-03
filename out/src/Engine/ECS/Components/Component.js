export var ComponentTypeEnum;
(function (ComponentTypeEnum) {
    ComponentTypeEnum[ComponentTypeEnum["ANIMATION"] = 0] = "ANIMATION";
    ComponentTypeEnum[ComponentTypeEnum["BOUNDINGBOX"] = 1] = "BOUNDINGBOX";
    ComponentTypeEnum[ComponentTypeEnum["COLLISION"] = 2] = "COLLISION";
    ComponentTypeEnum[ComponentTypeEnum["GRAPHICS"] = 3] = "GRAPHICS";
    ComponentTypeEnum[ComponentTypeEnum["MESHCOLLISION"] = 4] = "MESHCOLLISION";
    ComponentTypeEnum[ComponentTypeEnum["MOVEMENT"] = 5] = "MOVEMENT";
    ComponentTypeEnum[ComponentTypeEnum["PARTICLESPAWNER"] = 6] = "PARTICLESPAWNER";
    ComponentTypeEnum[ComponentTypeEnum["POSITION"] = 7] = "POSITION";
    ComponentTypeEnum[ComponentTypeEnum["MAPTILE"] = 8] = "MAPTILE";
    ComponentTypeEnum[ComponentTypeEnum["PLAYER"] = 9] = "PLAYER";
    ComponentTypeEnum[ComponentTypeEnum["CONNECTION"] = 10] = "CONNECTION";
    ComponentTypeEnum[ComponentTypeEnum["ENEMY"] = 11] = "ENEMY";
    ComponentTypeEnum[ComponentTypeEnum["POLYMORPH"] = 12] = "POLYMORPH";
    ComponentTypeEnum[ComponentTypeEnum["POINTLIGHT"] = 13] = "POINTLIGHT";
    ComponentTypeEnum[ComponentTypeEnum["WEAPON"] = 14] = "WEAPON";
    ComponentTypeEnum[ComponentTypeEnum["DAMAGE"] = 15] = "DAMAGE";
    ComponentTypeEnum[ComponentTypeEnum["HEALTH"] = 16] = "HEALTH";
    ComponentTypeEnum[ComponentTypeEnum["AUDIO"] = 17] = "AUDIO";
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