import Vec3 from "../../Maths/Vec3.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import { AudioTypeEnum } from "../Components/AudioComponent.js";
import BoundingBoxComponent from "../Components/BoundingBoxComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PointLightComponent from "../Components/PointLightComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import System from "./System.js";
export default class WeaponSystem extends System {
    ecsManager;
    rendering;
    constructor(manager, rendering) {
        super([ComponentTypeEnum.WEAPON]);
        this.ecsManager = manager;
        this.rendering = rendering;
    }
    update(dt) {
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const weaponComp = e.getComponent(ComponentTypeEnum.WEAPON);
            weaponComp.attackTimer = Math.max(weaponComp.attackTimer - dt, 0);
            if (weaponComp.attackRequested && weaponComp.attackTimer <= 0) {
                const audioComp = e.getComponent(ComponentTypeEnum.AUDIO);
                if (audioComp) {
                    audioComp.sounds[AudioTypeEnum.SHOOT].requestPlay = true;
                }
                weaponComp.attackRequested = false;
                const dmgEntity = this.ecsManager.createEntity();
                this.ecsManager.addComponent(dmgEntity, new DamageComponent(weaponComp.damage));
                this.ecsManager.addComponent(dmgEntity, new PositionComponent(new Vec3({
                    x: weaponComp.position.x,
                    y: weaponComp.position.y,
                    z: weaponComp.position.z,
                })));
                const dmgMoveComp = new MovementComponent();
                dmgMoveComp.accelerationDirection = weaponComp.direction;
                //if melee make damageEntity move super fast, otherwise more slow
                const projectileSpeed = weaponComp.shoots ? 1 : 3;
                dmgMoveComp.velocity = new Vec3(weaponComp.direction).multiply(projectileSpeed);
                dmgMoveComp.drag = 0.0;
                dmgMoveComp.acceleration = 0.0;
                dmgMoveComp.constantAcceleration.y = 0.0;
                this.ecsManager.addComponent(dmgEntity, dmgMoveComp);
                let collComp = new CollisionComponent();
                collComp.hasForce = false;
                this.ecsManager.addComponent(dmgEntity, collComp);
                let enemyBBComp = new BoundingBoxComponent();
                enemyBBComp.boundingBox.setMinAndMaxVectors(new Vec3({ x: -0.2, y: -0.5, z: -0.2 }), new Vec3({ x: 0.2, y: 0.5, z: 0.2 }));
                enemyBBComp.updateBoundingBoxBasedOnPositionComp = true;
                this.ecsManager.addComponent(dmgEntity, enemyBBComp);
                let dmgTexture = "Assets/textures/projectiles.png";
                let phongQuad = this.rendering.getNewPhongQuad(dmgTexture, dmgTexture);
                this.ecsManager.addComponent(dmgEntity, new GraphicsComponent(phongQuad));
                let projectileAnimComp = new AnimationComponent();
                projectileAnimComp.spriteMap.setNrOfSprites(3, 2);
                projectileAnimComp.startingTile = { x: 0, y: 0 };
                projectileAnimComp.advanceBy = { x: 0.0, y: 0.0 };
                projectileAnimComp.modAdvancement = { x: 0.0, y: 0.0 };
                projectileAnimComp.updateInterval = 0.0;
                this.ecsManager.addComponent(dmgEntity, projectileAnimComp);
                let light = this.rendering.getNewPointLight();
                light.colour.setValues(3.0, 0.0, 0.0);
                light.linear = 3.0;
                light.quadratic = 6.0;
                let lightComp = new PointLightComponent(light);
                lightComp.posOffset.setValues(0.0, 0.0, 0.1);
                this.ecsManager.addComponent(dmgEntity, lightComp);
                weaponComp.attackTimer = weaponComp.attackCooldown;
            }
        });
    }
}
//# sourceMappingURL=WeaponSystem.js.map