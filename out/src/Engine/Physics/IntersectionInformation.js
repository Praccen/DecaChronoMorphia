import Vec3 from "../Maths/Vec3.js";
export default class IntersectionInformation {
    axis;
    depth;
    point;
    affectMove;
    constructor(axis, depth, point, affectMove) {
        this.axis = new Vec3(axis);
        this.depth = depth;
        this.point = new Vec3(point);
        this.affectMove = affectMove;
    }
}
//# sourceMappingURL=IntersectionInformation.js.map