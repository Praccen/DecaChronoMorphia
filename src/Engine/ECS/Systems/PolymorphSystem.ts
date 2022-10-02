import { ComponentTypeEnum } from "../Components/Component.js";
import { PlayerShapeEnum } from "../Components/PlayerComponent.js";
import PolymorphComponent from "../Components/PolymorphComponent.js";
import System from "./System.js";

export default class PolymorphSystem extends System {
	polymorphClockSecondCount: number;
	polymorphSystemUpdateSecondCountLimit: number;
	polymorphActionTimeSeconds: number;

	constructor() {
		super([ComponentTypeEnum.POLYMORPH]);
		this.polymorphClockSecondCount = 0;
		this.polymorphSystemUpdateSecondCountLimit = 10;
		this.polymorphActionTimeSeconds = 0.5;
	}

	getNextPolymorph() {
		// if on block
		// else
		const min: number = Math.ceil(0);
		var size = 0;
		for (let element in PlayerShapeEnum) {
			if (isNaN(Number(element))) {
				size++;
			}
		}
		const max: number = Math.floor(size - 1);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	update(dt: number) {
		this.polymorphClockSecondCount += dt;

		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const polymorphComp = e.getComponent(
				ComponentTypeEnum.POLYMORPH
			) as PolymorphComponent;

			if (
				polymorphComp.isPolymorphing &&
				this.polymorphClockSecondCount >= this.polymorphActionTimeSeconds
			) {
				polymorphComp.isPolymorphing = false;
			}

			if (
				this.polymorphClockSecondCount >=
				this.polymorphSystemUpdateSecondCountLimit
			) {
				polymorphComp.isPolymorphing = true;
				polymorphComp.currentPolymorphShape = polymorphComp.nextPolymorphShape;
				polymorphComp.nextPolymorphShape =
					this.getNextPolymorph() as PlayerShapeEnum;
			}
		});
		if (
			this.polymorphClockSecondCount >=
			this.polymorphSystemUpdateSecondCountLimit
		) {
			console.log(this.polymorphClockSecondCount);
			this.polymorphClockSecondCount -=
				this.polymorphSystemUpdateSecondCountLimit;
		}
	}
}
