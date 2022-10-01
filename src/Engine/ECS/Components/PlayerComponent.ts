import { Component, ComponentTypeEnum } from "./Component";

export default class PlayerComponent extends Component {
	inRoomId?: number;

	constructor() {
		super(ComponentTypeEnum.PLAYER);
	}
}
