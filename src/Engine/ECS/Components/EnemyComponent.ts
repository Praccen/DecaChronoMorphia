import { EnemyTypesEnum } from "../../../Constants/EnemyData.js";
import { Component, ComponentTypeEnum } from "./Component.js";

export default class EnemyComponent extends Component {
	targetEntityId?: number;
	enemyType: EnemyTypesEnum;

	constructor(enemyType: EnemyTypesEnum, targetEntityId?: number) {
		super(ComponentTypeEnum.ENEMY);
		this.targetEntityId = targetEntityId;
		this.enemyType = enemyType;
	}
}
