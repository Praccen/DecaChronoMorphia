import { Component, ComponentTypeEnum } from "./Component.js";

export default class EnemyComponent extends Component {
	targetEntityId?: number;

	constructor(targetEntityId?: number) {
		super(ComponentTypeEnum.ENEMY);
		this.targetEntityId = targetEntityId;
	}
}
