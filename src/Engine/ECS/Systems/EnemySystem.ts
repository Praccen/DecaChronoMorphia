import Vec3 from "../../Maths/Vec3.js";
import PhongQuad from "../../Objects/PhongQuad.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import Rendering from "../../Rendering.js";
import BoundingBoxComponent from "../Components/BoundingBoxComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import WeaponComponent from "../Components/WeaponComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class EnemySystem extends System {
	ecsManager: ECSManager;
	rendering: Rendering;

	constructor(manager, rendering) {
		super([
			ComponentTypeEnum.ENEMY,
			ComponentTypeEnum.POSITION,
			ComponentTypeEnum.MOVEMENT,
			ComponentTypeEnum.WEAPON,
		]);
		this.ecsManager = manager;
		this.rendering = rendering;
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
			const weaponComp = e.getComponent(
				ComponentTypeEnum.WEAPON
			) as WeaponComponent;
			const graphComp = e.getComponent(
				ComponentTypeEnum.GRAPHICS
			) as GraphicsComponent;
			const animComp = e.getComponent(
				ComponentTypeEnum.ANIMATION
			) as AnimationComponent;

			weaponComp.attackTimer = Math.max(weaponComp.attackTimer - dt, 0);

			const directionToEnemy = new Vec3({
				x: targetPositionComp.position.x,
				y: targetPositionComp.position.y,
				z: targetPositionComp.position.z,
			}).subtract(positionComp.position);

			if (graphComp && animComp) {
				let quad = <PhongQuad>graphComp.object;
				if (directionToEnemy.x < 0) {
					quad.textureMatrix.scale(-1, 1, 1);
				}
			}
			const distanceToEnemy = directionToEnemy.length();

			if (distanceToEnemy > weaponComp.range) {
				//not within range, move closer to attack
				movementComp.accelerationDirection = directionToEnemy;
				return;
			}

			//Attack if weapon is ready
			if (weaponComp.attackTimer <= 0) {
				weaponComp.attackRequested = true;
				weaponComp.direction = new Vec3(directionToEnemy).normalize();
				weaponComp.position = new Vec3({
					x: weaponComp.direction.x * 1 + positionComp.position.x,
					y: weaponComp.direction.z * 1 + positionComp.position.z,
					z: 0.0,
				});
			}
		});
	}
}
