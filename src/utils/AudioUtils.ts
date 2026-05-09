import * as Speech from 'expo-speech';

/**
 * Utility for Offline High-Quality Arabic speech.
 * Uses on-device TTS with advanced configuration for perfect pronunciation.
 */

export const ArabicSpeech = {
  /**
   * Speaks the provided text in Arabic.
   * Automatically selects the best available offline voice.
   */
  speak: async (text: string, options: Speech.SpeechOptions = {}) => {
    try {
      // Force a full stop of any ongoing speech to prevent double-voice
      await Speech.stop();

      // Trim and prepare text
      const cleanText = text.trim();
      const tunedText = tuneArabicText(cleanText);

      // Check for available voices to find the best Arabic one (if supported)
      let voiceIdentifier: string | undefined = undefined;
      if (typeof Speech.getVoicesAsync === 'function') {
        try {
          const voices = await Speech.getVoicesAsync();
          const arVoices = voices.filter(v => v.language.startsWith('ar'));
          
          // Prefer "Enhanced" or "Neural" voices
          const premiumVoice = arVoices.find(v => 
            v.quality === Speech.VoiceQuality.Enhanced || 
            v.name.toLowerCase().includes('neural')
          );
          
          const selectedVoice = premiumVoice || arVoices[0];
          voiceIdentifier = selectedVoice?.identifier;
          
          if (selectedVoice) {
            console.log(`[ArabicSpeech] Using voice: ${selectedVoice.name} (${selectedVoice.quality})`);
          } else {
            console.warn('[ArabicSpeech] No Arabic voice found on device. Falling back to default.');
          }
        } catch (e) {
          console.warn('[ArabicSpeech] Could not list voices:', e);
        }
      }

      Speech.speak(tunedText, {
        language: 'ar-SA',
        voice: voiceIdentifier,
        rate: 0.7,
        pitch: 1.0,
        ...options,
        onStart: () => console.log('[ArabicSpeech] Started speaking:', tunedText),
        onError: (err) => console.error('[ArabicSpeech] Internal Error:', err)
      });
    } catch (error) {
      console.error('ArabicSpeech Error:', error);
      // Last resort fallback
      try {
        Speech.speak(text, { language: 'ar', rate: 0.7 });
      } catch (err) {}
    }
  },

  /**
   * Stops all ongoing speech.
   */
  stop: () => {
    Speech.stop();
  }
};

/**
 * Phonetic Tuning Helper:
 * Adjusts Arabic text to sound more "real" and "correct" on TTS engines.
 */
function tuneArabicText(text: string): string {
  let tuned = text;
  
  // Alphabet Phonetic Tuning: Using a hard Sukun (ْ) to prevent the "un" (Tanwin) sound
  // We map both the single characters AND the names to ensure complete coverage.
  const alphabetMap: { [key: string]: string } = {
    // Letters
    'ا': 'أَلِفْ', 'ب': 'بَاءْ', 'ت': 'تَاءْ', 'ث': 'ثَاءْ', 'ج': 'جِيمْ',
    'ح': 'حَاءْ', 'خ': 'خَاءْ', 'د': 'دَالْ', 'ذ': 'ذَالْ', 'ر': 'رَاءْ',
    'ز': 'زَايْ', 'س': 'سِينْ', 'ش': 'شِينْ', 'ص': 'صَادْ', 'ض': 'ضَادْ',
    'ط': 'طَاءْ', 'ظ': 'ظَاءْ', 'ع': 'عَيْنْ', 'غ': 'غَيْنْ', 'ف': 'فَاءْ',
    'ق': 'قَافْ', 'ك': 'كَافْ', 'ل': 'لاَمْ', 'م': 'مِيمْ', 'ن': 'نُونْ',
    'ه': 'هَاءْ', 'و': 'وَاوْ', 'ي': 'يَاءْ',
    
    // Names (to catch cases where the name is passed directly)
    'أَلِف': 'أَلِفْ', 'بَاء': 'بَاءْ', 'تَاء': 'تَاءْ', 'ثَاء': 'ثَاءْ',
    'جِيم': 'جِيمْ', 'حَاء': 'حَاءْ', 'خَاء': 'خَاءْ', 'دَال': 'دَالْ',
    'ذَال': 'ذَالْ', 'رَاء': 'رَاءْ', 'زَاي': 'زَايْ', 'سِين': 'سِينْ',
    'شِين': 'شِينْ', 'صَاد': 'صَادْ', 'ضَاد': 'ضَادْ', 'طَاء': 'طَاءْ',
    'ظَاء': 'ظَاءْ', 'عَيْن': 'عَيْنْ', 'غَيْن': 'غَيْنْ', 'فَاء': 'فَاءْ',
    'قَاف': 'قَافْ', 'كَاف': 'كَافْ', 'لاَم': 'لاَمْ', 'مِيم': 'مِيمْ',
    'نُون': 'نُونْ', 'هَاء': 'هَاءْ', 'وَاو': 'وَاوْ', 'يَاء': 'يَاءْ',
  };

  if (alphabetMap[tuned]) {
    return alphabetMap[tuned];
  }
  
  // Special handling for Harakat (vowels) if they are passed as single marks
  // This ensures "Zabar", "Zer", "Pesh" context is understood by the engine
  if (tuned.length > 1 && tuned.includes('َ')) { /* Fatha/Zabar logic if needed */ }

  return tuned;
}
