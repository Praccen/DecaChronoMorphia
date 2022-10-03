import Vec3 from "../../Maths/Vec3.js";
import Entity from "../Entity.js";
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
	projectileSpeed: number;

	direction: Vec3;
	position: Vec3;
	attackRequested: boolean;
	//attack speed
	attackCooldown: number;
	attackTimer: number;
	lifetime: number;
	damageEnts: Array<Entity>;
	weaponType: WeaponTypeEnum;

	constructor(
		damage: number,
		shoots: boolean,
		range: number,
		projectileSpeed: number,
		attackCooldown: number,
		weaponType: WeaponTypeEnum,
		attackTimeAlive: number
	) {
		super(ComponentTypeEnum.WEAPON);
		this.damage = damage;
		this.shoots = shoots;
		this.range = range;
		this.projectileSpeed = projectileSpeed;
		this.attackCooldown = attackCooldown;
		this.attackTimer = 0;
		this.weaponType = weaponType;
		this.lifetime = attackTimeAlive;
		this.damageEnts = new Array<Entity>();
		this.direction = new Vec3({ x: 0, y: 0, z: 0 });
	}
}
