import Texture from "./Texture.js";
export default class TextureStore {
    gl;
    textures;
    constructor(gl) {
        this.gl = gl;
        this.textures = new Map();
    }
    getTexture(path) {
        let tex = this.textures.get(path);
        if (tex) {
            return tex;
        }
        let newTexture = new Texture(this.gl);
        newTexture.loadFromFile(path);
        this.textures.set(path, newTexture);
        return newTexture;
    }
}
//# sourceMappingURL=TextureStore.js.map