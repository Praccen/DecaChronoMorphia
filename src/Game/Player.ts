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
	private playerBoundingBoxMap: { [key in PlayerShapeEnum]: [Vec3, Vec3] };
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
		this.polymorphTexPath = "Assets/textures/skully.png";

		this.playerTextureMap = {
			[PlayerShapeEnum.NORMIE]: [this.normyTex, this.normySpecTex],
			[PlayerShapeEnum.TANKY]: [this.tankyTex, this.tankyTexSpec],
			[PlayerShapeEnum.WIZ]: [this.wizTex, this.wizTex],
			[PlayerShapeEnum.MOUSE]: [this.mouseTex, this.mouseTex],
		};

		this.currentPlayerShape = PlayerShapeEnum.NORMIE;

		this.boundingBoxModelMatrix = new Matrix4(null);
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
				new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
				new Vec3({ x: 0.2, y: 0.5, z: 0.2 }),
			],
			[PlayerShapeEnum.TANKY]: [
				new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
				new Vec3({ x: 0.2, y: 0.5, z: 0.2 }),
			],
			[PlayerShapeEnum.WIZ]: [
				new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
				new Vec3({ x: 0.2, y: 0.5, z: 0.2 }),
			],
			[PlayerShapeEnum.MOUSE]: [
				new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
				new Vec3({ x: 0.2, y: 0.5, z: 0.2 }),
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

		let playerComp = new PlayerComponent();
		playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
		playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
		playerComp.dodgeUpdateInterval = 0.3;
		this.ecsManager.addComponent(this.playerEntity, playerComp);

		let healthComp = new HealthComponent(200);
		this.ecsManager.addComponent(this.playerEntity, healthComp);

		this.ecsManager.addComponent(
			this.playerEntity,
			new WeaponComponent(10, true, 4, 2, WeaponTypeEnum.SWORD)
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
		let move = false;
		let ability = false;
		let lookDir: Vec3 = new Vec3({ x: 0.0, y: 0.0, z: 0.0 });

		let playerComp = <PlayerComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.PLAYER)
		);
		if (input.keys["ArrowRight"]) {
			lookDir.x = 1;
			ability = true;
		}
		if (input.keys["ArrowLeft"]) {
			lookDir.x = -1;
			ability = true;
		}
		if (input.keys["ArrowDown"]) {
			lookDir.z = 1;
			ability = true;
		}
		if (input.keys["ArrowUp"]) {
			lookDir.z = -1;
			ability = true;
		}
		if (input.keys["w"]) {
			accVec.add(new Vec3({ x: 0.0, y: 0.0, z: -1.0 }));
			move = true;
		}
		if (input.keys["s"]) {
			accVec.add(new Vec3({ x: 0.0, y: 0.0, z: 1.0 }));
			move = true;
		}
		if (input.keys["a"]) {
			accVec.add(new Vec3({ x: -1.0, y: 0.0, z: 0.0 }));
			move = true;
		}
		if (input.keys["d"]) {
			accVec.add(new Vec3({ x: 1.0, y: 0.0, z: 0.0 }));
			move = true;
		}
		if (input.keys[" "] && playerComp) {
			playerComp.startDodge = true;
		}
		if (input.keys["e"]) {
		}

		return [accVec, move, ability, lookDir];
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
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
			playerComp.dodgeStartingTile = new Vec2({ x: 0, y: 2 });
			playerComp.dodgeModAdvancement = new Vec2({ x: 6, y: 0 });
			playerComp.dodgeUpdateInterval = 0.3;
		}
	}

	doAbility(lookDir: Vec3) {
		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
			const weaponComp = this.playerEntity.getComponent(
				ComponentTypeEnum.WEAPON
			) as WeaponComponent;
			weaponComp.attackRequested = true;
			weaponComp.direction = new Vec3(lookDir).normalize();
			weaponComp.position = new Vec3({
				x: weaponComp.direction.x,
				y: 0.5,
				z: weaponComp.direction.z,
			});
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.TANKY) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.MOUSE) {
		}
	}

	doDodge() {
		const animCorp = this.playerEntity.getComponent(
			ComponentTypeEnum.ANIMATION
		) as AnimationComponent;

		if (this.currentPlayerShape == PlayerShapeEnum.NORMIE) {
		} else if (this.currentPlayerShape == PlayerShapeEnum.WIZ) {
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
		let lookDir: Vec3;
		[accVec, move, ability, lookDir] = this.updateInput();
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
			this.doAbility(lookDir);
		}

		if (playerComp && playerComp.dodgeing) {
			this.doDodge();
		} else {
			this.noDodge();
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
