import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class AudioSystem extends System {
    audio;
    constructor(audio) {
        super([ComponentTypeEnum.AUDIO]);
        this.audio = audio;
    }
    update(dt) {
        this.audio.playAudio("main_theme_2", true);
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const audioComp = e.getComponent(ComponentTypeEnum.AUDIO);
            Object.keys(audioComp.sounds).forEach((soundKey) => {
                const soundValue = audioComp.sounds[soundKey];
                if (soundValue.playing) {
                    soundValue.timePlaying += dt;
                }
                //Sound is done playing, stop it
                if (soundValue.timePlaying > soundValue.playTime) {
                    this.audio.pauseAudio(soundValue.audioKey);
                    this.audio.setAudioTime(soundValue.audioKey, 0.0);
                    soundValue.timePlaying = 0;
                    soundValue.playing = false;
                    return;
                }
                //sound is requested to play and is not already playing, play it
                if (soundValue.requestPlay && !soundValue.playing) {
                    this.audio.playAudio(soundValue.audioKey, false, soundValue.volumeMulitplier);
                    soundValue.requestPlay = false;
                    soundValue.playing = true;
                }
            });
        });
    }
}
//# sourceMappingURL=AudioSystem.js.map