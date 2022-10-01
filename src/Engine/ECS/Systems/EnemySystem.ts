import Vec3 from "../../Maths/Vec3.js";
import PhongQuad from "../../Objects/PhongQuad.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class EnemySystem extends System {
	ecsManager: ECSManager;

	constructor(manager) {
		super([
			ComponentTypeEnum.ENEMY,
			ComponentTypeEnum.POSITION,
			ComponentTypeEnum.MOVEMENT,
		]);
		this.ecsManager = manager;
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const enemyComp = e.getComponent(
				ComponentTypeEnum.ENEMY
			) as EnemyComponent;
			if (enemyComp.targetEntityId === undefined) {
				return;
			}
			const targetEntity = this.ecsManager.getEntity(enemyComp.targetEntityId);
			const targetPositionComp = targetEntity.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;
			const positionComp = e.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;
			const movementComp = e.getComponent(
				ComponentTypeEnum.MOVEMENT
			) as MovementComponent;

			const newAccelerationDirection = new Vec3({
				x: targetPositionComp.position.x,
				y: targetPositionComp.position.y,
				z: targetPositionComp.position.z,
			}).subtract(positionComp.position);

			const graphComp = e.getComponent(
				ComponentTypeEnum.GRAPHICS
			) as GraphicsComponent;
			const animComp = e.getComponent(
				ComponentTypeEnum.ANIMATION
			) as AnimationComponent;

			if (graphComp && animComp) {
				let quad = <PhongQuad>graphComp.object;
				if (newAccelerationDirection.x < 0) {
					quad.textureMatrix.scale(-1, 1, 1);
				}
			}
			movementComp.accelerationDirection = newAccelerationDirection;
		});
	}
}
