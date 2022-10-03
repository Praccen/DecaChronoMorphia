import { Component, ComponentTypeEnum } from "./Component.js";

export enum ProjectileTypeEnum {
	FIRE,
	ARROW,
}

export enum ProjectileGraphicsDirectionEnum {
	RIGHT,
	LEFT,
}

export default class ProjectileComponent extends Component {
	projectileType: ProjectileTypeEnum;
	projectileGraphicsDirection: ProjectileGraphicsDirectionEnum;
	flipped: boolean;

	constructor(
		projectileType: ProjectileTypeEnum,
		projectileGraphicsDirection: ProjectileGraphicsDirectionEnum
	) {
		super(ComponentTypeEnum.PROJECTILE);
		this.projectileType = projectileType;
		this.projectileGraphicsDirection = projectileGraphicsDirection;
	}
}
