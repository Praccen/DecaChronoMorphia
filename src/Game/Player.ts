import { input } from "../main.js";
import Entity from "../Engine/ECS/Entity.js";
import ECSManager from "../Engine/ECS/ECSManager.js";
import Rendering from "../Engine/Rendering.js";
import GraphicsComponent from "../Engine/ECS/Components/GraphicsComponent.js";
import PositionComponent from "../Engine/ECS/Components/PositionComponent.js";
import MovementComponent from "../Engine/ECS/Components/MovementComponent.js";
import AnimationComponent from "../Engine/ECS/Components/AnimationComponent.js";
import Vec3 from "../Engine/Maths/Vec3.js";
import { ComponentTypeEnum } from "../Engine/ECS/Components/Component.js";
import PhongQuad from "../Engine/Objects/PhongQuad.js";
import Texture from "../Engine/Textures/Texture.js";
import CollisionComponent from "../Engine/ECS/Components/CollisionComponent.js";
import BoundingBoxComponent from "../Engine/ECS/Components/BoundingBoxComponent.js";
import PolymorphComponent from "../Engine/ECS/Components/PolymorphComponent.js";
import { PlayerShapeEnum } from "../Engine/ECS/Components/PlayerComponent.js";
import ParticleSpawnerComponent from "../Engine/ECS/Components/ParticleSpawnerComponent.js";
import ParticleSpawner from "../Engine/Objects/ParticleSpawner.js";
import PlayerComponent from "../Engine/ECS/Components/PlayerComponent.js";
import HealthComponent from "../Engine/ECS/Components/HealthComponent.js";
import WeaponComponent, {
	WeaponTypeEnum,
} from "../Engine/ECS/Components/WeaponComponent.js";
import Vec2 from "../Engine/Maths/Vec2.js";
import AudioComponent, {
	AudioTypeEnum,
} from "../Engine/ECS/Components/AudioComponent.js";
import PointLightComponent from "../Engine/ECS/Components/PointLightComponent.js";

export default class Player {
	public playerEntity: Entity;
	private ecsManager: ECSManager;
	private rendering: Rendering;
	private playerQuad: PhongQuad;
	private playerParticleSpawner: ParticleSpawner;
	private playerTextureMap: { [key in PlayerShapeEnum]: [Texture, Texture] };
	private playerAccVecMultiplierMap: { [key in PlayerShapeEnum]: number };
	private playerBoundingBoxMap: { [key in PlayerShapeEnum]: [Vec3, Vec3] };
	private playerAttackData: {
		[key in PlayerShapeEnum]?: {
			damage: number;
			shoots: boolean;
			range: number;
			projectileSpeed: number;
			attackCooldown: number;
			weaponType: WeaponTypeEnum;
			lifetime: number;
		};
	};
	private currentPlayerShape: PlayerShapeEnum;
	private mouseTex: Texture;
	private wizTex: Texture;
	private normyTex: Texture;
	private normySpecTex: Texture;
	private tankyTex: Texture;
	private tankyTexSpec: Texture;
	private polymorphTexPath: string;
	private polymorphNumParticles: number = 200;
	private playerParticleSpawnerLifeTime: number = 0.2;
	private playerIsPolymorphing: boolean = false;
	private boundingBoxModelMatrix: Matrix4;
	private lookDir: Vec3 = new Vec3({ x: 0.0, y: 0.0, z: 0.0 });

	public isDead: boolean;

