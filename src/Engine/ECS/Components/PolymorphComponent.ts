import { Component, ComponentTypeEnum } from "./Component.js";
import { PlayerShapeEnum } from "./PlayerComponent.js";

export default class PolymorphComponent extends Component {
	currentPolymorphShape: PlayerShapeEnum;
	nextPolymorphShape: PlayerShapeEnum;
	isPolymorphing: boolean;

	constructor(
		currentPolymorphShape?: PlayerShapeEnum,
		nextPolymorph?: PlayerShapeEnum,
		isPolymorphing?: boolean
	) {
		super(ComponentTypeEnum.POLYMORPH);
		if (currentPolymorphShape === undefined) {
			this.currentPolymorphShape = PlayerShapeEnum.NORMIE;
		} else {
			this.currentPolymorphShape = currentPolymorphShape;
		}
		if (nextPolymorph === undefined) {
			this.nextPolymorphShape = PlayerShapeEnum.TANKY;
		} else {
			this.nextPolymorphShape = nextPolymorph;
		}
		if (isPolymorphing === undefined) {
			this.isPolymorphing = false;
		} else {
			this.isPolymorphing = isPolymorphing;
		}
	}
}
