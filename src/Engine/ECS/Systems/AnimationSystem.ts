import { ComponentTypeEnum } from "../Components/Component.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import AnimationComponent from "../Components/AnimationComponent.js";
import System from "./System.js";
import PhongQuad from "../../Objects/PhongQuad.js";
import ProjectileComponent, {
	ProjectileGraphicsDirectionEnum,
} from "../Components/ProjectileComponent.js";

export default class AnimationSystem extends System {
	constructor() {
		super([ComponentTypeEnum.GRAPHICS, ComponentTypeEnum.ANIMATION]);
	}

	update(dt: number) {
		for (const e of this.entities) {
			//entity is inactive, continue
			if (!e.isActive) {
				continue;
			}

			let graphComp = <GraphicsComponent>(
				e.getComponent(ComponentTypeEnum.GRAPHICS)
			);
			let animComp = <AnimationComponent>(
				e.getComponent(ComponentTypeEnum.ANIMATION)
			);
			let projectileComp = <ProjectileComponent>(
				e.getComponent(ComponentTypeEnum.PROJECTILE)
			);

			if (graphComp && animComp) {
				if (
					animComp.stopAtLast &&
					animComp.spriteMap.currentSprite.x ==
						animComp.spriteMap.nrOfSprites.x - 1
				) {
					return;
				}
				animComp.updateTimer += dt;

				animComp.advancements += Math.floor(
					animComp.updateTimer / Math.max(animComp.updateInterval, 0.000001)
				);
				animComp.updateTimer =
					animComp.updateTimer % Math.max(animComp.updateInterval, 0.000001);

				const xAdvance =
					(animComp.advanceBy.x * animComp.advancements) %
					Math.max(animComp.modAdvancement.x, 1.0);
				const yAdvance =
					(animComp.advanceBy.y * animComp.advancements) %
					Math.max(animComp.modAdvancement.y, 1.0);

				animComp.spriteMap.setCurrentSprite(
					animComp.startingTile.x + xAdvance,
					animComp.startingTile.y + yAdvance
				);

				let quad = <PhongQuad>graphComp.object;
				if (projectileComp) {
					if (
						!projectileComp.flipped &&
						projectileComp.projectileGraphicsDirection ===
							ProjectileGraphicsDirectionEnum.RIGHT
					) {
						console.log("Flip to right");
						projectileComp.flipped = true;
					}
				}
				animComp.spriteMap.updateTextureMatrix(quad.textureMatrix);
			}
		}
	}
}
