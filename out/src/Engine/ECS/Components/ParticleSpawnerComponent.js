import { Component, ComponentTypeEnum } from "./Component.js";
export default class ParticleSpawnerComponent extends Component {
    lifeTime;
    resetTimer;
    particleSpawner;
    constructor(particleSpawner) {
        super(ComponentTypeEnum.PARTICLESPAWNER);
        this.lifeTime = 1.0;
        this.resetTimer = 0.0;
        this.particleSpawner = particleSpawner;
    }
}
//# sourceMappingURL=ParticleSpawnerComponent.js.map