let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  const silence = new Audio("/Sounds/OriginalSendingSound.mp3");
  silence.volume = 0;
  silence.play().then(() => {
    audioUnlocked = true;
  }).catch(() => {});
}

export function InitializeSounds() {
  document.addEventListener("click", unlockAudio, { once: true });
}

export function SendingMessageSound() {
  if (!audioUnlocked) return;
  const audio = new Audio("/Sounds/OriginalSendingSound.mp3");
  audio.play().catch((err) => console.log("Sound error:", err));
}

export function ReceivingMessageSound() {
  if (!audioUnlocked) return;
  const audio = new Audio("/Sounds/MessageReceivingMessage.mp3");
  audio.play().catch((err) => console.log("Sound error:", err));
}