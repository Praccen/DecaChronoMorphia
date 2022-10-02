import Rendering from "../Engine/Rendering.js";
import ECSManager from "../Engine/ECS/ECSManager.js";
import Vec3 from "../Engine/Maths/Vec3.js";
import PointLight from "../Engine/Lighting/PointLight.js";
import Player from "./Player.js";
import { MapGenerator } from "./Map/MapGenerator.js";

export default class Game {
	private rendering: Rendering;
	private ecsManager: ECSManager;

	private playerObject: Player;

	constructor(
		rendering: Rendering,
		ecsManager: ECSManager
	) {
		this.rendering = rendering;
		this.ecsManager = ecsManager;

		this.rendering.camera.setPosition(0.0, 0.0, 5.5);

		this.playerObject = new Player(this.rendering, this.ecsManager);
	}

	async init() {
		// ---- Lights ----
		this.createPointLight(
			new Vec3({ x: 0.0, y: 0.2, z: 0.0 }),
			new Vec3({ x: 0.7, y: 0.0, z: 0.0 })
		);
		this.createPointLight(
			new Vec3({ x: 4.0, y: 0.2, z: 2.0 }),
			new Vec3({ x: 0.7, y: 0.0, z: 1.0 })
		);
		// ----------------

		// ---- Map ----
		const mapInformation = await MapGenerator.GenerateMap(
			5,
			5,
			this.ecsManager,
			this.rendering
		);
		this.ecsManager.initializeSystems(mapInformation);
		console.log("mapInformation :>> ", mapInformation);
		// -------------
		

		this.playerObject.init();
	}

	createPointLight(position: Vec3, colour: Vec3): PointLight {
		let pl = this.rendering.getNewPointLight();
		pl.position = position;
		pl.colour = colour;

		return pl;
	}

	update(dt: number) {
		this.playerObject.update(dt);
	}
}
