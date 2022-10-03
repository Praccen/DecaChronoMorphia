import System from "./System.js";
import { ComponentTypeEnum } from "../Components/Component.js";
export default class ParticleSpawnerSystem extends System {
    constructor() {
        super([ComponentTypeEnum.PARTICLESPAWNER, ComponentTypeEnum.POSITION]);
    }
    update(dt) {
        for (const e of this.entities) {
            //entity is inactive, continue
            if (!e.isActive) {
                continue;
            }
            let particleComp = (e.getComponent(ComponentTypeEnum.PARTICLESPAWNER));
            let posComp = (e.getComponent(ComponentTypeEnum.POSITION));
            if (particleComp && posComp) {
                let currentParticle = Math.floor((particleComp.resetTimer / Math.max(particleComp.lifeTime, 0.00001)) *
                    particleComp.particleSpawner.getNumberOfParticles());
                particleComp.resetTimer += dt;
                let endParticle = Math.floor((particleComp.resetTimer / Math.max(particleComp.lifeTime, 0.00001)) *
                    particleComp.particleSpawner.getNumberOfParticles());
                for (currentParticle; currentParticle < endParticle; currentParticle++) {
                    particleComp.particleSpawner.resetParticleStartTime(currentParticle %
                        particleComp.particleSpawner.getNumberOfParticles());
                    particleComp.particleSpawner.setParticleStartPosition(currentParticle %
                        particleComp.particleSpawner.getNumberOfParticles(), posComp.position);
                }
                if (particleComp.resetTimer > particleComp.lifeTime) {
                    particleComp.resetTimer -= particleComp.lifeTime;
                }
            }
        }
    }
}
//# sourceMappingURL=ParticleSpawnerSystem.js.map