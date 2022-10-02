import { MapInformation } from "../../../Game/Map/MapGenerator.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";
export default class RoomSystem extends System {
	ecsManager: ECSManager;
	mapInformation: MapInformation;

	constructor(manager: ECSManager, mapInformation: MapInformation) {
		super([ComponentTypeEnum.PLAYER]);
		this.ecsManager = manager;
		this.mapInformation = { ...mapInformation };
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			const collisionComp = e.getComponent(
				ComponentTypeEnum.COLLISION
			) as CollisionComponent;
			const playerComponent = e.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;

			if (collisionComp) {
				this.mapInformation.rooms.forEach((room) => {
					const playerIsInRoom = Array.from(
						collisionComp.currentCollisionEntities
					).some((collisionEntity) => collisionEntity.id === room.floorId);
	
					//if player is in room and room is inactive, activate
					if (playerIsInRoom && !room.active) {
						this.ecsManager.activateEntities(room.entityIds.slice());
	
						// Go through the entities
						for (const entityId of room.entityIds) {
							let entity = this.ecsManager.getEntity(entityId);
							if (entity) {
								let enemyComp = entity.getComponent(ComponentTypeEnum.ENEMY) as EnemyComponent;
								if (enemyComp) { // Check if it is an enemy
									enemyComp.targetEntityId = e.id; // Set the enemies target to player
								}
							}
						}
	
						room.active = true;
						playerComponent.inRoom = room.roomPosition;
						return;
					}
	
					//if player is not in room but room is active, deactivate
					if (!playerIsInRoom && room.active) {
						this.ecsManager.deactivateEntities(room.entityIds.slice());
						room.active = false;
						// console.log("Deactivating room");
						return;
					}
				});
			}
		});
	}
}
