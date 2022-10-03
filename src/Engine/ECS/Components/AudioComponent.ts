import { Component, ComponentTypeEnum } from "./Component.js";

export enum AudioTypeEnum {
	DAMAGE,
	SHOOT,
	POLYMORPH,
	DEATH,
	VICTORY,
}

export default class AudioComponent extends Component {
	sounds: {
		[key in AudioTypeEnum]?: {
			audioKey: string;
			playTime: number;
			volumeMulitplier: number;
			timePlaying: number;
			requestPlay: boolean;
			playing: boolean;
		};
	};

	constructor(
		sounds: {
			key: AudioTypeEnum;
			audioKey: string;
			playTime: number;
			volumeMulitplier?: number;
		}[]
	) {
		super(ComponentTypeEnum.AUDIO);

		sounds.forEach((sound) => {
			if (this.sounds) {
				if (!sound.volumeMulitplier) {
					sound.volumeMulitplier = 1;
				}
				this.sounds[sound.key] = {
					audioKey: sound.audioKey,
					playTime: sound.playTime,
					volumeMulitplier: sound.volumeMulitplier,
					timePlaying: 0,
					requestPlay: false,
					playing: false,
				};
			} else {
				this.sounds = {
					[sound.key]: {
						audioKey: sound.audioKey,
						playTime: sound.playTime,
						volumeMulitplier: sound.volumeMulitplier,
						timePlaying: 0,
						requestPlay: false,
						playing: false,
					},
				};
			}
		});
	}
}
