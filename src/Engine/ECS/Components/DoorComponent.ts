import { Component, ComponentTypeEnum } from "./Component.js";

export default class DoorComponent extends Component {
	openDirection: number;
    doorClosingTimer: number;
    doorCloseAfter: number;

	constructor() {
		super(ComponentTypeEnum.DOOR);
		this.openDirection = 0;
        this.doorClosingTimer = 0.0;
        this.doorCloseAfter = 1.0;
	}
}
