import { Component, ComponentTypeEnum } from "./Component.js";

export default class WeaponComponent extends Component {
	damage: number;
	shoots: boolean; //if this weapon shoots a projectile
	range: number; //how long the attack reaches

	attackRequested: boolean;
	//attack speed
	attackCooldown: number;
	attackTimer: number;

	constructor(
		damage: number,
		shoots: boolean,
		range: number,
		attackCooldown: number
	) {
		super(ComponentTypeEnum.WEAPON);
		this.damage = damage;
		this.shoots = shoots;
		this.range = range;
		this.attackCooldown = attackCooldown;
		this.attackTimer = 0;
	}
}
