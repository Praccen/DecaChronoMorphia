import GraphicsObject from "./GraphicsObject.js";
export default class Quad extends GraphicsObject {
    textureMatrix;
    texture;
    // Private
    vertices;
    indices;
    constructor(gl, shaderProgram, texture) {
        super(gl, shaderProgram);
        // prettier-ignore
        this.vertices = new Float32Array([
            // positions        // colours              // uv
            -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.4, 0.0, 0.0,
            0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.8, 1.0, 0.0,
            0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        ]);
        // prettier-ignore
        this.indices = new Int32Array([
            0, 1, 2,
            0, 2, 3,
        ]);
        this.setVertexData(this.vertices);
        this.setIndexData(this.indices);
        this.texture = texture;
        this.modelMatrix = new Matrix4(null);
        this.textureMatrix = new Matrix4(null);
    }
    draw() {
        this.bindVAO();
        this.texture.bind();
        let ul = this.shaderProgram.getUniformLocation("useTexture");
        if (ul[1]) {
            this.gl.uniform1i(ul[0], 1);
        }
        ul = this.shaderProgram.getUniformLocation("modelMatrix");
        if (ul[1]) {
            this.gl.uniformMatrix4fv(ul[0], false, this.modelMatrix.elements);
        }
        ul = this.shaderProgram.getUniformLocation("textureMatrix");
        if (ul[1]) {
            this.gl.uniformMatrix4fv(ul[0], false, this.textureMatrix.elements);
        }
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_INT, 0);
    }
}
//# sourceMappingURL=Quad.js.map