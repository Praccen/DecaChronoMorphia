import { applicationStartTime } from "../main.js";
import Framebuffer from "./Framebuffer.js";
import ScreenQuad from "./Objects/ScreenQuad.js";
import Quad from "./Objects/Quad.js";
import PhongQuad from "./Objects/PhongQuad.js";
import Mesh from "./Objects/Mesh.js";
import ParticleSpawner from "./Objects/ParticleSpawner.js";
import TextureStore from "./Textures/TextureStore.js";
import Camera from "./Camera.js";
import DirectionalLight from "./Lighting/DirectionalLight.js";
import PointLight from "./Lighting/PointLight.js";
import TextObject2D from "./GUI/Text/TextObject2D.js";
import TextObject3D from "./GUI/Text/TextObject3D.js";
import Checkbox from "./GUI/Checkbox.js";
import Button from "./GUI/Button.js";
import SimpleShaderProgram from "./ShaderPrograms/SimpleShaderProgram.js";
import ScreenQuadShaderProgram from "./ShaderPrograms/ScreenQuadShaderProgram.js";
import CrtShaderProgram from "./ShaderPrograms/PostProcessing/CrtShaderProgram.js";
import ParticleShaderProgram from "./ShaderPrograms/ParticleShaderProgram.js";
import ShadowPass from "./ShaderPrograms/ShadowMapping/ShadowPass.js";
import GeometryPass from "./ShaderPrograms/DeferredRendering/GeometryPass.js";
import LightingPass from "./ShaderPrograms/DeferredRendering/LightingPass.js";
import BloomExtraction from "./ShaderPrograms/PostProcessing/BloomExtraction.js";
import BloomBlending from "./ShaderPrograms/PostProcessing/BloomBlending.js";
import GaussianBlur from "./ShaderPrograms/PostProcessing/GaussianBlur.js";
export default class Rendering {
    // public
    camera;
    clearColour;
    // ---- Post processing toggles ----
    useCrt;
    useBloom;
    // ---------------------------------
    // private
    gl;
    textureStore;
    resolutionWidth;
    resolutionHeight;
    // ---- Simple shading ----
    simpleShaderProgram;
    // ------------------------
    // ---- Particles ----
    particleShaderProgram;
    particleSpawners;
    // -------------------
    // ---- Shadow mapping ----
    shadowResolution;
    shadowOffset;
    shadowPass;
    shadowBuffer;
    // ------------------------
    // ---- Deferred rendering ----
    geometryPass;
    lightingPass;
    gBuffer;
    lightingQuad;
    // ----------------------------
    // ---- Post processing ----
    // Crt effect
    crtShaderProgram;
    crtFramebuffer;
    // Bloom
    bloomExtraction;
    bloomExtractionInputFramebuffer;
    bloomExtractionOutputFramebuffer;
    gaussianBlur;
    pingPongFramebuffers; // 2 frambuffers to go back and fourth between
    bloomBlending;
    // Screen quad to output the finished image on
    screenQuadShaderProgram;
    screenQuad;
    // -------------------------
    // ---- Graphics objects ----
    quads;
    graphicObjects;
    // --------------------------
    // ---- Lights ----
    directionalLight;
    pointLights;
    // ----------------
    // ---- GUI rendering ----
    textObjects2D;
    textObjects3D;
    checkboxes;
    buttons;
    // -----------------------
    constructor(gl) {
        this.gl = gl;
        this.textureStore = new TextureStore(gl);
        this.camera = new Camera(gl);
        this.resolutionWidth = 1920;
        this.resolutionHeight = 1080;
        // ---- Simple shading ----
        this.simpleShaderProgram = new SimpleShaderProgram(this.gl);
        // ------------------------
        // ---- Particles ----
        this.particleShaderProgram = new ParticleShaderProgram(this.gl);
        this.particleSpawners = new Array();
        // -------------------
        // ---- Shadow mapping ----
        this.shadowResolution = 4096;
        this.shadowOffset = 20.0;
        this.shadowPass = new ShadowPass(this.gl);
        this.shadowBuffer = new Framebuffer(this.gl, this.shadowResolution, this.shadowResolution, true, []); // [{internalFormat: this.gl.RGBA, dataStorageType: this.gl.UNSIGNED_BYTE}]
        // ------------------------
        // ---- Deferred rendering ----
        this.geometryPass = new GeometryPass(this.gl);
        this.lightingPass = new LightingPass(this.gl);
        this.gBuffer = new Framebuffer(this.gl, this.resolutionWidth, this.resolutionHeight, false, [
            { internalFormat: this.gl.RGBA32F, dataStorageType: this.gl.FLOAT },
            { internalFormat: this.gl.RGBA32F, dataStorageType: this.gl.FLOAT },
            {
                internalFormat: this.gl.RGBA,
                dataStorageType: this.gl.UNSIGNED_BYTE,
            },
        ]);
        let textureArray = new Array();
        for (let i = 0; i < this.gBuffer.textures.length; i++) {
            textureArray.push(this.gBuffer.textures[i]);
        }
        textureArray.push(this.shadowBuffer.depthTexture);
        this.lightingQuad = new ScreenQuad(this.gl, this.lightingPass, textureArray);
        // ----------------------------
        // ---- Post processing ----
        // Crt effect
        this.useCrt = true;
        this.crtShaderProgram = new CrtShaderProgram(this.gl);
        this.crtFramebuffer = new Framebuffer(this.gl, this.resolutionWidth, this.resolutionHeight, false, [{ internalFormat: this.gl.RGBA, dataStorageType: this.gl.UNSIGNED_BYTE }]);
        // Bloom
        this.useBloom = true;
        this.bloomExtraction = new BloomExtraction(this.gl);
        this.bloomExtractionInputFramebuffer = new Framebuffer(this.gl, this.resolutionWidth, this.resolutionHeight, false, [{ internalFormat: this.gl.RGBA, dataStorageType: this.gl.UNSIGNED_BYTE }]);
        this.bloomExtractionOutputFramebuffer = new Framebuffer(this.gl, this.resolutionWidth, this.resolutionHeight, false, [
            {
                internalFormat: this.gl.RGBA,
                dataStorageType: this.gl.UNSIGNED_BYTE,
            },
            {
                internalFormat: this.gl.RGBA,
                dataStorageType: this.gl.UNSIGNED_BYTE,
            },
        ]);
        this.gaussianBlur = new GaussianBlur(this.gl);
        this.pingPongFramebuffers = new Array(2);
        for (let i = 0; i < 2; i++) {
            this.pingPongFramebuffers[i] = new Framebuffer(this.gl, this.resolutionWidth, this.resolutionHeight, false, [
                {
                    internalFormat: this.gl.RGBA,
                    dataStorageType: this.gl.UNSIGNED_BYTE,
                },
            ]);
        }
        this.bloomBlending = new BloomBlending(this.gl);
        // Screen quad to output the finished image on
        this.screenQuadShaderProgram = new ScreenQuadShaderProgram(this.gl);
        this.screenQuad = new ScreenQuad(this.gl, this.screenQuadShaderProgram, new Array());
        // -------------------------
        // ---- Graphics objects ----
        this.quads = new Array();
        this.graphicObjects = new Array();
        // --------------------------
        // ---- Lights ----
        this.directionalLight = new DirectionalLight(this.gl, this.lightingPass);
        this.pointLights = new Array();
        // ----------------
        // ---- GUI rendering ----
        this.textObjects2D = new Array();
        this.textObjects3D = new Array();
        this.checkboxes = new Array();
        this.buttons = new Array();
        // -----------------------
        this.initGL();
    }
    initGL() {
        this.clearColour = { r: 0.15, g: 0.1, b: 0.1, a: 1.0 };
        this.gl.clearColor(this.clearColour.r, this.clearColour.g, this.clearColour.b, this.clearColour.a);
        // Enable depth test
        this.gl.enable(this.gl.DEPTH_TEST);
        //Enable alpha blending
        // this.gl.enable(this.gl.BLEND);
        // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.disable(this.gl.BLEND);
        // Disable faceculling
        this.gl.disable(this.gl.CULL_FACE);
    }
    reportCanvasResize(x, y) {
        this.resolutionWidth = x;
        this.resolutionHeight = y;
        this.gBuffer.setProportions(x, y);
        this.crtFramebuffer.setProportions(x, y);
        this.bloomExtractionInputFramebuffer.setProportions(x, y);
        this.bloomExtractionOutputFramebuffer.setProportions(x, y);
        for (let buffer of this.pingPongFramebuffers) {
            buffer.setProportions(x, y);
        }
    }
    setShadowMappingResolution(res) {
        this.shadowResolution = res;
        this.shadowBuffer.setProportions(res, res);
    }
    loadTextureToStore(texturePath) {
        this.textureStore.getTexture(texturePath);
    }
    getTextureFromStore(path) {
        return this.textureStore.getTexture(path);
    }
    getNewQuad(texturePath) {
        const length = this.quads.push(new Quad(this.gl, this.simpleShaderProgram, this.textureStore.getTexture(texturePath)));
        return this.quads[length - 1];
    }
    getNewPhongQuad(diffusePath, specularPath) {
        const length = this.graphicObjects.push(new PhongQuad(this.gl, this.geometryPass, this.textureStore.getTexture(diffusePath), this.textureStore.getTexture(specularPath)));
        return this.graphicObjects[length - 1];
    }
    getNewPhongQuadTex(diffusePath, specularPath) {
        const length = this.graphicObjects.push(new PhongQuad(this.gl, this.geometryPass, diffusePath, specularPath));
        return this.graphicObjects[length - 1];
    }
    async getNewMesh(meshPath, diffusePath, specularPath) {
        const response = await fetch(meshPath);
        const objContent = await response.text();
        const length = this.graphicObjects.push(new Mesh(this.gl, this.geometryPass, objContent, this.textureStore.getTexture(diffusePath), this.textureStore.getTexture(specularPath)));
        return this.graphicObjects[length - 1];
    }
    getNewPointLight() {
        const length = this.pointLights.push(new PointLight(this.gl, this.lightingPass));
        return this.pointLights[length - 1];
    }
    getDirectionalLight() {
        return this.directionalLight;
    }
    getNew2DText() {
        const length = this.textObjects2D.push(new TextObject2D());
        return this.textObjects2D[length - 1];
    }
    getNew3DText() {
        const length = this.textObjects3D.push(new TextObject3D());
        return this.textObjects3D[length - 1];
    }
    getNewCheckbox() {
        const length = this.checkboxes.push(new Checkbox());
        return this.checkboxes[length - 1];
    }
    getNewButton() {
        const length = this.buttons.push(new Button());
        return this.buttons[length - 1];
    }
    getNewParticleSpawner(texturePath, numberOfStartingParticles = 0) {
        let length = this.particleSpawners.push(new ParticleSpawner(this.gl, this.particleShaderProgram, this.textureStore.getTexture(texturePath), numberOfStartingParticles));
        return this.particleSpawners[length - 1];
    }
    deleteQuad(quad) {
        let index = this.quads.findIndex((q) => q == quad);
        if (index != -1) {
            this.quads.splice(index, 1);
        }
    }
    deleteGraphicsObject(object) {
        this.graphicObjects = this.graphicObjects.filter((o) => object !== o);
    }
    draw() {
        this.gl.enable(this.gl.DEPTH_TEST);
        // ---- Shadow pass ----
        this.shadowPass.use();
        this.gl.viewport(0, 0, this.shadowResolution, this.shadowResolution);
        this.shadowBuffer.bind(this.gl.FRAMEBUFFER);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //Set uniforms
        this.directionalLight.calcAndSendLightSpaceMatrix(this.camera.getPosition(), this.shadowOffset, this.shadowPass.getUniformLocation("lightSpaceMatrix")[0]);
        //Render shadow pass
        for (let obj of this.graphicObjects.values()) {
            obj.changeShaderProgram(this.shadowPass);
            if (obj instanceof PhongQuad) {
                obj.draw(false);
            }
            else if (obj instanceof Mesh) {
                obj.draw(false);
            }
        }
        this.gl.viewport(0.0, 0.0, this.resolutionWidth, this.resolutionHeight);
        // ---------------------
        // Bind gbuffer and clear that with 0,0,0,0 (the alpha = 0 is important to be able to identify fragments in the lighting pass that have not been written with geometry)
        this.gBuffer.bind(this.gl.FRAMEBUFFER);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT);
        // ---- Geometry pass ----
        this.geometryPass.use();
        this.camera.bindViewProjMatrix(this.geometryPass.getUniformLocation("viewProjMatrix")[0]);
        for (let obj of this.graphicObjects.values()) {
            obj.changeShaderProgram(this.geometryPass);
            obj.draw();
        }
        // -----------------------
        // Geometry pass over, appropriate framebuffer for post processing or render directly to screen.
        if (this.useBloom) {
            this.bloomExtractionInputFramebuffer.bind(this.gl.DRAW_FRAMEBUFFER);
        }
        else if (this.useCrt) {
            this.crtFramebuffer.bind(this.gl.DRAW_FRAMEBUFFER);
        }
        else {
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null); // Render directly to screen
        }
        // Clear the output with the actual clear colour we have set
        this.gl.clearColor(this.clearColour.r, this.clearColour.g, this.clearColour.b, this.clearColour.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT);
        // Disable depth testing for screen quad(s) rendering
        this.gl.disable(this.gl.DEPTH_TEST);
        // ---- Lighting pass ----
        this.lightingPass.use();
        this.gl.uniform3fv(this.lightingPass.getUniformLocation("camPos")[0], this.camera.getPosition().elements());
        this.directionalLight.bind();
        this.directionalLight.calcAndSendLightSpaceMatrix(this.camera.getPosition(), this.shadowOffset, this.lightingPass.getUniformLocation("lightSpaceMatrix")[0]);
        // Point lights
        this.gl.uniform1i(this.lightingPass.getUniformLocation("nrOfPointLights")[0], this.pointLights.length);
        for (let i = 0; i < this.pointLights.length; i++) {
            if (!this.pointLights[i].removed) {
                this.pointLights[i].bind(i);
            }
            else {
                this.pointLights.splice(i, 1);
                i--;
            }
        }
        this.lightingQuad.draw();
        // -----------------------
        // ---- Simple shaded ----
        // Copy the depth buffer information from the gBuffer to the current depth buffer
        this.gBuffer.bind(this.gl.READ_FRAMEBUFFER);
        this.gl.blitFramebuffer(0, 0, this.resolutionWidth, this.resolutionHeight, 0, 0, this.resolutionWidth, this.resolutionHeight, this.gl.DEPTH_BUFFER_BIT, this.gl.NEAREST);
        // Enable depth testing again
        this.gl.enable(this.gl.DEPTH_TEST);
        if (this.quads.length > 0) {
            // Only do this if there is something to simple shade
            this.simpleShaderProgram.use();
            this.camera.bindViewProjMatrix(this.simpleShaderProgram.getUniformLocation("viewProjMatrix")[0]);
            for (const quad of this.quads.values()) {
                quad.draw();
            }
        }
        // -----------------------
        // ---- Particles ----
        this.gl.enable(this.gl.DEPTH_TEST);
        this.particleShaderProgram.use();
        this.camera.bindViewProjMatrix(this.particleShaderProgram.getUniformLocation("viewProjMatrix")[0]);
        this.gl.uniform3fv(this.particleShaderProgram.getUniformLocation("cameraPos")[0], this.camera.getPosition().elements());
        this.gl.uniform1f(this.particleShaderProgram.getUniformLocation("currentTime")[0], (Date.now() - applicationStartTime) * 0.001);
        for (const particleSpawner of this.particleSpawners.values()) {
            particleSpawner.draw();
        }
        // -------------------
        // ---- Post processing ----
        this.gl.disable(this.gl.DEPTH_TEST);
        if (this.useBloom) {
            this.bloomExtractionOutputFramebuffer.bind(this.gl.DRAW_FRAMEBUFFER);
            this.bloomExtraction.use();
            this.bloomExtractionInputFramebuffer.textures[0].bind(0);
            this.screenQuad.draw(false);
            // Blur the bright image (second of the two in bloomExtractionOutputFramebuffer)
            let horizontal = true, firstIteration = true;
            let amount = 5;
            this.gaussianBlur.use();
            for (let i = 0; i < amount; i++) {
                this.pingPongFramebuffers[Number(horizontal)].bind(this.gl.DRAW_FRAMEBUFFER);
                this.gl.uniform1ui(this.gaussianBlur.getUniformLocation("horizontal")[0], Number(horizontal));
                if (firstIteration) {
                    this.bloomExtractionOutputFramebuffer.textures[1].bind();
                }
                else {
                    this.pingPongFramebuffers[Number(!horizontal)].textures[0].bind();
                }
                this.screenQuad.draw(false);
                horizontal = !horizontal;
                firstIteration = false;
            }
            // Combine the normal image with the blured bright image
            this.bloomBlending.use();
            this.bloomExtractionOutputFramebuffer.textures[0].bind(0); // Normal scene
            this.pingPongFramebuffers[Number(horizontal)].textures[0].bind(1); // Blurred bright image
            // Render result to screen or to crt framebuffer if doing crt effect after this.
            if (this.useCrt) {
                this.crtFramebuffer.bind(this.gl.DRAW_FRAMEBUFFER);
            }
            else {
                this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null); // Render directly to screen
            }
            this.screenQuad.draw(false);
        }
        if (this.useCrt) {
            // ---- Crt effect ----
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null); // Render directly to screen
            this.crtShaderProgram.use();
            this.crtFramebuffer.textures[0].bind(0);
            this.screenQuad.draw(false);
            // --------------------
        }
        // -------------------------
        // ---- GUI rendering ----
        for (let i = 0; i < this.textObjects3D.length; i++) {
            if (!this.textObjects3D[i].removed) {
                this.textObjects3D[i].draw(this.camera.getViewProjMatrix());
            }
            else {
                this.textObjects3D.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.textObjects2D.length; i++) {
            if (!this.textObjects2D[i].removed) {
                this.textObjects2D[i].draw();
            }
            else {
                this.textObjects2D.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.checkboxes.length; i++) {
            if (!this.checkboxes[i].removed) {
                this.checkboxes[i].draw();
            }
            else {
                this.checkboxes.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.buttons.length; i++) {
            if (!this.buttons[i].removed) {
                this.buttons[i].draw();
            }
            else {
                this.buttons.splice(i, 1);
                i--;
            }
        }
        // -----------------------
    }
    renderTextureToScreen(texture) {
        this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null); // Render directly to screen
        this.screenQuadShaderProgram.use();
        texture.bind();
        this.screenQuad.draw(false);
    }
}
//# sourceMappingURL=Rendering.js.map