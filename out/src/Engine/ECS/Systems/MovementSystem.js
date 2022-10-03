import System from "./System.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import Vec3 from "../../Maths/Vec3.js";
export default class MovementSystem extends System {
    constructor() {
        super([ComponentTypeEnum.POSITION, ComponentTypeEnum.MOVEMENT]);
    }
    update(dt) {
        for (const e of this.entities) {
            //entity is inactive, continue
            if (!e.isActive) {
                continue;
            }
            let posComp = (e.getComponent(ComponentTypeEnum.POSITION));
            let movComp = (e.getComponent(ComponentTypeEnum.MOVEMENT));
            // Do movement calculations
            movComp.velocity.add(new Vec3(movComp.accelerationDirection)
                .multiply(movComp.acceleration)
                .multiply(dt));
            movComp.velocity.add(new Vec3(movComp.constantAcceleration).multiply(dt));
            posComp.position.add(new Vec3(movComp.velocity).multiply(dt));
            movComp.accelerationDirection.multiply(0.0);
            //Drag
            if (movComp.velocity.x > 0.0 || movComp.velocity.x < 0.0) {
                movComp.velocity.x -=
                    movComp.velocity.x *
                        (1.0 - movComp.accelerationDirection.x * movComp.velocity.x) *
                        movComp.drag *
                        dt;
            }
            if (movComp.velocity.z > 0.0 || movComp.velocity.z < 0.0) {
                movComp.velocity.z -=
                    movComp.velocity.z *
                        (1.0 - movComp.accelerationDirection.z * movComp.velocity.z) *
                        (movComp.drag * dt);
            }
            //stop if velocity is too slow
            const accelerating = movComp.accelerationDirection.x > 0.0;
            if (accelerating &&
                movComp.velocity.x < 0.01 &&
                movComp.velocity.x > -0.01) {
                movComp.velocity.x = 0.0;
            }
            const acceleratingZ = movComp.accelerationDirection.z > 0.0;
            if (acceleratingZ &&
                movComp.velocity.z < 0.01 &&
                movComp.velocity.z > -0.01) {
                movComp.velocity.z = 0.0;
            }
        }
    }
}
//# sourceMappingURL=MovementSystem.js.map