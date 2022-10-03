import { WeaponTypeEnum } from "../Engine/ECS/Components/WeaponComponent.js";

export enum EnemyTypesEnum {
	SLIME = "SLIME",
	WOLF = "WOLF",
	DRYAD = "DRYAD",
	SKULL = "SKULL",
}

export interface EnemyDataType {
	damage: number;
	shoots: boolean;
	range: number;
	projectileSpeed: number;
	attackCooldown: number;
	attackSound: string;
	weaponType: WeaponTypeEnum;
	acceleration: number;
	texturePath: string;
}

export type EnemyDataTypes = {
	[key in EnemyTypesEnum]: EnemyDataType;
};

export const EnemyData: EnemyDataTypes = {
	[EnemyTypesEnum.SLIME]: {
		damage: 10,
		shoots: true,
		range: 4,
		projectileSpeed: 3,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		weaponType: WeaponTypeEnum.ARROW,
		acceleration: 5.0,
		texturePath: "Assets/textures/slime.png",
	},
	[EnemyTypesEnum.WOLF]: {
		damage: 20,
		shoots: false,
		range: 1,
		projectileSpeed: 3,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		weaponType: WeaponTypeEnum.SWORD,
		acceleration: 10.0,
		texturePath: "Assets/textures/owo.png",
	},
	[EnemyTypesEnum.DRYAD]: {
		damage: 20,
		shoots: true,
		range: 4,
		projectileSpeed: 6,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		weaponType: WeaponTypeEnum.ARROW,
		acceleration: 0,
		texturePath: "Assets/textures/dryady.png",
	},
	[EnemyTypesEnum.SKULL]: {
		damage: 30,
		shoots: true,
		range: 8,
		projectileSpeed: 5,
		attackCooldown: 3,
		attackSound: "spell_cast_3",
		weaponType: WeaponTypeEnum.MAGIC,
		acceleration: 2.0,
		texturePath: "Assets/textures/skully.png",
	},
};
