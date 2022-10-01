import { Component, ComponentTypeEnum } from "./Component";

export default class ConnectionComponent extends Component {
	existsInRoomId: number;
	leadsToRoomId: number;

	constructor() {
		super(ComponentTypeEnum.CONNECTION);
	}
}
