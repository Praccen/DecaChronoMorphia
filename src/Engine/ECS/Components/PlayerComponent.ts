import { Component, ComponentTypeEnum } from "./Component.js";
import Vec2 from "../../Maths/Vec2.js";

export enum PlayerShapeEnum {
	NORMIE,
	TANKY,
	WIZ,
	MOUSE,
}

export default class PlayerComponent extends Component {
	inRoom: Vec2;
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
		this.inRoom = new Vec2({ x: 1, y: 1 });
	}
}
