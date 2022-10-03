import { Component, ComponentTypeEnum } from "./Component.js";
export var AudioTypeEnum;
(function (AudioTypeEnum) {
    AudioTypeEnum[AudioTypeEnum["DAMAGE"] = 0] = "DAMAGE";
    AudioTypeEnum[AudioTypeEnum["SHOOT"] = 1] = "SHOOT";
    AudioTypeEnum[AudioTypeEnum["POLYMORPH"] = 2] = "POLYMORPH";
    AudioTypeEnum[AudioTypeEnum["DEATH"] = 3] = "DEATH";
    AudioTypeEnum[AudioTypeEnum["VICTORY"] = 4] = "VICTORY";
})(AudioTypeEnum || (AudioTypeEnum = {}));
export default class AudioComponent extends Component {
    sounds;
    constructor(sounds) {
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
            }
            else {
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
//# sourceMappingURL=AudioComponent.js.map