export const speakPlate = (text: string) => {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create a spaced out version for clearer reading of numbers/letters
  // e.g., "京A88888" -> "京 A 8 8 8 8 8"
  // This helps TTS engines distinct characters better.
  const spacedText = text.split('').join(' ');
  const announcement = `识别成功: ${spacedText}`;

  const utterance = new SpeechSynthesisUtterance(announcement);
  
  // Try to find a Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh-HK' || v.lang === 'zh-TW');
  
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }
  
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

// Pre-load voices (Chrome sometimes needs this)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
}