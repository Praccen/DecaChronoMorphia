import { Component, ComponentTypeEnum } from "./Component.js";

export enum ProjectileTypeEnum {
	FIRE,
	ARROW,
}

export default class ProjectileComponent extends Component {
	projectileType: ProjectileTypeEnum;
	flipped: boolean;

	constructor(projectileType: ProjectileTypeEnum) {
		super(ComponentTypeEnum.PROJECTILE);
		this.projectileType = projectileType;
	}
}
