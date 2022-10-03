export default class Entity {
    id;
    isActive;
    initiated;
    name;
    components;
    constructor(id, active = true) {
        this.id = id;
        this.isActive = active;
        this.components = new Array();
    }
    addComponent(component) {
        if (!this.hasComponent(component.type)) {
            this.components.push(component);
            return true;
        }
        return false;
    }
    hasComponent(type) {
        return this.components.some((c) => c.type == type);
    }
    removeComponent(type) {
        let index = this.components.findIndex((c) => c.type == type);
        if (index != -1) {
            return this.components.splice(index, 1)[0];
        }
    }
    getComponent(type) {
        return this.components.find((c) => c.type == type);
    }
}
//# sourceMappingURL=Entity.js.map