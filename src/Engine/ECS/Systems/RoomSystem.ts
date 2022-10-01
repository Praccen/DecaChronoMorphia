import CollisionComponent from "../Components/CollisionComponent.js";
import { Component, ComponentTypeEnum } from "../Components/Component.js";
import ConnectionComponent from "../Components/ConnectionComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

interface Room {
	roomId: number;
	//if active player is in room.
	//if set to inactive, also ina
	active: boolean;

	hasBeenRevealed: boolean;
	//what monsters should be created when this room is revealed
	monsters: [{ type; position }];

	//powerups of type 'type' should be created here

	//transform area of type 'type' should be created here

	// wall-entities data

	//floor-entity data

	//door-entity data

	//list of all entities created from the above data
	entityIds: number[];
}

export default class RoomSystem extends System {
	rooms: Room[];
	ecsManager: ECSManager;

	constructor(manager) {
		super([ComponentTypeEnum.CONNECTION]);
		this.ecsManager = manager;
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				//this entity is not active, return to skip to next iteration
				return;
			}
			const connectionComp = e.getComponent(
				ComponentTypeEnum.CONNECTION
			) as ConnectionComponent;
			const collisionComp = e.getComponent(
				ComponentTypeEnum.COLLISION
			) as CollisionComponent;

			const playerEntity = Array.from(
				collisionComp.currentCollisionEntities
			).find((collisionEntity) => {
				if (collisionEntity.hasComponent(ComponentTypeEnum.PLAYER)) {
					return collisionEntity;
				}
			});

			//Player has entered connection
			if (playerEntity) {
				const playerComponent = playerEntity.getComponent(
					ComponentTypeEnum.PLAYER
				) as PlayerComponent;

				let roomToDeactivate: Room;
				let roomToActivate: Room;
				this.rooms.forEach((room) => {
					if (room.roomId === connectionComp.existsInRoomId) {
						roomToDeactivate = room;
					} else if (room.roomId === connectionComp.leadsToRoomId) {
						roomToActivate = room;
					}
				});

				//TODO a player falls into endless loop of activating one room,
				//entring it and activating last room through new room's connection

				playerComponent.inRoomId = roomToActivate.roomId;

				//activate entities of room
				this.ecsManager.activateEntities(roomToActivate.entityIds);

				//deactivate entities of room
				this.ecsManager.deactivateEntities(roomToDeactivate.entityIds);
			}
		});
	}
}
