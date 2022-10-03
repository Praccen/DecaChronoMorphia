import System from "./System.js";
import { ComponentTypeEnum } from "../Components/Component.js";
export default class GraphicsSystem extends System {
    constructor() {
        super([ComponentTypeEnum.POSITION]);
        // Optional ComponentTypeEnum.GRAPHICS, ComponentTypeEnum.POINTLIGHT
    }
    update(dt) {
        for (const e of this.entities) {
            //entity is inactive, continue
            if (!e.isActive) {
                continue;
            }
            let posComp = (e.getComponent(ComponentTypeEnum.POSITION));
            let graphComp = (e.getComponent(ComponentTypeEnum.GRAPHICS));
            if (graphComp && posComp) {
                posComp.calculateMatrix(graphComp.object.modelMatrix);
            }
            let pointLightComp = (e.getComponent(ComponentTypeEnum.POINTLIGHT));
            if (pointLightComp && posComp) {
                pointLightComp.pointLight.position
                    .deepAssign(posComp.position)
                    .add(pointLightComp.posOffset);
            }
        }
    }
}
//# sourceMappingURL=GraphicsSystem.js.map