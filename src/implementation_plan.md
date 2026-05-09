# Implementation Plan: Offline High-Quality Arabic Voice System

## Goal
Provide a **perfectly pronounced**, **offline** Arabic voice for all app content (Qaida, Duas, etc.) without increasing app size through large audio downloads.

## 1. Core Technology: Optimized On-Device TTS
We will use the device's native speech engine (`expo-speech`) but with advanced configuration to ensure it uses the highest-quality Arabic voice available offline.

### A. System Voice Optimization
- **Locale Selection**: Default to `ar-SA` (Saudi Arabia) as it provides the most standard and clear pronunciation for educational content.
- **Voice Selection**: We will implement a "Voice Discovery" logic that scans all available system voices and automatically selects the one with the highest quality (e.g., "Enhanced" or "Neural" voices provided by Google/Apple).

### B. Offline Reliability
- **Initialization Check**: At app startup, the system will check if an Arabic voice is installed.
- **User Guidance**: If no Arabic voice is found, the app will show a simple, one-time popup guiding the user to "Enable Arabic Voice" in their system settings (a generic 10-second task) which downloads the voice data to the device (not the app).

## 2. Addressing "Perfect Pronunciation"
To ensure the Qaida (Alphabet) sounds perfect:
- **Phonetic Tuning**: For tricky letters or syllables (e.g., Alif-Zabar-A), we will use phonetic spelling hints in the background to guide the TTS engine toward the exact pronunciation.
- **Dynamic Construction**: We will build strings that the TTS engine understands best for Quranic/Classical Arabic.

## 3. Benefits of this Plan
- **100% Offline**: Works in villages, travel, or areas with no internet.
- **Zero App Bloat**: No MP3s or large assets added to the `.ipa` or `.apk`. The app stays under 10MB.
- **Real Voice**: Modern phones (Android 10+, iOS 13+) come with very high-quality "Neural" voices that sound like real people once enabled.

## 4. Next Steps
1. **[Wait for User Approval]** of this Offline plan.
2. Modify `AudioUtils.ts` to implement the Voice Discovery and Selection logic.
3. Add a "Speech Settings" helper to detect and guide the user if the voice is missing.
4. Test pronunciation specifically for the Arabic Alphabet (Qaida) using phonetic tuning.
