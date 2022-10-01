import Vec3 from "../../Maths/Vec3.js";
import PhongQuad from "../../Objects/PhongQuad.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import Rendering from "../../Rendering.js";
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
			movementComp.accelerationDirection = directionToEnemy;
			const distanceToEnemy = directionToEnemy.length();

			if (distanceToEnemy > weaponComp.range) {
				//not within range, move closer to attack
				movementComp.accelerationDirection = directionToEnemy;
				return;
			}

			if (weaponComp.attackTimer <= 0) {
				const normalizedDirection = new Vec3(directionToEnemy).normalize();
				const dmgPosX = normalizedDirection.x * 1 + positionComp.position.x;
				const dmgPosY = normalizedDirection.y * 1 + positionComp.position.y;
				const dmgPosZ = normalizedDirection.z * 1 + positionComp.position.z;

				//---- Damage projectile ---//
				const dmgEntity = this.ecsManager.createEntity();
				this.ecsManager.addComponent(
					dmgEntity,
					new DamageComponent(weaponComp.damage)
				);
				this.ecsManager.addComponent(
					dmgEntity,
					new PositionComponent(
						new Vec3({ x: dmgPosX, y: dmgPosY, z: dmgPosZ })
					)
				);
				const dmgMoveComp = new MovementComponent();
				dmgMoveComp.accelerationDirection = directionToEnemy;
				//if melee make damageEntity move super fast, otherwise more slow
				const projectileSpeed = weaponComp.shoots ? 1 : 3;
				dmgMoveComp.velocity = new Vec3(directionToEnemy).multiply(
					projectileSpeed
				);
				dmgMoveComp.drag = 0.0;
				dmgMoveComp.acceleration = 0.0;
				dmgMoveComp.constantAcceleration.y = 0.0;
				this.ecsManager.addComponent(dmgEntity, dmgMoveComp);

				this.ecsManager.addComponent(dmgEntity, new CollisionComponent());

				let dmgTexture = "Assets/textures/mouse.png";
				let phongQuad = this.rendering.getNewPhongQuad(dmgTexture, dmgTexture);
				this.ecsManager.addComponent(
					dmgEntity,
					new GraphicsComponent(phongQuad)
				);
				//-------------

				weaponComp.attackTimer = weaponComp.attackCooldown;
			}
		});
	}
}
