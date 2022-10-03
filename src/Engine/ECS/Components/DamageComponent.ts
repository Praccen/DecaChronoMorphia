import { Component, ComponentTypeEnum } from "./Component.js";

export default class DamageComponent extends Component {
	damage: number;
	timeAlive: number;
	lifetime: number;

	constructor(damage: number, lifetime: number) {
		super(ComponentTypeEnum.DAMAGE);
		this.damage = damage;
		this.timeAlive = 0;
		this.lifetime = lifetime;
	}
}
