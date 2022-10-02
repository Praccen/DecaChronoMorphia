import {
	MapInformation,
	RoomInformation,
} from "../../../Game/Map/MapGenerator.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import { Component, ComponentTypeEnum } from "../Components/Component.js";
import ConnectionComponent from "../Components/ConnectionComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";
export default class RoomSystem extends System {
	ecsManager: ECSManager;
	mapInformation: MapInformation;

	constructor(manager: ECSManager, mapInformation: MapInformation) {
		super([ComponentTypeEnum.CONNECTION]);
		this.ecsManager = manager;
		this.mapInformation = { ...mapInformation };
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
				let roomToDeactivate: RoomInformation;
				let roomToActivate: RoomInformation;
				let roomOne: RoomInformation;
				let roomTwo: RoomInformation;

				this.mapInformation.rooms.forEach((room) => {
					if (room.roomPosition.compare(connectionComp.roomOne)) {
						roomOne = room;
						return;
					}
					if (room.roomPosition.compare(connectionComp.roomTwo)) {
						roomTwo = room;
						return;
					}
				});

				//deactivate room player already is in
				if (playerComponent.inRoom.compare(roomOne.roomPosition)) {
					roomToDeactivate = roomOne;
					roomToActivate = roomTwo;
				} else {
					roomToDeactivate = roomTwo;
					roomToActivate = roomOne;
				}

				playerComponent.inRoom = roomToActivate.roomPosition;
				//activate entities of room
				!roomToActivate.active &&
					this.ecsManager.activateEntities(roomToActivate.entityIds);
				//deactivate entities of room
				roomToDeactivate.active &&
					this.ecsManager.deactivateEntities(roomToDeactivate.entityIds);
			}
		});
	}
}