	constructor(rendering: Rendering, ecsManager: ECSManager) {
		this.rendering = rendering;
		this.ecsManager = ecsManager;
		this.mouseTex = this.rendering.getTextureFromStore(
			"Assets/textures/mouse.png"
		);
		this.normyTex = this.rendering.getTextureFromStore(
			"Assets/textures/normy.png"
		);
		this.normySpecTex = this.rendering.getTextureFromStore(
			"Assets/textures/normy_spec.png"
		);
		this.wizTex = this.rendering.getTextureFromStore(
			"Assets/textures/wizard.png"
		);
		this.tankyTex = this.rendering.getTextureFromStore(
			"Assets/textures/tanky.png"
		);
		this.tankyTexSpec = this.rendering.getTextureFromStore(
			"Assets/textures/tanky_spec.png"
		);
		this.polymorphTexPath = "Assets/textures/puff.png";

		this.playerTextureMap = {
			[PlayerShapeEnum.NORMIE]: [this.normyTex, this.normySpecTex],
			[PlayerShapeEnum.TANKY]: [this.tankyTex, this.tankyTexSpec],
			[PlayerShapeEnum.WIZ]: [this.wizTex, this.wizTex],
			[PlayerShapeEnum.MOUSE]: [this.mouseTex, this.mouseTex],
		};

		this.playerAccVecMultiplierMap = {
			[PlayerShapeEnum.NORMIE]: 1,
			[PlayerShapeEnum.TANKY]: 0.4,
			[PlayerShapeEnum.WIZ]: 0.6,
			[PlayerShapeEnum.MOUSE]: 2,
		};
		this.playerAttackData = {
			[PlayerShapeEnum.NORMIE]: {
				damage: 10,
				shoots: false,
				range: 2,
				projectileSpeed: 2,
				attackCooldown: 1,
				weaponType: WeaponTypeEnum.SWORD,
				lifetime: 1.0,
			},
			[PlayerShapeEnum.WIZ]: {
				damage: 10,
				shoots: true,
				range: 4,
				projectileSpeed: 4,
				attackCooldown: 1,
				weaponType: WeaponTypeEnum.MAGIC,
				lifetime: 5,
			},
		};

		this.currentPlayerShape = PlayerShapeEnum.NORMIE;

		this.boundingBoxModelMatrix = new Matrix4(null);

		this.isDead = false;
	}

	updatePlayerQuad() {
		this.playerQuad.diffuse = this.playerTextureMap[this.currentPlayerShape][0];
		this.playerQuad.specular =
			this.playerTextureMap[this.currentPlayerShape][1];
	}

	updateBoundingBox() {
		const playerBoundingBoxComp = this.playerEntity.getComponent(
			ComponentTypeEnum.BOUNDINGBOX
		) as BoundingBoxComponent;

		playerBoundingBoxComp.boundingBox.setMinAndMaxVectors(
			this.playerBoundingBoxMap[this.currentPlayerShape][0],
			this.playerBoundingBoxMap[this.currentPlayerShape][1]
		);
	}

	turnOnPolymorphParticleSpawner() {
		const playerPosComp = this.playerEntity.getComponent(
			ComponentTypeEnum.POSITION
		) as PositionComponent;

		this.playerParticleSpawner.setNumParticles(this.polymorphNumParticles);

		for (
			let i = 0;
			i < this.playerParticleSpawner.getNumberOfParticles();
			i++
		) {
			let rand = Math.random() * 2.0 * Math.PI;

			let pos = new Vec3();
			if (playerPosComp) {
				pos.deepAssign(playerPosComp.position);
			}

			this.playerParticleSpawner.setParticleData(
				i,
				pos,
				1.8,
				new Vec3({
					x: Math.cos(rand) * 200,
					y: 5.0 + Math.random() * 2000.0,
					z: Math.sin(rand) * 200,
				})
					.normalize()
					.multiply(8.0 + Math.random() * 3.0),
				new Vec3({ x: Math.random() * 10.0, y: -4.0, z: Math.random() * 10.0 })
			);
		}
	}

	turnOffPolymorphParticleSpawner() {
		this.playerParticleSpawner.setNumParticles(0);
	}

