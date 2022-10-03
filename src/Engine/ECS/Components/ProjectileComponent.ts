import { Component, ComponentTypeEnum } from "./Component.js";
import { WeaponTypeEnum } from "./WeaponComponent.js";

export enum ProjectileGraphicsDirectionEnum {
	RIGHT,
	LEFT,
}

export default class ProjectileComponent extends Component {
	projectileGraphicsDirection: ProjectileGraphicsDirectionEnum;
	weaponType: WeaponTypeEnum;

	constructor(
		projectileGraphicsDirection: ProjectileGraphicsDirectionEnum,
		weaponType: WeaponTypeEnum
	) {
		super(ComponentTypeEnum.PROJECTILE);
		this.projectileGraphicsDirection = projectileGraphicsDirection;
		this.weaponType = weaponType;
	}
}
