export enum ComponentTypeEnum {
	ANIMATION,
	BOUNDINGBOX,
	COLLISION,
	DOOR,
	GRAPHICS,
	MESHCOLLISION,
	MOVEMENT,
	PARTICLESPAWNER,
	POSITION,
	MAPTILE,
	PLAYER,
	CONNECTION,
	ENEMY,
	POLYMORPH,
	POINTLIGHT,
	WEAPON,
	DAMAGE,
	HEALTH,
	AUDIO,
	PROJECTILE,
}

export class Component {
	private _type: ComponentTypeEnum;

	constructor(type: ComponentTypeEnum) {
		this._type = type;
	}

	get type(): ComponentTypeEnum {
		return this._type;
	}
}
