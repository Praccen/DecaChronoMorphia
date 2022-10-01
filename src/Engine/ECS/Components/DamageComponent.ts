import { Component, ComponentTypeEnum } from "./Component.js";

export default class DamageComponent extends Component {
	damage: number;

	constructor(damage: number) {
		super(ComponentTypeEnum.DAMAGE);
		this.damage = damage;
	}
}
