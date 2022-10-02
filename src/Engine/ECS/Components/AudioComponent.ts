import { Component, ComponentTypeEnum } from "./Component.js";

export enum AudioTypeEnum {
	DAMAGE,
	SHOOT,
	POLYMORPH,
}

export default class AudioComponent extends Component {
	sounds: {
		[key in AudioTypeEnum]?: {
			audioKey: string;
			playTime: number;
			timePlaying: number;
			requestPlay: boolean;
			playing: boolean;
		};
	};

	constructor(
		sounds: { key: AudioTypeEnum; audioKey: string; playTime: number }[]
	) {
		super(ComponentTypeEnum.AUDIO);

		sounds.forEach((sound) => {
			if (this.sounds) {
				this.sounds[sound.key] = {
					audioKey: sound.audioKey,
					playTime: sound.playTime,
					timePlaying: 0,
					requestPlay: false,
					playing: false,
				};
			} else {
				this.sounds = {
					[sound.key]: {
						audioKey: sound.audioKey,
						playTime: sound.playTime,
						timePlaying: 0,
						requestPlay: false,
						playing: false,
					},
				};
			}
		});
	}
}
