import { Component, ComponentTypeEnum } from "./Component.js";
export default class MeshCollisionComponent extends Component {
    triangles;
    constructor() {
        super(ComponentTypeEnum.MESHCOLLISION);
        this.triangles = new Array();
    }
    /**
     * Sets up the triangles based on the vertices in a graphics object
     * @param graphicsObj The graphics object
     */
    setup(graphicsObj) {
        graphicsObj.setupTriangles(this.triangles);
    }
    /**
     * Update the transform matrix used for the triangles.
     * @param matrix Optional: Will set a new matrix to use for the triangles. If no matrix is sent, it will use the previously set matrix but mark all triangles to be updated.
     */
    updateTransformMatrix(matrix) {
        if (matrix) {
            for (let tri of this.triangles) {
                tri.setTransformMatrix(matrix);
            }
        }
        else {
            for (let tri of this.triangles) {
                tri.setUpdateNeeded();
            }
        }
    }
}
//# sourceMappingURL=MeshCollisionComponent.js.map