import { Component, ComponentTypeEnum } from "./Component.js";

export default class MovementComponent extends Component {
	health: number;
	constructor(health: number) {
		super(ComponentTypeEnum.HEALTH);
		this.health = health;
	}
}
