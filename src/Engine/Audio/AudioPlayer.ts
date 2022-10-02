export default class AudioPlayer {
	sound_effects: object;
	songs: object;
	active: boolean; //set to true when user has interacted with document
	sound_effects_dir: string;
	songs_dir: string;

	constructor() {
		this.sound_effects_dir = "Assets/sounds/effects";
		this.songs_dir = "Assets/sounds/music";

		this.sound_effects = {};
		this.songs = {};

		this.active = false;

		const sound_effect_files = [
			"damage_1.wav",
			"explosion_1.wav",
			"jump_1.wav",
			"old_wizard_speach_1.mp3",
			"pickup_2.wav",
			"rat_sound_1.wav",
			"spell_cast_2.mp3",
			"spell_cast_4.wav",
			"sword_attack_1.mp3",
			"sword_attack_3.mp3",
			"damage_2.wav",
			"explosion_2.wav",
			"jump_2.wav",
			"pickup_1.wav",
			"power_up_1.wav",
			"spell_cast_1.mp3",
			"spell_cast_3.wav",
			"spell_cast_5.wav",
			"sword_attack_2.mp3",
			"sword_attack_4.mp3",
		];
		for (const file of sound_effect_files) {
			this.sound_effects[file.split(".")[0]] = new Audio(
				this.sound_effects_dir + "/" + file
			);
		}

		const song_files = [
			"boss_intro_1.mp3",
			"boss_theme_2.mp3",
			"boss_theme_4.mp3",
			"intro_1.mp3",
			"intro_2.wav",
			"main_theme_2.mp3",
			"main_theme_4.mp3",
			"main_theme_6.mp3",
			"shop_theme_2.mp3",
			"boss_theme_1.mp3",
			"boss_theme_3.mp3",
			"defeat_1.mp3",
			"intro_1.wav",
			"main_theme_1.mp3",
			"main_theme_3.mp3",
			"main_theme_5.mp3",
			"shop_theme_1.mp3",
			"victory_1.mp3",
		];
		for (const file of song_files) {
			this.songs[file.split(".")[0]] = new Audio(this.songs_dir + "/" + file);
		}

		for (let sound in this.sound_effects) {
			this.sound_effects[sound].preload = "auto";
		}
		for (let sound in this.songs) {
			this.songs[sound].preload = "auto";
		}

		this.setMusicVolume(0.1);
		this.setSoundEffectVolume(0.1);
	}

	playAudio(key, loop) {
		if (this.sound_effects[key]) {
			this.sound_effects[key].loop = loop;
			this.active && this.sound_effects[key].play();
		} else if (this.songs[key]) {
			this.songs[key].loop = loop;
			this.active && this.songs[key].play();
		}
	}

	setAudioVolume(key, volume) {
		if (this.sound_effects[key]) {
			this.sound_effects[key].volume = volume;
		} else if (this.songs[key]) {
			this.songs[key].volume = volume;
		}
	}

	setMusicVolume(volume: number) {
		Object.values(this.songs).forEach((song) => {
			song.volume = volume;
		});
	}

	setSoundEffectVolume(volume: number) {
		Object.values(this.sound_effects).forEach((soundEffect) => {
			soundEffect.volume = volume;
		});
	}

	setAudioTime(key, time) {
		if (this.sound_effects[key]) {
			this.sound_effects[key].currentTime = time;
		} else if (this.songs[key]) {
			this.songs[key].currentTime = time;
		}
	}

	pauseAudio(key) {
		if (this.sound_effects[key]) {
			this.sound_effects[key].pause();
		} else if (this.songs[key]) {
			this.songs[key].pause();
		}
	}

	stopAll() {
		// for(const s of Object.values(this.sounds)) {
		//     const playPromise = s.play();
		//     playPromise.then(() => {
		//         s.pause();
		//         s.currentTime = 0.0;
		//     })
		// }
	}
}
