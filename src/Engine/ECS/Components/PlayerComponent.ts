import { Component, ComponentTypeEnum } from "./Component.js";

export enum PlayerShapeEnum {
	NORMIE,
	TANKY,
	WIZ,
	MOUSE,
}

export default class PlayerComponent extends Component {
	inRoomId?: number;

	constructor() {
		super(ComponentTypeEnum.PLAYER);
	}
}
