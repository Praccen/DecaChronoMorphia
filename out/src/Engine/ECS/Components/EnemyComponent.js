import { Component, ComponentTypeEnum } from "./Component.js";
export default class EnemyComponent extends Component {
    targetEntityId;
    constructor(targetEntityId) {
        super(ComponentTypeEnum.ENEMY);
        this.targetEntityId = targetEntityId;
    }
}
//# sourceMappingURL=EnemyComponent.js.map