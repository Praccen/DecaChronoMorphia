import Vec3 from "../../Maths/Vec3.js";
import { Component, ComponentTypeEnum } from "./Component.js";

export enum WeaponTypeEnum {
	SWORD,
	ARROW,
	MAGIC,
}

export default class WeaponComponent extends Component {
	damage: number;
	shoots: boolean; //if this weapon shoots a projectile
	range: number; //how long the attack reaches

	direction: Vec3;
	position: Vec3;
	attackRequested: boolean;
	//attack speed
	attackCooldown: number;
	attackTimer: number;
	lifetime: number;
	weaponType: WeaponTypeEnum;

	constructor(
		damage: number,
		shoots: boolean,
		range: number,
		attackCooldown: number,
		weaponType: WeaponTypeEnum,
		attackTimeAlive: number
	) {
		super(ComponentTypeEnum.WEAPON);
		this.damage = damage;
		this.shoots = shoots;
		this.range = range;
		this.attackCooldown = attackCooldown;
		this.attackTimer = 0;
		this.weaponType = weaponType;
		this.lifetime = attackTimeAlive;
	}
}
