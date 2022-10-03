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
	dodgeStartingTile: Vec2;
	dodgeModAdvancement: Vec2;
	dodgeUpdateInterval: number;
	dodgeAbiltiy: boolean;
	resetAnim: boolean;

	constructor() {
		super(ComponentTypeEnum.PLAYER);
		this.startDodge = false;
		this.dodgeing = false;
		this.dodgeAbiltiy = true;
		this.dodgeCooldown = 2;
		this.dodgeLength = 1.6;
		this.inRoom = new Vec2({ x: 1, y: 1 });
		this.resetAnim = false;
		this.dodgeStartingTile = new Vec2({ x: 0, y: 0 });
		this.dodgeModAdvancement = new Vec2({ x: 0, y: 0 });
		this.dodgeUpdateInterval = 0.0;
	}
}
