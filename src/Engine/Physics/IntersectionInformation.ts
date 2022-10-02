import Vec3 from "../Maths/Vec3.js";

export default class IntersectionInformation {
	axis: Vec3;
	depth: number;
	point: Vec3;
	affectMove: boolean;

	constructor(axis: Vec3, depth: number, point: Vec3, affectMove: boolean) {
		this.axis = new Vec3(axis);
		this.depth = depth;
		this.point = new Vec3(point);
		this.affectMove = affectMove;
	}
}
