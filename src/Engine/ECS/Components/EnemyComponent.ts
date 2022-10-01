import { Component, ComponentTypeEnum } from "./Component";

export default class EnemyComponent extends Component {
	targetEntityId?: number;

	constructor(targetEntityId?: number) {
		super(ComponentTypeEnum.ENEMY);
		this.targetEntityId = targetEntityId;
	}
}
