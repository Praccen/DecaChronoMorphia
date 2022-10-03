import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class RoomSystem extends System {
    ecsManager;
    mapInformation;
    constructor(manager, mapInformation) {
        super([ComponentTypeEnum.PLAYER]);
        this.ecsManager = manager;
        this.mapInformation = { ...mapInformation };
    }
    update(dt) {
        this.entities.forEach((e) => {
            const playerComponent = e.getComponent(ComponentTypeEnum.PLAYER);
            this.mapInformation.rooms.forEach((room) => {
                const playerIsInRoom = room.roomPosition.compare(playerComponent.inRoom);
                //if player is in room and room is inactive, activate
                if (playerIsInRoom && !room.active) {
                    this.ecsManager.activateEntities(room.entityIds.slice());
                    // Go through the entities
                    for (const entityId of room.entityIds) {
                        let entity = this.ecsManager.getEntity(entityId);
                        if (entity) {
                            let enemyComp = entity.getComponent(ComponentTypeEnum.ENEMY);
                            if (enemyComp) {
                                // Check if it is an enemy
                                enemyComp.targetEntityId = e.id; // Set the enemies target to player
                            }
                        }
                    }
                    room.active = true;
                    // Move lights to this room
                    // TODO: Fade in?
                    // TODO: Different light colour per room?
                    for (let pEntity of this.mapInformation.pointLightEntities) {
                        let positionComp = pEntity.getComponent(ComponentTypeEnum.POSITION);
                        if (positionComp) {
                            positionComp.position.x = (room.roomPosition.x - 1) * 4.0;
                            positionComp.position.z = (room.roomPosition.y - 1) * 4.0;
                        }
                    }
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
        });
    }
}
//# sourceMappingURL=RoomSystem.js.map