import { Component, ComponentTypeEnum } from "./Component";

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
