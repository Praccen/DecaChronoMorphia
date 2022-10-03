import CollisionSystem from "./Systems/CollisionSystem.js";
import MovementSystem from "./Systems/MovementSystem.js";
import GraphicsSystem from "./Systems/GraphicsSystem.js";
import AnimationSystem from "./Systems/AnimationSystem.js";
import ParticleSpawnerSystem from "./Systems/ParticleSpawnerSystem.js";
import Entity from "./Entity.js";
import EnemySystem from "./Systems/EnemySystem.js";
import RoomSystem from "./Systems/RoomSystem.js";
import SpriteDirectionSystem from "./Systems/SpriteDirectionSystem.js";
import PolymorphSystem from "./Systems/PolymorphSystem.js";
import DamageSystem from "./Systems/DamageSystem.js";
import GraphicsComponent from "./Components/GraphicsComponent.js";
import PlayerSystem from "./Systems/PlayerSystem.js";
import HealthSystem from "./Systems/HealthSystem.js";
import WeaponSystem from "./Systems/WeaponSystem.js";
import AudioSystem from "./Systems/AudioSystem.js";
import DoorSystem from "./Systems/DoorSystem.js";
export default class ECSManager {
    systems;
    entityCounter;
    entities;
    entityAdditionQueue;
    entityDeletionQueue;
    componentAdditionQueue;
    componentRemovalQueue;
    activateEntitiesQueue;
    deactivateEntitiesQueue;
    camera;
    rendering;
    constructor(rendering) {
        this.camera = rendering.camera;
        this.rendering = rendering;
        this.systems = new Map();
        this.entityCounter = 0;
        this.entities = new Array();
        this.entityAdditionQueue = new Array();
        this.entityDeletionQueue = new Array();
        this.componentAdditionQueue = new Array();
        this.componentRemovalQueue = new Array();
        this.activateEntitiesQueue = [];
        this.deactivateEntitiesQueue = [];
    }
    initializeSystems(mapInformation, audio) {
        this.systems.set("COLLISION", new CollisionSystem());
        this.systems.set("DOOR", new DoorSystem());
        this.systems.set("MOVEMENT", new MovementSystem());
        this.systems.set("GRAPHICS", new GraphicsSystem());
        this.systems.set("PARTICLE", new ParticleSpawnerSystem());
        this.systems.set("ANIMATION", new AnimationSystem());
        this.systems.set("ENEMY", new EnemySystem(this, this.rendering));
        this.systems.set("ROOM", new RoomSystem(this, mapInformation));
        this.systems.set("SPRITE_DIRECTION", new SpriteDirectionSystem());
        this.systems.set("POLYMORPHISM", new PolymorphSystem());
        this.systems.set("DAMAGE", new DamageSystem(this));
        this.systems.set("PLAYER", new PlayerSystem());
        this.systems.set("HEALTH", new HealthSystem(this));
        this.systems.set("WEAPON", new WeaponSystem(this, this.rendering));
        this.systems.set("AUDIO", new AudioSystem(audio));
    }
    update(dt) {
        // Add new entities
        this.addQueuedEntities();
        // For all entities, remove/add components
        // Remove/add entities from systems
        this.addQueuedComponents();
        this.removeComponents();
        this.removeEntitiesMarkedForDeletion();
        // this.updateEntityActivation();
        this.systems.get("ANIMATION").update(dt);
        this.systems.get("POLYMORPHISM").update(dt);
        this.systems.get("SPRITE_DIRECTION").update(dt);
        this.systems.get("MOVEMENT").update(dt);
        this.systems.get("COLLISION").update(dt);
        this.systems.get("DOOR").update(dt);
        this.systems.get("GRAPHICS").update(dt);
        this.systems.get("ENEMY").update(dt);
        this.systems.get("ROOM").update(dt);
        this.systems.get("DAMAGE").update(dt);
        this.systems.get("PLAYER").update(dt);
        this.systems.get("HEALTH").update(dt);
        this.systems.get("WEAPON").update(dt);
        this.systems.get("AUDIO").update(dt);
    }
    updateRenderingSystems(dt) {
        this.systems.get("PARTICLE").update(dt);
    }
    createEntity() {
        const length = this.entityAdditionQueue.push(new Entity(this.entityCounter++));
        return this.entityAdditionQueue[length - 1];
    }
    addComponent(entity, component) {
        this.componentAdditionQueue.push({ entity, component });
    }
    removeEntity(entityID) {
        this.entityDeletionQueue.push(entityID);
    }
    removeComponent(entity, componentType) {
        this.componentRemovalQueue.push({ entity, componentType });
    }
    getEntity(entityID) {
        for (const entity of this.entities) {
            if (entity.id == entityID) {
                return entity;
            }
        }
        return null;
    }
    getSystem(type) {
        return this.systems.get(type);
    }
    activateEntities(entityIds) {
        for (const entityId of entityIds) {
            let entity = this.getEntity(entityId);
            if (entity) {
                entity.isActive = true;
            }
        }
        // this.activateEntitiesQueue = entityIds;
    }
    deactivateEntities(entityIds) {
        for (const entityId of entityIds) {
            let entity = this.getEntity(entityId);
            if (entity) {
                entity.isActive = false;
            }
        }
        // this.deactivateEntitiesQueue = entityIds;
    }
    // Private
    addQueuedEntities() {
        for (const newEntity of this.entityAdditionQueue) {
            // Add to manager
            const length = this.entities.push(newEntity);
            // Add to systems
            for (let system of this.systems) {
                system[1].addEntity(this.entities[length - 1]);
            }
        }
        // Empty queue
        this.entityAdditionQueue.length = 0;
    }
    addQueuedComponents() {
        for (const compEntityPair of this.componentAdditionQueue) {
            // If enitity does not already have component, proceed
            if (compEntityPair.entity.addComponent(compEntityPair.component)) {
                for (let system of this.systems) {
                    // If entity is not already belonging to the system, try and add it
                    if (!system[1].containsEntity(compEntityPair.entity.id)) {
                        system[1].addEntity(compEntityPair.entity);
                    }
                }
            }
        }
        // Empty queue
        this.componentAdditionQueue.length = 0;
    }
    removeEntitiesMarkedForDeletion() {
        for (let i of this.entityDeletionQueue) {
            // Delete in systems
            for (let system of this.systems) {
                system[1].removeEntity(i);
            }
            // Delete in manager
            let index = this.entities.findIndex((e) => e.id == this.entityDeletionQueue[i]);
            if (index != -1) {
                this.entities.splice(index, 1);
            }
        }
        // Empty queue
        this.entityDeletionQueue.length = 0;
    }
    removeComponents() {
        for (const compEntityPair of this.componentRemovalQueue) {
            // Remove component from entity
            const removedComponent = compEntityPair.entity.removeComponent(compEntityPair.componentType);
            if (removedComponent && removedComponent instanceof GraphicsComponent) {
                this.rendering.deleteGraphicsObject(removedComponent.object);
            }
            // Remove entity from system if it no longer lives up to the requirements of being in the system
            for (let system of this.systems) {
                system[1].removeFaultyEntity(compEntityPair.entity.id);
            }
        }
        // Empty queue
        this.componentRemovalQueue.length = 0;
    }
    updateEntityActivation() {
        this.entities.forEach((entity) => {
            if (this.deactivateEntitiesQueue.some((deactivateEntity) => entity.id === deactivateEntity)) {
                entity.isActive = false;
            }
            else if (this.activateEntitiesQueue.some((activateEntity) => entity.id === activateEntity)) {
                entity.isActive = true;
            }
        });
        //empty queue
        this.activateEntitiesQueue.length = 0;
        this.deactivateEntitiesQueue.length = 0;
    }
}
//# sourceMappingURL=ECSManager.js.map