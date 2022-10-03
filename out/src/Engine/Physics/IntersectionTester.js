import { SAT } from "../Maths/SAT.js";
import Vec3 from "../Maths/Vec3.js";
import IntersectionInformation from "./IntersectionInformation.js";
export var IntersectionTester;
(function (IntersectionTester) {
    /**
     * Will check if there is an intersection between two meshes.
     * @param shapeArrayA List of shapes in physical object A.
     * @param shapeArrayB List of shapes in physical object B.
     * @returns if there is an intersection.
     */
    function identifyIntersection(shapeArrayA, shapeArrayB) {
        let intersectionAxis = new Vec3();
        let intersectionDepth = { depth: Infinity };
        for (let shapeA of shapeArrayA) {
            for (let shapeB of shapeArrayB) {
                if (SAT.getIntersection3D(shapeA, shapeB, intersectionAxis, intersectionDepth)) {
                    return true;
                }
            }
        }
        return false;
    }
    IntersectionTester.identifyIntersection = identifyIntersection;
    /**
     * Finds the intersection information (axises, depths, and points) between two physical objects, if they intersect
     * @param shapeArrayA List of shapes in physical object A.
     * @param shapeArrayB List of shapes in physical object B.
     * @param intersectionInformation An array that gets filled with information about all intersections happening between the two objects.
     * @returns If there is an intersection.
     */
    function identifyIntersectionInformation(shapeArrayA, shapeArrayB, intersectionInformation, affectMove) {
        let intersecting = false;
        let tempIntersectionAxis = new Vec3();
        let tempIntersectionDepth = { depth: Infinity };
        for (let shapeA of shapeArrayA) {
            for (let shapeB of shapeArrayB) {
                if (SAT.getIntersection3D(shapeA, shapeB, tempIntersectionAxis, tempIntersectionDepth)) {
                    intersecting = true;
                    // Save information about intersection
                    intersectionInformation.push(new IntersectionInformation(tempIntersectionAxis, tempIntersectionDepth.depth, SAT.getIntersectionPoint(shapeA, shapeB, tempIntersectionAxis), affectMove));
                }
            }
        }
        return intersecting;
    }
    IntersectionTester.identifyIntersectionInformation = identifyIntersectionInformation;
})(IntersectionTester || (IntersectionTester = {}));
//# sourceMappingURL=IntersectionTester.js.map