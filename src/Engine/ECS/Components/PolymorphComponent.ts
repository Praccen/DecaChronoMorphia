import { Component, ComponentTypeEnum } from "./Component.js";
import { PlayerShapeEnum } from "./PlayerComponent.js";


export default class PolymorphComponent extends Component {
	nextPolymorphShape?: PlayerShapeEnum;
	isPolymorphing?: boolean;

	constructor(nextPolymorph?: PlayerShapeEnum, isPolymorphing?: boolean) {
		super(ComponentTypeEnum.POLYMORPH);
		if (nextPolymorph === undefined){
			this.nextPolymorphShape = PlayerShapeEnum.NORMIE;
		}else {
			this.nextPolymorphShape = nextPolymorph;
		}
		if (isPolymorphing === undefined) {
			this.isPolymorphing = false;
		} else {
			this.isPolymorphing = isPolymorphing;
		}
	}
}
