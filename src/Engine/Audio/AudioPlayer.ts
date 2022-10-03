export default class AudioPlayer {
	sound_effects: object;
	sound_effects_volume_multilpliers: object;
	songs: object;
	songs_volume_multilpliers: object;
	active: boolean; //set to true when user has interacted with document
	sound_effects_dir: string;
	songs_dir: string;

	constructor() {
		this.sound_effects_dir = "Assets/sounds/effects";
		this.songs_dir = "Assets/sounds/music";

		this.sound_effects = {};
		this.songs = {};
		this.sound_effects_volume_multilpliers = {};
		this.songs_volume_multilpliers = {};

		this.active = false;

		const sound_effect_files = [
			"damage_1.wav",
			"damage_2.wav",
			"explosion_1.wav",
			"explosion_2.wav",
			"jump_1.wav",
			"jump_2.wav",
			"rat_sound_1.wav",
			"pickup_1.wav",
			"pickup_2.wav",
			"power_up_1.wav",
			"spell_cast_1.mp3",
			"spell_cast_2.mp3",
			"spell_cast_3.wav",
			"spell_cast_4.wav",
			"spell_cast_5.wav",
			"old_wizard_speach_1.mp3",
			"victory_1.mp3",
			"enemy_death_1.wav",
			"sword_attack_1.mp3",
			"sword_attack_2.mp3",
			"sword_attack_3.mp3",
			"sword_attack_4.mp3",
			"defeat_1.mp3",
		];
		const sound_effect_volume_multilpliers_list = [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 5,
		];
		let count = 0;
		for (const file of sound_effect_files) {
			this.sound_effects[file.split(".")[0]] = new Audio(
				this.sound_effects_dir + "/" + file
			);
			this.sound_effects_volume_multilpliers[file.split(".")[0]] =
				sound_effect_volume_multilpliers_list[count];
			count++;
		}

		const song_files = [
			"main_theme_1.mp3",
			"main_theme_2.mp3",
			"main_theme_3.mp3",
			"main_theme_4.mp3",
			"main_theme_5.mp3",
			"main_theme_6.mp3",
			"boss_theme_1.mp3",
			"boss_theme_2.mp3",
			"boss_theme_3.mp3",
			"boss_theme_4.mp3",
			"boss_intro_1.mp3",
			"intro_1.mp3",
			"intro_2.wav",
			"shop_theme_1.mp3",
			"shop_theme_2.mp3",
		];
		const song_files_volume_multilpliers_list = [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		];
		count = 0;
		for (const file of song_files) {
			this.songs[file.split(".")[0]] = new Audio(this.songs_dir + "/" + file);
			this.songs_volume_multilpliers[file.split(".")[0]] =
				song_files_volume_multilpliers_list[count];
			count++;
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

	playAudio(key, loop, volumeMultiplier?) {
		if (!volumeMultiplier) {
			volumeMultiplier = 1;
		}
		if (this.sound_effects[key]) {
			this.sound_effects[key].loop = loop;
			this.active && this.sound_effects[key].play();
		} else if (this.songs[key]) {
			this.songs[key].loop = loop;
			this.active && this.songs[key].play();
		}
	}

	setAudioVolume(key, volume) {
		if (
			this.sound_effects[key] &&
			this.sound_effects_volume_multilpliers[key]
		) {
			this.sound_effects[key].volume = Math.min(
				volume * this.sound_effects_volume_multilpliers[key],
				1
			);
		} else if (this.songs[key] && this.songs_volume_multilpliers[key]) {
			this.songs[key].volume = Math.min(
				volume * this.songs_volume_multilpliers[key],
				1
			);
		}
	}

	setMusicVolume(volume: number) {
		Object.keys(this.songs).forEach((key) => {
			this.songs[key].volume = Math.min(
				volume * this.songs_volume_multilpliers[key],
				1
			);
		});
	}

	setSoundEffectVolume(volume: number) {
		Object.keys(this.sound_effects).forEach((key) => {
			this.sound_effects[key].volume = Math.min(
				volume * this.sound_effects_volume_multilpliers[key],
				1
			);
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
		Object.keys(this.songs).forEach((key) => {
			this.songs[key].pause();
			this.songs[key].currentTime = 0;
		});

		Object.keys(this.sound_effects).forEach((key) => {
			this.sound_effects[key].pause();
			this.sound_effects[key].currentTime = 0;
		});
	}
}
