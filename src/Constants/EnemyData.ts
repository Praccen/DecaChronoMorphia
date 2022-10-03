import { WeaponTypeEnum } from "../Engine/ECS/Components/WeaponComponent.js";

export enum EnemyTypesEnum {
	SLIME = "SLIME",
	WOLF = "WOLF",
	DRYAD = "DRYAD",
	SKULL = "SKULL",
}

export interface EnemyDataType {
	health: number;
	damage: number;
	shoots: boolean;
	range: number;
	projectileSpeed: number;
	attackCooldown: number;
	attackSound: string;
	deathSound: string;
	weaponType: WeaponTypeEnum;
	attackTimeAlive: number;
	acceleration: number;
	texturePath: string;
}

export type EnemyDataTypes = {
	[key in EnemyTypesEnum]: EnemyDataType;
};

export const EnemyData: EnemyDataTypes = {
	[EnemyTypesEnum.SLIME]: {
		health: 20,
		damage: 10,
		shoots: true,
		range: 4,
		projectileSpeed: 3,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		deathSound: "enemy_death_1",
		weaponType: WeaponTypeEnum.ARROW,
		attackTimeAlive: 10,
		acceleration: 5.0,
		texturePath: "Assets/textures/slime.png",
	},
	[EnemyTypesEnum.WOLF]: {
		health: 20,
		damage: 20,
		shoots: false,
		range: 1,
		projectileSpeed: 3,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		deathSound: "enemy_death_1",
		weaponType: WeaponTypeEnum.SWORD,
		attackTimeAlive: 1.0,
		acceleration: 10.0,
		texturePath: "Assets/textures/owo.png",
	},
	[EnemyTypesEnum.DRYAD]: {
		health: 10,
		damage: 20,
		shoots: true,
		range: 4,
		projectileSpeed: 6,
		attackCooldown: 2,
		attackSound: "spell_cast_3",
		deathSound: "enemy_death_1",
		weaponType: WeaponTypeEnum.ARROW,
		attackTimeAlive: 10,
		acceleration: 0,
		texturePath: "Assets/textures/dryady.png",
	},
	[EnemyTypesEnum.SKULL]: {
		health: 10,
		damage: 30,
		shoots: true,
		range: 8,
		projectileSpeed: 5,
		attackCooldown: 3,
		attackSound: "spell_cast_3",
		deathSound: "enemy_death_1",
		weaponType: WeaponTypeEnum.MAGIC,
		attackTimeAlive: 10,
		acceleration: 2.0,
		texturePath: "Assets/textures/skully.png",
	},
};
