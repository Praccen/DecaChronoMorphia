export enum ComponentTypeEnum {
	ANIMATION,
	BOUNDINGBOX,
	COLLISION,
	GRAPHICS,
	MESHCOLLISION,
	MOVEMENT,
	PARTICLESPAWNER,
	POSITION,
	MAPTILE,
	PLAYER,
	CONNECTION,
	ENEMY,
	WEAPON,
	DAMAGE,
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