	init() {
		this.playerEntity = this.ecsManager.createEntity();

		this.playerQuad = this.rendering.getNewPhongQuadTex(
			this.playerTextureMap[this.currentPlayerShape][0],
			this.playerTextureMap[this.currentPlayerShape][1]
		);
		this.ecsManager.addComponent(
			this.playerEntity,
			new GraphicsComponent(this.playerQuad)
		);

		let playerMoveComp = new MovementComponent();
		this.ecsManager.addComponent(this.playerEntity, playerMoveComp);

		let playerPosComp = new PositionComponent();
		playerPosComp.rotation.setValues(-30.0, 0.0, 0.0);
		this.ecsManager.addComponent(this.playerEntity, playerPosComp);

		let playerAnimComp = new AnimationComponent();
		playerAnimComp.spriteMap.setNrOfSprites(6, 6);
		playerAnimComp.startingTile = { x: 0, y: 1 };
		playerAnimComp.advanceBy = { x: 1.0, y: 0.0 };
		playerAnimComp.modAdvancement = { x: 2.0, y: 0.0 };
		playerAnimComp.updateInterval = 0.3;

		this.ecsManager.addComponent(this.playerEntity, playerAnimComp);

		// Polymorph stuff
		let playerPolymorphComp = new PolymorphComponent();
		this.ecsManager.addComponent(this.playerEntity, playerPolymorphComp);

		this.playerParticleSpawner = this.rendering.getNewParticleSpawner(
			this.polymorphTexPath,
			0
		);

		this.playerParticleSpawner.fadePerSecond = 1.0;

		let particleSpawnerComp = new ParticleSpawnerComponent(
			this.playerParticleSpawner
		);
		particleSpawnerComp.lifeTime = this.playerParticleSpawnerLifeTime;

		this.ecsManager.addComponent(this.playerEntity, particleSpawnerComp);

		this.playerBoundingBoxMap = {
			[PlayerShapeEnum.NORMIE]: [
				new Vec3({ x: -0.45, y: -0.5, z: -0.45 }),
				new Vec3({ x: 0.45, y: 0.5, z: 0.45 }),
			],
			[PlayerShapeEnum.TANKY]: [
				new Vec3({ x: -0.45, y: -0.5, z: -0.45 }),
				new Vec3({ x: 0.45, y: 0.5, z: 0.45 }),
			],
			[PlayerShapeEnum.WIZ]: [
				new Vec3({ x: -0.45, y: -0.5, z: -0.45 }),
				new Vec3({ x: 0.45, y: 0.5, z: 0.45 }),
			],
			[PlayerShapeEnum.MOUSE]: [
				new Vec3({ x: -0.45, y: -0.5, z: -0.3 }),
				new Vec3({ x: 0.45, y: 0.5, z: 0.45 }),
			],
		};

		// Collision stuff
		let playerBoundingBoxComp = new BoundingBoxComponent();
		playerBoundingBoxComp.boundingBox.setMinAndMaxVectors(
			this.playerBoundingBoxMap[this.currentPlayerShape][0],
			this.playerBoundingBoxMap[this.currentPlayerShape][1]
		);

		playerBoundingBoxComp.updateBoundingBoxBasedOnPositionComp = true;
		this.ecsManager.addComponent(this.playerEntity, playerBoundingBoxComp);

		this.boundingBoxModelMatrix.setTranslate(
			playerPosComp.position.x,
			playerPosComp.position.y,
			playerPosComp.position.z
		);
		playerBoundingBoxComp.updateTransformMatrix(this.boundingBoxModelMatrix);
		this.ecsManager.addComponent(this.playerEntity, new CollisionComponent());

		let playerComp = new PlayerComponent(this);
		playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
		playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
		playerComp.dodgeUpdateInterval = 0.3;
		this.ecsManager.addComponent(this.playerEntity, playerComp);

		let healthComp = new HealthComponent(100);
		this.ecsManager.addComponent(this.playerEntity, healthComp);

		const attackData = this.playerAttackData[PlayerShapeEnum.NORMIE];
		this.ecsManager.addComponent(
			this.playerEntity,
			new WeaponComponent(
				attackData.damage,
				attackData.shoots,
				attackData.range,
				attackData.projectileSpeed,
				attackData.attackCooldown,
				attackData.weaponType,
				attackData.lifetime
			)
		);

		this.ecsManager.addComponent(
			this.playerEntity,
			new AudioComponent([
				{ key: AudioTypeEnum.SHOOT, audioKey: "spell_cast_3", playTime: 1.5 },
				{
					key: AudioTypeEnum.DAMAGE,
					audioKey: "damage_1",
					playTime: 2,
				},
				{ key: AudioTypeEnum.VICTORY, audioKey: "victory_1", playTime: 2 },
				{
					key: AudioTypeEnum.DEATH,
					audioKey: "defeat_1",
					playTime: 2,
				},
				{
					key: AudioTypeEnum.POLYMORPH,
					audioKey: "spell_cast_5",
					playTime: 1,
				},
			])
		);
		// TODO: Change light depending on character?
		let playerPointLight = this.rendering.getNewPointLight();
		playerPointLight.colour.setValues(0.2, 0.2, 0.2);
		playerPointLight.linear = 0.5;
		playerPointLight.quadratic = 0.5;
		let pointLightComp = new PointLightComponent(playerPointLight);
		pointLightComp.posOffset.setValues(0.0, 0.5, 0.2);
		this.ecsManager.addComponent(this.playerEntity, pointLightComp);
	}

