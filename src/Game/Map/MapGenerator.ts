import AnimationComponent from "../../Engine/ECS/Components/AnimationComponent.js";
import BoundingBoxComponent from "../../Engine/ECS/Components/BoundingBoxComponent.js";
import CollisionComponent from "../../Engine/ECS/Components/CollisionComponent.js";
import ConnectionComponent from "../../Engine/ECS/Components/ConnectionComponent.js";
import EnemyComponent from "../../Engine/ECS/Components/EnemyComponent.js";
import GraphicsComponent from "../../Engine/ECS/Components/GraphicsComponent.js";
import MeshCollisionComponent from "../../Engine/ECS/Components/MeshCollisionComponent.js";
import MovementComponent from "../../Engine/ECS/Components/MovementComponent.js";
import PositionComponent from "../../Engine/ECS/Components/PositionComponent.js";
import WeaponComponent from "../../Engine/ECS/Components/WeaponComponent.js";
import ECSManager from "../../Engine/ECS/ECSManager.js";
import Vec2 from "../../Engine/Maths/Vec2.js";
import Vec3 from "../../Engine/Maths/Vec3.js";
import Rendering from "../../Engine/Rendering.js";
import { LabyrinthGenerator } from "./LabyrinthGenerator.js";

export interface RoomInformation {
	roomPosition: Vec2;
	active: boolean;
	entityIds: number[];
}
export interface MapInformation {
	rooms: RoomInformation[];
}

export module MapGenerator {
	export async function GenerateMap(
		xSize: number,
		ySize: number,
		ecsManager: ECSManager,
		rendering: Rendering
	) {
		let labyrinth = LabyrinthGenerator.getLabyrinth(xSize, ySize);
		const mapInformation: MapInformation = { rooms: [] };

		for (let y = 1; y < labyrinth.length - 1; y += 2) {
			for (let x = 1; x < labyrinth[y].length - 1; x += 2) {
				if (labyrinth[x][y] == 0) {
					const roomInformation = await createRoom(
						labyrinth,
						x,
						y,
						ecsManager,
						rendering
					);
					mapInformation.rooms.push(roomInformation);
				}
			}
		}
		return mapInformation;
	}

	async function createRoom(
		map: Array<Array<number>>,
		roomTileX: number,
		roomTileY: number,
		ecsManager: ECSManager,
		rendering: Rendering
	) {
		const roomPosition = new Vec2({ x: roomTileX, y: roomTileY });
		const isStartingRoom = roomTileX === 1 && roomTileY === 1;
		const roomInformation: RoomInformation = {
			roomPosition: roomPosition,
			active: isStartingRoom,
			entityIds: [],
		};

		// Find out how the room should look
		let wallsTowards = [
			map[roomTileX][roomTileY - 1] > 0 ? true : false,
			map[roomTileX][roomTileY + 1] > 0 ? true : false,
			map[roomTileX - 1][roomTileY] > 0 ? true : false,
			map[roomTileX + 1][roomTileY] > 0 ? true : false,
		];
		const floorTexturePath =
			"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/371b6fdf-69a3-4fa2-9ff0-bd04d50f4b98/de8synv-6aad06ab-ed16-47fd-8898-d21028c571c4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3MWI2ZmRmLTY5YTMtNGZhMi05ZmYwLWJkMDRkNTBmNGI5OFwvZGU4c3ludi02YWFkMDZhYi1lZDE2LTQ3ZmQtODg5OC1kMjEwMjhjNTcxYzQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.wa-oSVpeXEpWqfc_bexczFs33hDFvEGGAQD969J7Ugw";

		let roomCenter = new Vec3({
			x: (roomTileX - 1) * 0.5,
			y: 0.0,
			z: (roomTileY - 1) * 0.5,
		}).multiply(8.0);

		createFloorEntity(
			new Vec3(roomCenter),
			floorTexturePath,
			ecsManager,
			rendering
		);

		const enemyId = createEnemyEntity(
			new Vec3(roomCenter),
			isStartingRoom,
			"Assets/textures/slime.png",
			ecsManager,
			rendering
		);

		createDoorEntity(
			new Vec3(roomCenter),
			ecsManager,
			rendering,
			wallsTowards,
			new Vec2({ x: roomTileX, y: roomTileY })
		);

		await createWallEntities(
			new Vec3(roomCenter),
			ecsManager,
			rendering,
			wallsTowards
		);

		roomInformation.entityIds.push(enemyId);
		return roomInformation;
	}

