import { useState, useEffect } from 'react';
import { voiceService } from '@/services/voiceService';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface VoiceAssistantProps {
  onCommand?: (command: string, action: string, params?: any) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable(voiceService.isAvailable());
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await voiceService.speak('I am listening. Please speak your command.');

      const transcript = await voiceService.listen();
      setLastCommand(transcript);

      const command = voiceService.parseCommand(transcript);

      await voiceService.speak(`I heard: ${transcript}`);

      if (command.action === 'unknown') {
        await voiceService.speak('I did not understand that command. Please try again.');
        toast.error('Command not recognized');
      } else {
        onCommand?.(transcript, command.action, command.params);
      }

    } catch (error: any) {
      console.error('Voice error:', error);
      toast.error('Voice recognition failed. Please try again.');
    } finally {
      setIsListening(false);
    }
  };


  if (!isAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-primary-100 p-6 max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎤</span>
          </div>
          <div>
            <h3 className="font-bold text-primary-900 text-lg">Voice Assistant</h3>
            <p className="text-sm text-gray-600">
              {isListening ? '🔴 Listening...' : '✓ Ready to help'}
            </p>
          </div>
        </div>

        {lastCommand && (
          <div className="mb-4 p-3 bg-primary-50 border border-primary-100 rounded-xl text-sm">
            <span className="font-semibold text-primary-900">Last command: </span>
            <span className="text-gray-700">{lastCommand}</span>
          </div>
        )}

        <Button
          onClick={startListening}
          disabled={isListening}
          fullWidth
          size="lg"
          className="shadow-lg"
        >
          {isListening ? '🎤 Listening...' : '🎤 Start Voice Command'}
        </Button>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="font-semibold text-xs text-gray-700 mb-2">Try saying:</p>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-primary-600">•</span>
              <span>"Find Choppies"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600">•</span>
              <span>"Add milk and bread"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-600">•</span>
              <span>"Go to checkout"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
