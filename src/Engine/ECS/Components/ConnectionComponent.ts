import Vec2 from "../../Maths/Vec2.js";
import { Component, ComponentTypeEnum } from "./Component.js";

export default class ConnectionComponent extends Component {
	existsInRoomId: number;
	leadsToRoomId: number;
	roomOne: Vec2;
	roomTwo: Vec2;

	constructor(roomOne: Vec2, roomTwo: Vec2) {
		super(ComponentTypeEnum.CONNECTION);
		this.roomOne = roomOne;
		this.roomTwo = roomTwo;
	}
}
