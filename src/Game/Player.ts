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
import PlayerComponent from "../Engine/ECS/Components/PlayerComponent.js";
import HealthComponent from "../Engine/ECS/Components/HealthComponent.js";

export default class Player {
	public playerEntity: Entity;
	private ecsManager: ECSManager;
	private rendering: Rendering;
	private playerQuad: PhongQuad;
	private mouseTex: Texture;
	private wizTex: Texture;
	private normyTex: Texture;
	private normySpecTex: Texture;
	private tankyTex: Texture;
	private tankyTexSpec: Texture;
	private slimeTex: Texture;
	private slimeTexSpec: Texture;
	private nextForm: number;
	private formCooldown: number = 50;

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
		this.slimeTex = this.rendering.getTextureFromStore(
			"Assets/textures/skully.png"
		);
		this.slimeTexSpec = this.rendering.getTextureFromStore(
			"Assets/textures/skully.png"
		);
	}

	init() {
		this.playerEntity = this.ecsManager.createEntity();

		this.playerQuad = this.rendering.getNewPhongQuadTex(
			this.normyTex,
			this.normySpecTex
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

		// Collision stuff
		let playerBoundingBoxComp = new BoundingBoxComponent();
		playerBoundingBoxComp.boundingBox.setMinAndMaxVectors(
			new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
			new Vec3({ x: 0.2, y: 0.5, z: 0.2 })
		);
		playerBoundingBoxComp.updateBoundingBoxBasedOnPositionComp = true;
		this.ecsManager.addComponent(this.playerEntity, playerBoundingBoxComp);
		this.ecsManager.addComponent(this.playerEntity, new CollisionComponent());

		let playerComp = new PlayerComponent();
		this.ecsManager.addComponent(this.playerEntity, playerComp);

		let healthComp = new HealthComponent(20);
		this.ecsManager.addComponent(this.playerEntity, healthComp);
	}

	update(dt: number) {
		let accVec: Vec3 = new Vec3({ x: 0.0, y: 0.0, z: 0.0 });
		let move = false;
		this.formCooldown++;
		let playerComp = <PlayerComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.PLAYER)
		);

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
		if (input.keys["f"]) {
			if (this.formCooldown > 50) {
				if (this.nextForm == 0) {
					this.playerQuad.diffuse = this.normyTex;
					this.playerQuad.specular = this.normySpecTex;
					this.nextForm = 1;
				} else if (this.nextForm == 1) {
					this.playerQuad.diffuse = this.wizTex;
					this.playerQuad.specular = this.wizTex;
					this.nextForm = 2;
				} else if (this.nextForm == 2) {
					this.playerQuad.diffuse = this.mouseTex;
					this.playerQuad.specular = this.mouseTex;
					this.nextForm = 3;
				} else {
					this.playerQuad.diffuse = this.tankyTex;
					this.playerQuad.specular = this.tankyTexSpec;
					this.nextForm = 0;
				}
				this.formCooldown = 0;
			}
		}
		if (input.keys[" "] && playerComp) {
			playerComp.startDodge = true;
		}

		let playerMoveComp = <MovementComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.MOVEMENT)
		);

		// Set player acceleration
		if (move && playerMoveComp) {
			playerMoveComp.accelerationDirection = accVec;
		}

		let playerPosComp = <PositionComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.POSITION)
		);
		// Update camera
		if (playerPosComp) {
			let camOffset = new Vec3({ x: 0.0, y: 3.0, z: 2.0 });
			let camPos = new Vec3(playerPosComp.position).add(camOffset);
			this.rendering.camera.setPosition(camPos.x, camPos.y, camPos.z);
			this.rendering.camera.setDir(-camOffset.x, -camOffset.y, -camOffset.z);
		}
	}
}
