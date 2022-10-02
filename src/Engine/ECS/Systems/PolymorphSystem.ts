import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import { PlayerShapeEnum } from "../Components/PlayerComponent.js";
import PolymorphComponent from "../Components/PolymorphComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import System from "./System.js";



export default class PolymorphSystem extends System {
	polymorphClockSecondCount: number;
	polymorphSystemUpdateCount: number;
	polymorphSystemUpdateCountLimit: number;
	// polymorphAlternatives: Array<string>;

	constructor() {
		super([
			ComponentTypeEnum.PLAYER,
			ComponentTypeEnum.ANIMATION,
			ComponentTypeEnum.GRAPHICS,
			ComponentTypeEnum.POLYMORPH
		]);
		this.polymorphClockSecondCount = 0;
		this.polymorphSystemUpdateCount = 0;
		this.polymorphSystemUpdateCountLimit = 144;
		// polymorphAlternatives: new Array<>();
	}

	getNextPolymorph(){
		// if on block
		// else
		const min: number = Math.ceil(0);
		var size = 0
		for (let element in PlayerShapeEnum) {
			if (isNaN(Number(element))) {
				size++
			}
		}
		const max: number = Math.floor(size);
		return Math.floor(Math.random() * (max - min + 1)) + min
		
	}

	update(dt: number) {
		this.polymorphSystemUpdateCount++;
		if (this.polymorphSystemUpdateCount >= this.polymorphSystemUpdateCountLimit){
			this.polymorphSystemUpdateCount = 1;
			this.polymorphClockSecondCount++;
		}
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const polymorphComp = e.getComponent(
				ComponentTypeEnum.POLYMORPH
			) as PolymorphComponent;

			if (this.polymorphClockSecondCount < 10 || !polymorphComp.isPolymorphing) {
				return;
			}
			const animationComp = e.getComponent(
				ComponentTypeEnum.ANIMATION
			) as AnimationComponent;

			const graphicsComp = e.getComponent(
				ComponentTypeEnum.GRAPHICS
			) as GraphicsComponent;

			if (polymorphComp.isPolymorphing){
				if (this.polymorphSystemUpdateCount > this.polymorphSystemUpdateCountLimit/2){
					polymorphComp.isPolymorphing = false
				}
			} else {
				polymorphComp.isPolymorphing = true
				polymorphComp.currentPolymorphShape = polymorphComp.nextPolymorphShape
				polymorphComp.nextPolymorphShape = this.getNextPolymorph() as PlayerShapeEnum
			}
		});
		if (this.polymorphClockSecondCount >= 10) {
			this.polymorphSystemUpdateCount = 1;
		}
	}
}