	function createEnemyEntity(
		position: Vec3,
		isActive: boolean,
		texturePath: string,
		ecsManager: ECSManager,
		rendering: Rendering
	) {
		let enemyTexture = texturePath;
		const enemyEntity = ecsManager.createEntity();
		enemyEntity.isActive = isActive;

		let phongQuad = rendering.getNewPhongQuad(enemyTexture, enemyTexture);
		ecsManager.addComponent(enemyEntity, new GraphicsComponent(phongQuad));

		let enemyMoveComp = new MovementComponent();
		ecsManager.addComponent(enemyEntity, enemyMoveComp);

		let enemyPosComp = new PositionComponent(position);
		enemyPosComp.rotation.setValues(-30.0, 0.0, 0.0);
		ecsManager.addComponent(enemyEntity, enemyPosComp);

		let enemyAnimComp = new AnimationComponent();
		enemyAnimComp.spriteMap.setNrOfSprites(3, 2);
		enemyAnimComp.startingTile = { x: 0, y: 0 };
		enemyAnimComp.advanceBy = { x: 1.0, y: 0.0 };
		enemyAnimComp.modAdvancement = { x: 2.0, y: 1.0 };
		enemyAnimComp.updateInterval = 0.3;
		ecsManager.addComponent(enemyEntity, enemyAnimComp);

		ecsManager.addComponent(enemyEntity, new EnemyComponent());
		ecsManager.addComponent(enemyEntity, new WeaponComponent(10, true, 4, 2));

		// Collision for enemy
		let enemyBBComp = new BoundingBoxComponent();
		enemyBBComp.boundingBox.setMinAndMaxVectors(
			new Vec3({ x: -0.2, y: -0.5, z: -0.2 }),
			new Vec3({ x: 0.2, y: 0.5, z: 0.2 })
		);
		enemyBBComp.updateBoundingBoxBasedOnPositionComp = true;
		ecsManager.addComponent(enemyEntity, enemyBBComp);
		ecsManager.addComponent(enemyEntity, new CollisionComponent());

		return enemyEntity.id;
	}

	function createFloorEntity(
		position: Vec3,
		texturePath: string,
		ecsManager: ECSManager,
		rendering: Rendering
	) {
		let entity = ecsManager.createEntity();
		let phongQuad = rendering.getNewPhongQuad(texturePath, texturePath);
		phongQuad.textureMatrix.setScale(8.0, 8.0, 1.0);
		ecsManager.addComponent(entity, new GraphicsComponent(phongQuad));
		let posComp = new PositionComponent(
			position.subtract(new Vec3({ x: 0.0, y: 0.5, z: 0.0 }))
		);
		posComp.rotation.setValues(-90.0, 0.0, 0.0);
		posComp.scale.setValues(8.0, 8.0, 1.0);
		ecsManager.addComponent(entity, posComp);

		// Collision stuff
		let floorBoundingBoxComp = new BoundingBoxComponent();
		floorBoundingBoxComp.updateBoundingBoxBasedOnPositionComp = true;
		floorBoundingBoxComp.boundingBox.setMinAndMaxVectors(
			new Vec3({ x: -4.0, y: -5.0, z: -4.0 }),
			new Vec3({ x: 4.0, y: 0.0, z: 4.0 })
		);
		ecsManager.addComponent(entity, floorBoundingBoxComp);
		let collComp = new CollisionComponent();
		collComp.isStatic = true;
		ecsManager.addComponent(entity, collComp);
	}

