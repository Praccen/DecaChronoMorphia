import BoundingBoxComponent from "../../Engine/ECS/Components/BoundingBoxComponent.js";
import CollisionComponent from "../../Engine/ECS/Components/CollisionComponent.js";
import GraphicsComponent from "../../Engine/ECS/Components/GraphicsComponent.js";
import MeshCollisionComponent from "../../Engine/ECS/Components/MeshCollisionComponent.js";
import PositionComponent from "../../Engine/ECS/Components/PositionComponent.js";
import ECSManager from "../../Engine/ECS/ECSManager.js";
import Vec3 from "../../Engine/Maths/Vec3.js";
import Rendering from "../../Engine/Rendering.js";
import {LabyrinthGenerator} from "./LabyrinthGenerator.js";

export module MapGenerator {

    export function GenerateMap(xSize: number, ySize: number, ecsManager: ECSManager, rendering: Rendering) {
        let labyrinth = LabyrinthGenerator.getLabyrinth(xSize, ySize);

        for (let y = 1; y < labyrinth.length - 1; y += 2) {
            for (let x = 1; x < labyrinth[y].length - 1; x += 2) {
                if (labyrinth[x][y] == 0) {
                    createRoom(labyrinth, x, y, ecsManager, rendering);
                }
            }
        }
    }

    async function createRoom(map: Array<Array<number>>, roomTileX: number, roomTileY: number, ecsManager: ECSManager, rendering: Rendering) {
        // Find out how the room should look
        let wallsTowards = [
            map[roomTileX][roomTileY - 1] > 0? true: false,
            map[roomTileX][roomTileY + 1] > 0? true: false,
            map[roomTileX - 1][roomTileY] > 0? true: false,
            map[roomTileX + 1][roomTileY] > 0? true: false,
        ];

        const floorTexturePath = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/371b6fdf-69a3-4fa2-9ff0-bd04d50f4b98/de8synv-6aad06ab-ed16-47fd-8898-d21028c571c4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3MWI2ZmRmLTY5YTMtNGZhMi05ZmYwLWJkMDRkNTBmNGI5OFwvZGU4c3ludi02YWFkMDZhYi1lZDE2LTQ3ZmQtODg5OC1kMjEwMjhjNTcxYzQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.wa-oSVpeXEpWqfc_bexczFs33hDFvEGGAQD969J7Ugw";

        let roomCenter = new Vec3({x: (roomTileX - 1) * 0.5, y: 0.0, z: (roomTileY - 1) * 0.5}).multiply(8.0);

        createFloorEntity(new Vec3(roomCenter), floorTexturePath, ecsManager, rendering);

        await createWallEntities(new Vec3(roomCenter), ecsManager, rendering, wallsTowards);
    }

    function createFloorEntity(position: Vec3, texturePath: string, ecsManager: ECSManager, rendering: Rendering) {
		let entity = ecsManager.createEntity();
		let phongQuad = rendering.getNewPhongQuad(texturePath, texturePath);
		phongQuad.textureMatrix.setScale(8.0, 8.0, 1.0);
		ecsManager.addComponent(entity, new GraphicsComponent(phongQuad));
		let posComp = new PositionComponent(position.subtract(new Vec3({x: 0.0, y: 0.5, z: 0.0})));
		posComp.rotation.setValues(-90.0, 0.0, 0.0);
		posComp.scale.setValues(8.0, 8.0, 1.0);
		ecsManager.addComponent(entity, posComp);

        // Collision stuff
        let floorBoundingBoxComp = new BoundingBoxComponent();
        floorBoundingBoxComp.updateBoundingBoxBasedOnPositionComp = true;
        floorBoundingBoxComp.boundingBox.setMinAndMaxVectors(new Vec3({x: -4.0, y: -5.0, z: -4.0}), new Vec3({x: 4.0, y: 0.0, z: 4.0}));
        ecsManager.addComponent(entity, floorBoundingBoxComp);
        let collComp = new CollisionComponent();
        collComp.isStatic = true;
        ecsManager.addComponent(entity, collComp);
	}

    async function createWallEntities(position: Vec3, ecsManager: ECSManager, rendering: Rendering, wallsTowards: boolean[]) {
        for (let i = 0; i < wallsTowards.length; i++) {
            let objPath = "Assets/objs/WallWithOpening.obj";
            if (wallsTowards[i]) {
                objPath = "Assets/objs/WallWithoutOpening.obj";
            }

            let entity = ecsManager.createEntity();
            const texturePath = "Assets/textures/voxelPalette.png";
            let wallMesh = await rendering.getNewMesh(objPath, texturePath, texturePath);
            ecsManager.addComponent(entity, new GraphicsComponent(wallMesh));
            let posComp = new PositionComponent(new Vec3(position).subtract(new Vec3({x: 0.0, y: 0.5, z: 0.0})));

            if (i == 0) {
                posComp.position.add(new Vec3({x: 0.0, y: 0.0, z: -4.0}));
            }
            else if (i == 1) {
                posComp.position.add(new Vec3({x: 0.0, y: 0.0, z: 4.0}));
            }
            else if (i == 2) {
                posComp.position.add(new Vec3({x: -4.0, y: 0.0, z: 0.0}));
                posComp.rotation.setValues(0.0, 90.0);
            }
            else if (i == 3) {
                posComp.position.add(new Vec3({x: 4.0, y: 0.0, z: 0.0}));
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