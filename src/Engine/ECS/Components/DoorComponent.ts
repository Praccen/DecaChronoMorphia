import { Component, ComponentTypeEnum } from "./Component.js";

export default class DoorComponent extends Component {
	isOpen: boolean;

	constructor() {
		super(ComponentTypeEnum.DOOR);
		this.isOpen = false;
	}
}
