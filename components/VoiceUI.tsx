import React from 'react';
import { View, Button } from 'react-native';
import voiceService from '../services/voiceService'; // Adjusted path

export const VoiceUI = () => {
  const handleStart = () => {
    // CORRECTED: Pass a single object with callbacks
    voiceService.startCall({
      onConnect: () => console.log('Connected'),
      onDisconnect: () => console.log('Disconnected'),
      // CORRECTED: Added explicit type for audioData
      onAudioPlayback: (audioData: ArrayBuffer) => { 
        console.log('Received audio data of length:', audioData.byteLength);
      },
      onTranscriptUpdate: (text: string) => {
        console.log('Transcript:', text);
      },
    });
  };

  const handleStop = () => {
    voiceService.stopCall();
  };

  return (
    <View>
      <Button title="Start Voice" onPress={handleStart} />
      <Button title="Stop Voice" onPress={handleStop} />
    </View>
  );
};
