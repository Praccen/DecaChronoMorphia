import Entity from "../Entity.js";
import { Component, ComponentTypeEnum } from "./Component.js";

export default class CollisionComponent extends Component {
	isStatic: boolean;
	currentCollisionEntities: Set<Entity>;
	hasForce: boolean;

	constructor() {
		super(ComponentTypeEnum.COLLISION);
		this.currentCollisionEntities = new Set<Entity>();
		this.isStatic = false;
		this.hasForce = true;
	}
}
