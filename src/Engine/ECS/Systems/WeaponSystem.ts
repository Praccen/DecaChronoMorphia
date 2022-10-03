import Vec3 from "../../Maths/Vec3.js";
import Rendering from "../../Rendering.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import AudioComponent, { AudioTypeEnum } from "../Components/AudioComponent.js";
import BoundingBoxComponent from "../Components/BoundingBoxComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PointLightComponent from "../Components/PointLightComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import ProjectileComponent, {
	ProjectileGraphicsDirectionEnum,
} from "../Components/ProjectileComponent.js";
import WeaponComponent, {
	WeaponTypeEnum,
} from "../Components/WeaponComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class WeaponSystem extends System {
	ecsManager: ECSManager;
	rendering: Rendering;

	constructor(manager, rendering) {
		super([ComponentTypeEnum.WEAPON]);
		this.ecsManager = manager;
		this.rendering = rendering;
	}

	update(dt: number): void {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}

			const weaponComp = e.getComponent(
				ComponentTypeEnum.WEAPON
			) as WeaponComponent;

			weaponComp.attackTimer -= dt;

			if (weaponComp.weaponType == WeaponTypeEnum.SWORD) {
				weaponComp.damageEnts.forEach((element) => {
					const positionComp = element.getComponent(
						ComponentTypeEnum.POSITION
					) as PositionComponent;
					positionComp.position.x = weaponComp.position.x;
					positionComp.position.y = weaponComp.position.y;
					positionComp.position.z = weaponComp.position.z;
				});
			}

			if (weaponComp.attackRequested && weaponComp.attackTimer <= 0) {
				const dmgEntity = this.ecsManager.createEntity();
				weaponComp.damageEnts.push(dmgEntity);
				this.ecsManager.addComponent(
					dmgEntity,
					new DamageComponent(weaponComp.damage, weaponComp.lifetime, e.id)
				);
				this.ecsManager.addComponent(
					dmgEntity,
					new PositionComponent(
						new Vec3({
							x: weaponComp.position.x,
							y: weaponComp.position.y,
							z: weaponComp.position.z,
						})
					)
				);
				const dmgMoveComp = new MovementComponent();
				dmgMoveComp.accelerationDirection = weaponComp.direction;
				//if melee make damageEntity move super fast, otherwise more slow
				const projectileSpeed = weaponComp.shoots
					? weaponComp.projectileSpeed
					: 3;
				dmgMoveComp.velocity = new Vec3(weaponComp.direction).multiply(
					projectileSpeed
				);

				dmgMoveComp.drag = 0.0;
				dmgMoveComp.acceleration = 0.0;
				dmgMoveComp.constantAcceleration.y = 0.0;
				this.ecsManager.addComponent(dmgEntity, dmgMoveComp);

				let collComp = new CollisionComponent();
				collComp.hasForce = false;
				this.ecsManager.addComponent(dmgEntity, collComp);

				let enemyBBComp = new BoundingBoxComponent();
				enemyBBComp.boundingBox.setMinAndMaxVectors(
					new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
					new Vec3({ x: 0.2, y: 0.5, z: 0.2 })
				);
				enemyBBComp.updateBoundingBoxBasedOnPositionComp = true;
				this.ecsManager.addComponent(dmgEntity, enemyBBComp);

				let dmgTexture: string;
				let projectileAnimComp = new AnimationComponent();

				const audioComp = e.getComponent(
					ComponentTypeEnum.AUDIO
				) as AudioComponent;

				if (weaponComp.weaponType == WeaponTypeEnum.ARROW) {
					dmgTexture = "Assets/textures/projectiles.png";
					projectileAnimComp.spriteMap.setNrOfSprites(3, 2);
					projectileAnimComp.startingTile = { x: 0, y: 0 };
					projectileAnimComp.advanceBy = { x: 1.0, y: 0.0 };
					projectileAnimComp.modAdvancement = { x: 2.0, y: 0.0 };
					projectileAnimComp.updateInterval = 0.3;
					audioComp.sounds[AudioTypeEnum.SHOOT].audioKey = "spell_cast_3";
				} else if (weaponComp.weaponType == WeaponTypeEnum.MAGIC) {
					dmgTexture = "Assets/textures/projectiles.png";
					projectileAnimComp.spriteMap.setNrOfSprites(3, 2);
					projectileAnimComp.startingTile = { x: 0, y: 1 };
					projectileAnimComp.advanceBy = { x: 1.0, y: 0.0 };
					projectileAnimComp.modAdvancement = { x: 2.0, y: 0.0 };
					projectileAnimComp.updateInterval = 0.3;
					audioComp.sounds[AudioTypeEnum.SHOOT].audioKey = "spell_cast_5";
				} else if (weaponComp.weaponType == WeaponTypeEnum.SWORD) {
					dmgTexture = "Assets/textures/normy.png";
					projectileAnimComp.spriteMap.setNrOfSprites(6, 6);
					projectileAnimComp.startingTile = { x: 0, y: 4 };
					projectileAnimComp.advanceBy = { x: 1.0, y: 0.0 };
					projectileAnimComp.modAdvancement = { x: 3.0, y: 0.0 };
					projectileAnimComp.updateInterval = 0.3;
					audioComp.sounds[AudioTypeEnum.SHOOT].audioKey = "sword_attack_4";
				}

				if (audioComp) {
					audioComp.sounds[AudioTypeEnum.SHOOT].requestPlay = true;
				}

				let phongQuad = this.rendering.getNewPhongQuad(dmgTexture, dmgTexture);

				let projectileDirection = ProjectileGraphicsDirectionEnum.DOWN;
				if (weaponComp.direction.x > 0) {
					projectileDirection = ProjectileGraphicsDirectionEnum.RIGHT;
				} else if (weaponComp.direction.x < 0) {
					projectileDirection = ProjectileGraphicsDirectionEnum.LEFT;
				} else {
					if (weaponComp.direction.z > 0) {
						projectileDirection = ProjectileGraphicsDirectionEnum.UP;
					} else if (weaponComp.direction.z < 0) {
						projectileDirection = ProjectileGraphicsDirectionEnum.DOWN;
					}
				}

				let projectileComp = new ProjectileComponent(
					projectileDirection,
					weaponComp.weaponType
				);

				this.ecsManager.addComponent(dmgEntity, projectileComp);
				+this.ecsManager.addComponent(
					dmgEntity,
					new GraphicsComponent(phongQuad)
				);
				this.ecsManager.addComponent(dmgEntity, projectileAnimComp);

				let light = this.rendering.getNewPointLight();
				light.colour.setValues(3.0, 0.0, 0.0);
				light.linear = 3.0;
				light.quadratic = 6.0;

				let lightComp = new PointLightComponent(light);
				lightComp.posOffset.setValues(0.0, 0.0, 0.1);
				this.ecsManager.addComponent(dmgEntity, lightComp);

				weaponComp.attackTimer = weaponComp.attackCooldown;
			}
			weaponComp.attackRequested = false;
		});
	}
}
