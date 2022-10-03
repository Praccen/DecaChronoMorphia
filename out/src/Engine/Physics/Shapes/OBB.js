import Matrix3 from "../../Maths/Matrix3.js";
import Vec3 from "../../Maths/Vec3.js";
import Shape from "./Shape.js";
export default class OBB extends Shape {
    originalVertices;
    originalNormals;
    transformedVertices;
    transformedNormals;
    transformMatrix;
    verticesNeedsUpdate;
    normalsNeedsUpdate;
    constructor() {
        super();
        this.originalVertices = new Array();
        this.originalNormals = new Array();
        this.transformedVertices = new Array();
        this.transformedNormals = new Array();
        this.transformMatrix = new Matrix4(null);
        this.verticesNeedsUpdate = false;
        this.normalsNeedsUpdate = false;
    }
    setVertices(vertices) {
        this.originalVertices.length = 0;
        for (let vert of vertices) {
            this.originalVertices.push(vert);
        }
        this.verticesNeedsUpdate = true;
    }
    setNormals(normals) {
        this.originalNormals.length = 0;
        for (let norm of normals) {
            this.originalNormals.push(norm);
        }
        this.normalsNeedsUpdate = true;
    }
    /**
     * Creates an axis aligned bounding box (AABB).
     * @param minVec Corner for the lower bound.
     * @param maxVec Corner for the upper bound.
     */
    setMinAndMaxVectors(minVec, maxVec) {
        this.originalNormals.length = 0;
        this.originalNormals.push(new Vec3({ x: 1.0, y: 0.0, z: 0.0 }));
        this.originalNormals.push(new Vec3({ x: 0.0, y: 1.0, z: 0.0 }));
        this.originalNormals.push(new Vec3({ x: 0.0, y: 0.0, z: 1.0 }));
        this.originalVertices.length = 0;
        for (let i = 0; i < 8; i++) {
            this.originalVertices.push(new Vec3({ x: 0.0, y: 0.0, z: 0.0 }));
        }
        this.originalVertices[0].deepAssign(minVec);
        this.originalVertices[1].setValues(minVec.x, minVec.y, maxVec.z);
        this.originalVertices[2].setValues(minVec.x, maxVec.y, minVec.z);
        this.originalVertices[3].setValues(minVec.x, maxVec.y, maxVec.z);
        this.originalVertices[4].setValues(maxVec.x, minVec.y, minVec.z);
        this.originalVertices[5].setValues(maxVec.x, minVec.y, maxVec.z);
        this.originalVertices[6].setValues(maxVec.x, maxVec.y, minVec.z);
        this.originalVertices[7].deepAssign(maxVec);
        this.normalsNeedsUpdate = true;
        this.verticesNeedsUpdate = true;
    }
    setUpdateNeeded() {
        this.verticesNeedsUpdate = true;
        this.normalsNeedsUpdate = true;
    }
    setTransformMatrix(matrix) {
        this.transformMatrix = matrix;
        this.verticesNeedsUpdate = true;
        this.normalsNeedsUpdate = true;
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
        if (this.normalsNeedsUpdate) {
            this.transformedNormals.length = 0;
            let tempMatrix = new Matrix3();
            tempMatrix.fromMatrix4(this.transformMatrix).invert().transpose();
            for (const originalNormal of this.originalNormals) {
                this.transformedNormals.push(tempMatrix.multiplyVec3(originalNormal).normalize());
            }
            this.normalsNeedsUpdate = false;
        }
        return this.transformedNormals;
    }
    getTransformedEdges() {
        return this.getTransformedNormals();
    }
    getTransformedEdgeNormals() {
        return this.getTransformedNormals();
    }
}
//# sourceMappingURL=OBB.js.map