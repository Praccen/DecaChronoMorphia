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

export default class Player {
	public playerEntity: Entity;
	private ecsManager: ECSManager;
	private rendering: Rendering;

	constructor(rendering: Rendering, ecsManager: ECSManager) {
		this.rendering = rendering;
		this.ecsManager = ecsManager;
		rendering.loadTextureToStore("Assets/textures/normy.png");
		rendering.loadTextureToStore("Assets/textures/mouse.png");
	}

	init() {
		let mouseTexture = "Assets/textures/mouse.png";
		this.playerEntity = this.ecsManager.createEntity();

		let phongQuad = this.rendering.getNewPhongQuad(mouseTexture, mouseTexture);
		this.ecsManager.addComponent(
			this.playerEntity,
			new GraphicsComponent(phongQuad)
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
		if (input.keys["w"]) {
			accVec.setValues(0.0, 0.0, -1.0);
			move = true;
		}
		if (input.keys["s"]) {
			accVec.setValues(0.0, 0.0, 1.0);
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
