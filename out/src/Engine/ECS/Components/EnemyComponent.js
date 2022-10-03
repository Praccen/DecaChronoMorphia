import { Component, ComponentTypeEnum } from "./Component.js";
export default class EnemyComponent extends Component {
    targetEntityId;
    enemyType;
    constructor(enemyType, targetEntityId) {
        super(ComponentTypeEnum.ENEMY);
        this.targetEntityId = targetEntityId;
        this.enemyType = enemyType;
    }
}
//# sourceMappingURL=EnemyComponent.js.map