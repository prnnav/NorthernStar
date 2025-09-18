// services/player.js
import { Audio } from "expo-av";

let sound = null;

export async function playSound(uri) {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync({ uri });
  sound = newSound;
  await sound.playAsync();
}

export async function stopSound() {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
}
