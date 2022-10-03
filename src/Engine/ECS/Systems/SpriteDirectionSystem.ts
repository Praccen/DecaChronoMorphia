import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import ProjectileComponent from "../Components/ProjectileComponent.js";
import WeaponComponent from "../Components/WeaponComponent.js";
import System from "./System.js";

export default class SpriteDirectionSystem extends System {
	constructor() {
		super([
			ComponentTypeEnum.POSITION,
			ComponentTypeEnum.MOVEMENT,
			ComponentTypeEnum.ANIMATION,
		]);
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const movementComp = e.getComponent(
				ComponentTypeEnum.MOVEMENT
			) as MovementComponent;

			const animationComp = e.getComponent(
				ComponentTypeEnum.ANIMATION
			) as AnimationComponent;

			const positionComp = e.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;

			const playerComp = e.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;

			const projectileComp = e.getComponent(
				ComponentTypeEnum.PROJECTILE
			) as ProjectileComponent;

			const enemyComp = e.getComponent(
				ComponentTypeEnum.ENEMY
			) as EnemyComponent;

			if (!enemyComp && !playerComp) {
				return;
			}

			let playerDodge = false;
			if (playerComp) {
				playerDodge = playerComp.dodgeing;
				if (!playerDodge) {
					playerComp.resetAnim = true;
				}
			}

			positionComp.rotation.setValues(-30.0, 0.0, 0.0);
			animationComp.modAdvancement = { x: 2, y: 0 };
			animationComp.updateInterval = 0.3;
			if (movementComp.velocity.length2() <= 0.07) {
				if (!playerDodge) {
					animationComp.startingTile = { x: 0, y: 3 };
					return;
				}
			}

			if (movementComp.accelerationDirection.z >= 0) {
				animationComp.startingTile = { x: 0, y: 1 };
				if (movementComp.accelerationDirection.x < 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else if (movementComp.accelerationDirection.x > 0) {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			} else if (movementComp.accelerationDirection.z < 0) {
				animationComp.startingTile = { x: 0, y: 0 };
				if (movementComp.accelerationDirection.x > 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else if (movementComp.accelerationDirection.x < 0) {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			}
			if (playerComp && playerDodge) {
				if (playerComp.resetAnim) {
					animationComp.advancements = 0;
					animationComp.updateTimer = 0;
					playerComp.resetAnim = false;
				}
				animationComp.startingTile = {
					x: playerComp.dodgeStartingTile.x,
					y: playerComp.dodgeStartingTile.y,
				};
				animationComp.modAdvancement = {
					x: playerComp.dodgeModAdvancement.x,
					y: playerComp.dodgeModAdvancement.y,
				};
				animationComp.updateInterval = playerComp.dodgeUpdateInterval;
			}
		});
	}
}
