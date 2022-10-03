import Vec3 from "./Maths/Vec3.js";
export default class Camera {
    gl;
    pos;
    dir;
    fov;
    ratio;
    viewMatrixNeedsUpdate;
    projMatrixNeedsUpdate;
    viewMatrix;
    projectionMatrix;
    viewProjMatrix;
    constructor(gl) {
        this.gl = gl;
        // ----View----
        this.pos = new Vec3();
        this.dir = new Vec3({ x: 0.0, y: 0.0, z: -1.0 });
        this.viewMatrix = new Matrix4(null);
        this.viewMatrixNeedsUpdate = true;
        // ------------
        // ----Proj----
        this.projectionMatrix = new Matrix4(null);
        this.projMatrixNeedsUpdate = true;
        this.ratio = 16.0 / 9.0;
        this.fov = 85.0;
        // ------------
        this.viewProjMatrix = new Matrix4(null);
    }
    getViewProjMatrix() {
        this.updateViewProjMatrix();
        return this.viewProjMatrix;
    }
    getPosition() {
        return this.pos;
    }
    getDir() {
        return this.dir;
    }
    getRight() {
        let returnVec = new Vec3(this.dir);
        let upVec = new Vec3({ x: 0.0, y: 1.0, z: 0.0 });
        returnVec.cross(upVec);
        returnVec.normalize();
        return returnVec;
    }
    setPosition(posX, posY, posZ) {
        this.pos.x = posX;
        this.pos.y = posY;
        if (posZ) {
            this.pos.z = posZ;
        }
        this.viewMatrixNeedsUpdate = true;
    }
    translate(posX, posY, posZ) {
        this.pos.x += posX;
        this.pos.y += posY;
        this.pos.z += posZ;
        this.viewMatrixNeedsUpdate = true;
    }
    setDir(dirX, dirY, dirZ) {
        this.dir.x = dirX;
        this.dir.y = dirY;
        this.dir.z = dirZ;
        this.dir.normalize();
        this.viewMatrixNeedsUpdate = true;
    }
    setFOV(fov) {
        this.fov = fov;
        this.projMatrixNeedsUpdate = true;
    }
    setAspectRatio(ratio) {
        this.ratio = ratio;
        this.projMatrixNeedsUpdate = true;
    }
    updateViewProjMatrix() {
        let updateViewProj = false;
        if (this.viewMatrixNeedsUpdate) {
            this.viewMatrix.setLookAt(this.pos.x, this.pos.y, this.pos.z, this.pos.x + this.dir.x, this.pos.y + this.dir.y, this.pos.z + this.dir.z, 0.0, 1.0, 0.0);
            this.viewMatrixNeedsUpdate = false;
            updateViewProj = true;
        }
        if (this.projMatrixNeedsUpdate) {
            this.projectionMatrix.setPerspective(this.fov, this.ratio, 0.01, 1000.0);
            this.projMatrixNeedsUpdate = false;
            updateViewProj = true;
        }
        if (updateViewProj) {
            this.viewProjMatrix.set(this.projectionMatrix);
            this.viewProjMatrix = this.viewProjMatrix.concat(this.viewMatrix);
        }
    }
    bindViewProjMatrix(uniformLocation) {
        this.updateViewProjMatrix();
        this.gl.uniformMatrix4fv(uniformLocation, false, this.viewProjMatrix.elements);
    }
}
//# sourceMappingURL=Camera.js.map