	updateInput(): [Vec3, boolean, boolean, Vec3] {
		let accVec: Vec3 = new Vec3({ x: 0.0, y: 0.0, z: 0.0 });

		let polymorphComp = <PolymorphComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.POLYMORPH)
		);
		let accVecMultiplier = 1;
		if (polymorphComp) {
			accVecMultiplier =
				this.playerAccVecMultiplierMap[polymorphComp.currentPolymorphShape];
		}

		let move = false;
		let ability = false;

		let playerComp = <PlayerComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.PLAYER)
		);

		if (input.keys["ArrowRight"]) {
			this.lookDir.x = 1;
			ability = true;
		}
		if (input.keys["ArrowLeft"]) {
			this.lookDir.x = -1;
			ability = true;
		}
		if (input.keys["ArrowDown"]) {
			this.lookDir.z = 1;
			ability = true;
		}
		if (input.keys["ArrowUp"]) {
			this.lookDir.z = -1;
			ability = true;
		}
		if (input.keys["w"] || input.keys["W"]) {
			accVec.add(new Vec3({ x: 0.0, y: 0.0, z: -1.0 * accVecMultiplier }));
			move = true;
		}
		if (input.keys["s"] || input.keys["S"]) {
			accVec.add(new Vec3({ x: 0.0, y: 0.0, z: 1.0 * accVecMultiplier }));
			move = true;
		}
		if (input.keys["a"] || input.keys["A"]) {
			accVec.add(new Vec3({ x: -1.0 * accVecMultiplier, y: 0.0, z: 0.0 }));
			move = true;
		}
		if (input.keys["d"] || input.keys["D"]) {
			accVec.add(new Vec3({ x: 1.0 * accVecMultiplier, y: 0.0, z: 0.0 }));
			move = true;
		}
		if (input.keys[" "] && playerComp) {
			playerComp.startDodge = true;
		}
		if (input.keys["e"] || input.keys["E"]) {
		}

		return [accVec, move, ability, this.lookDir];
	}

	updatePolymorph() {
		let playerPolymorphComp = <PolymorphComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.POLYMORPH)
		);
		const audioComp = this.playerEntity.getComponent(
			ComponentTypeEnum.AUDIO
		) as AudioComponent;
		if (playerPolymorphComp) {
			this.updateFormAttributes();
			if (
				playerPolymorphComp.currentPolymorphShape != this.currentPlayerShape
			) {
				this.currentPlayerShape = playerPolymorphComp.currentPolymorphShape;
				this.updatePlayerQuad();
				this.updateBoundingBox();
			}

			if (this.playerIsPolymorphing != playerPolymorphComp.isPolymorphing) {
				if (playerPolymorphComp.isPolymorphing) {
					audioComp.sounds[AudioTypeEnum.POLYMORPH].requestPlay = true;
					this.turnOnPolymorphParticleSpawner();
				} else {
					this.turnOffPolymorphParticleSpawner();
				}
				this.playerIsPolymorphing = playerPolymorphComp.isPolymorphing;
			}
		}
	}

	updateFormAttributes() {
		const playerComp = this.playerEntity.getComponent(
			ComponentTypeEnum.PLAYER
		) as PlayerComponent;

		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
			playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
			playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
			playerComp.dodgeUpdateInterval = 0.3;
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
			playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
			playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
			playerComp.dodgeUpdateInterval = 0.3;
		} else if (this.currentPlayerShape == PlayerShapeEnum.TANKY) {
			playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
			playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
			playerComp.dodgeUpdateInterval = 0.1;
			playerComp.dodgeLength = 2.5;
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
			playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
			playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
			playerComp.dodgeUpdateInterval = 0.3;
		}
	}

	reAssignWeaponData(currWeapon: WeaponComponent, attackData: any) {
		currWeapon.damage = attackData.damage;
		currWeapon.shoots = attackData.shoots;
		currWeapon.range = attackData.range;
		currWeapon.projectileSpeed = attackData.projectileSpeed;
		currWeapon.attackCooldown = attackData.attackCooldown;
		currWeapon.weaponType = attackData.weaponType;
		currWeapon.lifetime = attackData.lifetime;
	}

	doAbility(lookDir: Vec3) {
		const weaponComp = this.playerEntity.getComponent(
			ComponentTypeEnum.WEAPON
		) as WeaponComponent;
		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
			const attackData = this.playerAttackData[PlayerShapeEnum.NORMIE];
			this.reAssignWeaponData(weaponComp, attackData);
			weaponComp.direction = new Vec3(this.lookDir).normalize();
			weaponComp.attackRequested = true;
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
			const attackData = this.playerAttackData[PlayerShapeEnum.WIZ];
			this.reAssignWeaponData(weaponComp, attackData);
			weaponComp.direction = new Vec3(this.lookDir).normalize();
			weaponComp.attackRequested = true;
		} else if (this.currentPlayerShape == PlayerShapeEnum.TANKY) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
		}
	}

	doDodge(accVec: Vec3) {
		const animCorp = this.playerEntity.getComponent(
			ComponentTypeEnum.ANIMATION
		) as AnimationComponent;
		const moveComp = this.playerEntity.getComponent(
			ComponentTypeEnum.MOVEMENT
		) as MovementComponent;

		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
			const playerComp = this.playerEntity.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;

			if (playerComp.dodgeAbiltiy) {
				playerComp.dodgeAbiltiy = false;
				let playerPosComp = <PositionComponent>(
					this.playerEntity.getComponent(ComponentTypeEnum.POSITION)
				);
				let newPosX = playerPosComp.position.x + accVec.x * 1.0;
				let newPosZ = playerPosComp.position.z + accVec.z * 1.0;
				if (newPosX > -3 && newPosX < 35) {
					if (newPosZ > -3 && newPosZ < 35) {
						playerPosComp.position.x = newPosX;
						playerPosComp.position.y = newPosZ;
					}
				}
			}
		} else if (this.currentPlayerShape == PlayerShapeEnum.TANKY) {
			if (animCorp) {
				animCorp.stopAtLast = true;
			}
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
		}
	}

	// Restore values that are not active after dodge
	noDodge() {
		const animComp = this.playerEntity.getComponent(
			ComponentTypeEnum.ANIMATION
		) as AnimationComponent;

		if (animComp) {
			animComp.stopAtLast = false;
		}
		const playerComp = this.playerEntity.getComponent(
			ComponentTypeEnum.PLAYER
		) as PlayerComponent;
		if (playerComp) {
			playerComp.dodgeAbiltiy = true;
		}

		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.TANKY) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
		}
	}

	update(dt: number) {
		let accVec: Vec3;
		let move: boolean;
		let ability: boolean;
		this.lookDir = new Vec3({ x: 0, y: 0, z: 0 });
		[accVec, move, ability, this.lookDir] = this.updateInput();
		this.updatePolymorph();

		let playerMoveComp = <MovementComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.MOVEMENT)
		);

		let playerPosComp = <PositionComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.POSITION)
		);

		const playerComp = this.playerEntity.getComponent(
			ComponentTypeEnum.PLAYER
		) as PlayerComponent;

		if (ability) {
			this.doAbility(this.lookDir);
		}

		if (playerComp && playerComp.dodgeing) {
			this.doDodge(accVec);
		} else {
			this.noDodge();
		}
		const weaponComp = this.playerEntity.getComponent(
			ComponentTypeEnum.WEAPON
		) as WeaponComponent;

		playerPosComp = <PositionComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.POSITION)
		);
		if (weaponComp) {
			weaponComp.position = new Vec3({
				x: weaponComp.direction.x * 0.5 + playerPosComp.position.x,
				y: 0.2,
				z: weaponComp.direction.z * 0.5 + playerPosComp.position.z,
			});
		}

		// Set player acceleration
		if (move && playerMoveComp) {
			playerMoveComp.accelerationDirection = accVec;
		}

		// Update camera
		// TODO: Fade over / sweeping transition?
		let roomTileX = 1;
		let roomTileY = 1;

		if (playerPosComp) {
			roomTileX = Math.floor((playerPosComp.position.x + 4.0) / 8.0) * 2 + 1;
			roomTileY = Math.floor((playerPosComp.position.z + 4.0) / 8.0) * 2 + 1;
		}

		if (playerComp) {
			playerComp.inRoom.x = roomTileX;
			playerComp.inRoom.y = roomTileY;

			let camDirection = new Vec3({ x: 0.0, y: -3.0, z: -1.5 });
			let camOffset = new Vec3(camDirection).multiply(-1.4);
			camOffset.z += 1.0;
			let camPos = new Vec3({
				x: (playerComp.inRoom.x - 1) * 4.0,
				y: 0.0,
				z: (playerComp.inRoom.y - 1) * 4.0,
			}).add(camOffset);
			this.rendering.camera.setPosition(camPos.x, camPos.y, camPos.z);
			this.rendering.camera.setDir(
				camDirection.x,
				camDirection.y,
				camDirection.z
			);
		}

		// Update bounding box
		if (playerPosComp) {
			this.boundingBoxModelMatrix.setTranslate(
				playerPosComp.position.x,
				playerPosComp.position.y,
				playerPosComp.position.z
			);
			let bbComp = this.playerEntity.getComponent(
				ComponentTypeEnum.BOUNDINGBOX
			) as BoundingBoxComponent;
			bbComp.boundingBox.setUpdateNeeded();
		}
	}
}
