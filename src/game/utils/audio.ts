import { ZipArchive } from "@shortercode/webzip";

let audioZip: ZipArchive | undefined;

export function setAudioZip(zip: ZipArchive) {
  audioZip = zip;
}

/**
 * Plays an audio file from the zip archive.
 *
 * @param filename The name of the audio file to play. The file should be in the zip archive.
 * @param volume The volume level to play the audio at (0 to 1). Default is 1.
 */
export async function playAudio(filename: string, volume: number = 1) {
  if (!audioZip) {
    throw new Error("Audio zip archive is not set.");
  }

  const file = audioZip.get(filename);

  if (!file) {
    throw new Error(`Audio file ${filename} not found in zip archive.`);
  }

  const blob = await file.get_blob();

  console.log(`Playing audio: ${filename}`);

  try {
    const audio = new Audio(URL.createObjectURL(blob));
    console.log("volume", volume);
    audio.volume = volume;
    await new Promise<void>((resolve, reject) => {
      audio.addEventListener("canplay", () => {
        resolve();
      });
      audio.addEventListener("error", (e) => {
        console.error(`Error loading audio: ${e}`);
        reject(e);
      });
    });
    await audio.play();
    window.setTimeout(() => {
      audio.volume = volume;
    }, 10);
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audio.src);
    });
  } catch (error) {
    console.error(`Error playing audio: ${error}`);
  }
}