	async function createDoorEntity(
		position: Vec3,
		ecsManager: ECSManager,
		rendering: Rendering,
		wallsTowards: boolean[],
		currentRoom: Vec2
	) {
		for (let i = 0; i < wallsTowards.length; i++) {
			if (wallsTowards[i]) {
				continue;
			}
			const objPath = "Assets/objs/cube.obj";
			const doorTexture =
				"https://as2.ftcdn.net/v2/jpg/01/99/14/99/1000_F_199149981_RG8gciij11WKAQ5nKi35Xx0ovesLCRaU.jpg";

			let doorEntity = ecsManager.createEntity();
			let doorMesh = await rendering.getNewMesh(
				objPath,
				doorTexture,
				doorTexture
			);
			ecsManager.addComponent(doorEntity, new GraphicsComponent(doorMesh));
			let posComp = new PositionComponent(
				new Vec3(position).subtract(new Vec3({ x: 0.0, y: 0.5, z: 0.0 }))
			);

			const nextRoom = new Vec2(currentRoom);
			if (i == 0) {
				posComp.position.add(new Vec3({ x: 0.0, y: 0.0, z: -4.0 }));
				nextRoom.y -= 2;
			} else if (i == 1) {
				posComp.position.add(new Vec3({ x: 0.0, y: 0.0, z: 4.0 }));
				nextRoom.y += 2;
			} else if (i == 2) {
				posComp.position.add(new Vec3({ x: -4.0, y: 0.0, z: 0.0 }));
				posComp.rotation.setValues(0.0, 90.0);
				nextRoom.x -= 2;
			} else if (i == 3) {
				posComp.position.add(new Vec3({ x: 4.0, y: 0.0, z: 0.0 }));
				posComp.rotation.setValues(0.0, -90.0);
				nextRoom.x += 2;
			}

			posComp.scale.setValues(0.7, 1.0, 0.07);
			ecsManager.addComponent(doorEntity, posComp);

			// Collision stuff
			let boxBoundingBoxComp = new BoundingBoxComponent();
			boxBoundingBoxComp.setup(doorMesh);
			boxBoundingBoxComp.updateTransformMatrix(doorMesh.modelMatrix);
			ecsManager.addComponent(doorEntity, boxBoundingBoxComp);
			let collComp = new CollisionComponent();
			collComp.isStatic = true;
			ecsManager.addComponent(doorEntity, collComp);

			let meshCollComp = new MeshCollisionComponent();
			meshCollComp.setup(doorMesh);
			meshCollComp.updateTransformMatrix(doorMesh.modelMatrix);
			ecsManager.addComponent(doorEntity, meshCollComp);

			ecsManager.addComponent(
				doorEntity,
				new ConnectionComponent(currentRoom, nextRoom)
			);
		}
	}

	async function createWallEntities(
		position: Vec3,
		ecsManager: ECSManager,
		rendering: Rendering,
		wallsTowards: boolean[]
	) {
		for (let i = 0; i < wallsTowards.length; i++) {
			let objPath = "Assets/objs/WallWithOpening.obj";
			if (wallsTowards[i]) {
				objPath = "Assets/objs/WallWithoutOpening.obj";
			}

			let entity = ecsManager.createEntity();
			const texturePath = "Assets/textures/voxelPalette.png";
			let wallMesh = await rendering.getNewMesh(
				objPath,
				texturePath,
				texturePath
			);
			ecsManager.addComponent(entity, new GraphicsComponent(wallMesh));
			let posComp = new PositionComponent(
				new Vec3(position).subtract(new Vec3({ x: 0.0, y: 0.5, z: 0.0 }))
			);

			if (i == 0) {
				posComp.position.add(new Vec3({ x: 0.0, y: 0.0, z: -4.0 }));
			} else if (i == 1) {
				posComp.position.add(new Vec3({ x: 0.0, y: 0.0, z: 4.0 }));
			} else if (i == 2) {
				posComp.position.add(new Vec3({ x: -4.0, y: 0.0, z: 0.0 }));
				posComp.rotation.setValues(0.0, 90.0);
			} else if (i == 3) {
				posComp.position.add(new Vec3({ x: 4.0, y: 0.0, z: 0.0 }));
				posComp.rotation.setValues(0.0, -90.0);
			}

			posComp.scale.setValues(1.25, 0.5, 0.5);
			ecsManager.addComponent(entity, posComp);

			// Collision stuff
			let boxBoundingBoxComp = new BoundingBoxComponent();
			boxBoundingBoxComp.setup(wallMesh);
			boxBoundingBoxComp.updateTransformMatrix(wallMesh.modelMatrix);
			ecsManager.addComponent(entity, boxBoundingBoxComp);
			let collComp = new CollisionComponent();
			collComp.isStatic = true;
			ecsManager.addComponent(entity, collComp);

			let meshCollComp = new MeshCollisionComponent();
			meshCollComp.setup(wallMesh);
			meshCollComp.updateTransformMatrix(wallMesh.modelMatrix);
			ecsManager.addComponent(entity, meshCollComp);
		}
	}
}
