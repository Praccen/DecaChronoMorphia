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
			"Assets/textures/owo.png"
		);
		this.slimeTexSpec = this.rendering.getTextureFromStore(
			"Assets/textures/owo.png"
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
		playerMoveComp.constantAcceleration.y = 0.0;
		this.ecsManager.addComponent(this.playerEntity, playerMoveComp);

		let playerPosComp = new PositionComponent();
		playerPosComp.rotation.setValues(-30.0, 0.0, 0.0);
		this.ecsManager.addComponent(this.playerEntity, playerPosComp);

		let playerAnimComp = new AnimationComponent();
		playerAnimComp.spriteMap.setNrOfSprites(3, 2);
		playerAnimComp.startingTile = { x: 0, y: 0 };
		playerAnimComp.advanceBy = { x: 1.0, y: 0.0 };
		playerAnimComp.modAdvancement = { x: 2.0, y: 1.0 };
		playerAnimComp.updateInterval = 0.3;
		this.ecsManager.addComponent(this.playerEntity, playerAnimComp);
	}

	update(dt: number) {
		let accVec: Vec3 = new Vec3({ x: 0.0, y: 0.0, z: 0.0 });
		let move = false;
		let playerDirection = 0;
		this.formCooldown++;
		if (input.keys["w"]) {
			accVec.setValues(0.0, 0.0, -1.0);
			playerDirection = 1;
			move = true;
		}
		if (input.keys["s"]) {
			accVec.setValues(0.0, 0.0, 1.0);
			playerDirection = 0;
			move = true;
		}
		if (input.keys["a"]) {
			accVec.setValues(-1.0, 0.0, 0.0);
			move = true;
		}
		if (input.keys["d"]) {
			accVec.setValues(1.0, 0.0, 0.0);
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

		let playerMoveComp = <MovementComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.MOVEMENT)
		);

		// Set player acceleration
		if (move && playerMoveComp) {
			playerMoveComp.accelerationDirection = accVec;
		}

		let playerAnimComp = <AnimationComponent>(
			this.playerEntity.getComponent(ComponentTypeEnum.ANIMATION)
		);
		if (playerAnimComp && move) {
			if (playerDirection == 0) {
				playerAnimComp.startingTile = { x: 0, y: 0 };
				playerAnimComp.advanceBy = { x: 1, y: 0 };
			} else {
				playerAnimComp.startingTile = { x: 0, y: 1 };
				playerAnimComp.advanceBy = { x: 1, y: 0 };
			}
		} else if (playerAnimComp) {
			if (playerDirection == 0) {
				playerAnimComp.startingTile = { x: 2, y: 0 };
				playerAnimComp.advanceBy = { x: 0, y: 0 };
			} else {
				playerAnimComp.startingTile = { x: 2, y: 0 };
				playerAnimComp.advanceBy = { x: 0, y: 0 };
			}
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