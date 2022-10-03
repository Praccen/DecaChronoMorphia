import { Component, ComponentTypeEnum } from "./Component.js";
import { PlayerShapeEnum } from "./PlayerComponent.js";
export default class PolymorphComponent extends Component {
    currentPolymorphShape;
    nextPolymorphShape;
    isPolymorphing;
    constructor(currentPolymorphShape, nextPolymorph, isPolymorphing) {
        super(ComponentTypeEnum.POLYMORPH);
        if (currentPolymorphShape === undefined) {
            this.currentPolymorphShape = PlayerShapeEnum.NORMIE;
        }
        else {
            this.currentPolymorphShape = currentPolymorphShape;
        }
        if (nextPolymorph === undefined) {
            this.nextPolymorphShape = PlayerShapeEnum.TANKY;
        }
        else {
            this.nextPolymorphShape = nextPolymorph;
        }
        if (isPolymorphing === undefined) {
            this.isPolymorphing = false;
        }
        else {
            this.isPolymorphing = isPolymorphing;
        }
    }
}
//# sourceMappingURL=PolymorphComponent.js.map