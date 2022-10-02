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

			this.mapInformation.rooms.forEach((room) => {
				const playerIsInRoom = Array.from(
					collisionComp.currentCollisionEntities
				).some((collisionEntity) => collisionEntity.id === room.floorId);

				//if player is in room and room is inactive, activate
				if (playerIsInRoom && !room.active) {
					this.ecsManager.activateEntities(room.entityIds.slice());
					room.active = true;
					playerComponent.inRoom = room.roomPosition;
					return;
				}

				//if player is not in room but room is active, deactivate
				if (!playerIsInRoom && room.active) {
					console.log("room", room);
					this.ecsManager.deactivateEntities(room.entityIds.slice());
					room.active = false;
					return;
				}
			});
		});
	}
}
