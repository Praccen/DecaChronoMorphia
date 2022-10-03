import GraphicsObject from "./GraphicsObject.js";
export default class ScreenQuad extends GraphicsObject {
    textures;
    // Private
    vertices;
    indices;
    constructor(gl, shaderProgram, textures) {
        super(gl, shaderProgram);
        // prettier-ignore
        this.vertices = new Float32Array([
            // positions        // uv
            -1.0, 1.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 1.0,
        ]);
        // prettier-ignore
        this.indices = new Int32Array([
            0, 1, 2,
            0, 2, 3,
        ]);
        this.setVertexData(this.vertices);
        this.setIndexData(this.indices);
        this.textures = textures;
        for (let texture of this.textures) {
            texture.setTexParameters(this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            texture.setTexParameters(this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        }
    }
    draw(bindTextures = true) {
        this.bindVAO();
        if (bindTextures) {
            for (let i = 0; i < this.textures.length; i++) {
                this.textures[i].bind(i);
            }
        }
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_INT, 0);
    }
}
//# sourceMappingURL=ScreenQuad.js.map