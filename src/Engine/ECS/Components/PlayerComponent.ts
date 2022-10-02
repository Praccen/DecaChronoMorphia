import { Component, ComponentTypeEnum } from "./Component.js";

export default class PlayerComponent extends Component {
	inRoomId?: number;
	dodgeing: boolean;
	startDodge: boolean;
	dodgeCooldown: number;
	dodgeLength: number;

	constructor() {
		super(ComponentTypeEnum.PLAYER);
		this.startDodge = false;
		this.dodgeing = false;
		this.dodgeCooldown = 2;
		this.dodgeLength = 1.5;
	}
}
