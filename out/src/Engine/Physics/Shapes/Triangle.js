import Matrix3 from "../../Maths/Matrix3.js";
import Vec3 from "../../Maths/Vec3.js";
import Shape from "./Shape.js";
export default class Triangle extends Shape {
    originalVertices;
    originalNormal;
    transformedVertices;
    transformedNormals;
    transformedEdges;
    transformedEdgeNormals;
    transformMatrix;
    verticesNeedsUpdate;
    normalNeedsUpdate;
    edgesNeedsUpdate;
    edgeNormalsNeedsUpdate;
    constructor() {
        super();
        this.originalVertices = new Array();
        this.originalNormal = new Vec3();
        this.transformedVertices = new Array();
        this.transformedNormals = new Array(1);
        this.transformedEdges = new Array();
        this.transformedEdgeNormals = new Array();
        this.transformMatrix = new Matrix4(null);
        this.verticesNeedsUpdate = false;
        this.normalNeedsUpdate = false;
        this.edgesNeedsUpdate = false;
        this.edgeNormalsNeedsUpdate = false;
    }
    setVertices(vertex1, vertex2, vertex3) {
        this.originalVertices.length = 0;
        this.transformedEdges.length = 0;
        this.originalVertices.push(vertex1);
        this.originalVertices.push(vertex2);
        this.originalVertices.push(vertex3);
        this.originalNormal.deepAssign(new Vec3(vertex2)
            .subtract(vertex1)
            .cross(new Vec3(vertex3).subtract(vertex2))
            .normalize());
        this.verticesNeedsUpdate = true;
        this.normalNeedsUpdate = true;
        this.edgesNeedsUpdate = true;
        this.edgeNormalsNeedsUpdate = true;
    }
    setUpdateNeeded() {
        this.verticesNeedsUpdate = true;
        this.normalNeedsUpdate = true;
        this.edgesNeedsUpdate = true;
        this.edgeNormalsNeedsUpdate = true;
    }
    setTransformMatrix(matrix) {
        this.transformMatrix = matrix;
        this.verticesNeedsUpdate = true;
        this.normalNeedsUpdate = true;
        this.edgesNeedsUpdate = true;
        this.edgeNormalsNeedsUpdate = true;
    }
    getTransformedVertices() {
        if (this.verticesNeedsUpdate) {
            this.transformedVertices.length = 0;
            for (const originalVertex of this.originalVertices) {
                let transformedVertex = this.transformMatrix.multiplyVector4(new Vector4([
                    originalVertex.x,
                    originalVertex.y,
                    originalVertex.z,
                    1.0,
                ]));
                let transformedVertexVec3 = new Vec3({
                    x: transformedVertex.elements[0],
                    y: transformedVertex.elements[1],
                    z: transformedVertex.elements[2],
                });
                this.transformedVertices.push(transformedVertexVec3);
            }
            this.verticesNeedsUpdate = false;
        }
        return this.transformedVertices;
    }
    getTransformedNormals() {
        if (this.normalNeedsUpdate) {
            let tempMatrix = new Matrix3();
            tempMatrix.fromMatrix4(this.transformMatrix).invert().transpose();
            this.transformedNormals[0] = tempMatrix
                .multiplyVec3(this.originalNormal)
                .normalize();
            this.normalNeedsUpdate = false;
        }
        return this.transformedNormals;
    }
    getTransformedEdges() {
        if (this.edgesNeedsUpdate) {
            this.getTransformedVertices(); // Force update of vertices
            this.transformedEdges.length = 0;
            this.transformedEdges.push(new Vec3(this.transformedVertices[1])
                .subtract(this.transformedVertices[0])
                .normalize());
            this.transformedEdges.push(new Vec3(this.transformedVertices[2])
                .subtract(this.transformedVertices[1])
                .normalize());
            this.transformedEdges.push(new Vec3(this.transformedVertices[0])
                .subtract(this.transformedVertices[2])
                .normalize());
            this.edgesNeedsUpdate = false;
        }
        return this.transformedEdges;
    }
    getTransformedEdgeNormals() {
        if (this.edgeNormalsNeedsUpdate) {
            this.getTransformedEdges(); // Force update of edges
            this.getTransformedNormals(); // Force update of normal
            this.transformedEdgeNormals.length = 0;
            this.transformedEdgeNormals.push(new Vec3(this.transformedEdges[0])
                .cross(this.transformedNormals[0])
                .normalize());
            this.transformedEdgeNormals.push(new Vec3(this.transformedEdges[1])
                .cross(this.transformedNormals[0])
                .normalize());
            this.transformedEdgeNormals.push(new Vec3(this.transformedEdges[2])
                .cross(this.transformedNormals[0])
                .normalize());
            this.edgeNormalsNeedsUpdate = false;
        }
        return this.transformedEdgeNormals;
    }
}
//# sourceMappingURL=Triangle.js.map