import Vec3 from "../../Maths/Vec3.js";
import { Component, ComponentTypeEnum } from "./Component.js";
export default class PointLightComponent extends Component {
    pointLight;
    posOffset;
    constructor(pointLight) {
        super(ComponentTypeEnum.POINTLIGHT);
        this.pointLight = pointLight;
        this.posOffset = new Vec3();
    }
}
//# sourceMappingURL=PointLightComponent.js.map