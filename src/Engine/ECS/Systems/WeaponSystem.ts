import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import WeaponComponent from "../Components/WeaponComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class WeaponSystem extends System {
	ecsManager: ECSManager;

	constructor(manager) {
		super([ComponentTypeEnum.WEAPON, ComponentTypeEnum.POSITION]);
		this.ecsManager = manager;
	}

	update(dt: number): void {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}

			const weaponComp = e.getComponent(
				ComponentTypeEnum.WEAPON
			) as WeaponComponent;
			const positionCom = e.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;
			weaponComp.attackTimer = Math.max(weaponComp.attackTimer - dt, 0);

			//attack request done and attackCooldown is ready
			if (weaponComp.attackRequested && weaponComp.attackTimer <= 0) {
				//create damage entity
				const damageEntity = this.ecsManager.createEntity();
				this.ecsManager.addComponent(
					damageEntity,
					new DamageComponent(weaponComp.damage)
				);

				weaponComp.attackTimer = weaponComp.attackCooldown;
			}
		});
	}
}
