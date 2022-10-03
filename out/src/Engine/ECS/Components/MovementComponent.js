import { Component, ComponentTypeEnum } from "./Component.js";
import Vec3 from "../../Maths/Vec3.js";
export default class MovementComponent extends Component {
    constantAcceleration;
    accelerationDirection;
    acceleration;
    velocity;
    drag;
    constructor() {
        super(ComponentTypeEnum.MOVEMENT);
        this.constantAcceleration = new Vec3({ x: 0.0, y: -9.8, z: 0.0 });
        this.accelerationDirection = new Vec3();
        this.acceleration = 10.0;
        this.drag = 2.5;
        this.velocity = new Vec3();
    }
}
//# sourceMappingURL=MovementComponent.js.map