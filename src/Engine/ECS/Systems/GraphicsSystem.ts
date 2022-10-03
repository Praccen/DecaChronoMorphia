import System from "./System.js";
import GraphicsComponent from "../Components/GraphicsComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import MeshCollisionComponent from "../Components/MeshCollisionComponent.js";
import PointLightComponent from "../Components/PointLightComponent.js";
import ProjectileComponent, {
	ProjectileGraphicsDirectionEnum,
} from "../Components/ProjectileComponent.js";
import PhongQuad from "../../Objects/PhongQuad.js";
import WeaponComponent, {
	WeaponTypeEnum,
} from "../Components/WeaponComponent.js";
import AnimationComponent from "../Components/AnimationComponent.js";

export default class GraphicsSystem extends System {
	constructor() {
		super([ComponentTypeEnum.POSITION]);
		// Optional ComponentTypeEnum.GRAPHICS, ComponentTypeEnum.POINTLIGHT
	}

	update(dt: number) {
		for (const e of this.entities) {
			//entity is inactive, continue
			if (!e.isActive) {
				continue;
			}

			let posComp = <PositionComponent>(
				e.getComponent(ComponentTypeEnum.POSITION)
			);

			let graphComp = <GraphicsComponent>(
				e.getComponent(ComponentTypeEnum.GRAPHICS)
			);

			let projectileComp = <ProjectileComponent>(
				e.getComponent(ComponentTypeEnum.PROJECTILE)
			);

			if (graphComp && posComp) {
				if (projectileComp) {
					if (
						projectileComp.projectileGraphicsDirection ===
						ProjectileGraphicsDirectionEnum.RIGHT
					) {
						let quad = <PhongQuad>graphComp.object;
						quad.textureMatrix.scale(-1, 1, 1);
					}
				}
				posComp.calculateMatrix(graphComp.object.modelMatrix);
			}

			let pointLightComp = <PointLightComponent>(
				e.getComponent(ComponentTypeEnum.POINTLIGHT)
			);

			if (pointLightComp && posComp) {
				pointLightComp.pointLight.position
					.deepAssign(posComp.position)
					.add(pointLightComp.posOffset);
			}
		}
	}
}
