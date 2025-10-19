interface VoiceCommand {
  action: 'search' | 'add_to_cart' | 'checkout' | 'navigate' | 'unknown';
  params?: Record<string, any>;
  text: string;
}

class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  isAvailable(): boolean {
    return this.recognition !== null && 'speechSynthesis' in window;
  }

  speak(text: string, lang: string = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synthesis.speak(utterance);
    });
  }

  listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  parseCommand(text: string): VoiceCommand {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('show')) {
      const storeName = this.extractStoreName(lowerText);
      return {
        action: 'search',
        params: { query: storeName || text },
        text,
      };
    }

    if (lowerText.includes('add') || lowerText.includes('buy')) {
      const items = this.extractItems(lowerText);
      return {
        action: 'add_to_cart',
        params: { items },
        text,
      };
    }

    if (lowerText.includes('checkout') || lowerText.includes('order') || lowerText.includes('complete')) {
      return {
        action: 'checkout',
        text,
      };
    }

    if (lowerText.includes('go to') || lowerText.includes('open') || lowerText.includes('navigate')) {
      const destination = this.extractDestination(lowerText);
      return {
        action: 'navigate',
        params: { destination },
        text,
      };
    }

    return {
      action: 'unknown',
      text,
    };
  }

  private extractStoreName(text: string): string | null {
    const stores = ['spar', 'choppies', 'shoprite', 'pick n pay', 'jumbo', 'trans', 'fours'];

    for (const store of stores) {
      if (text.includes(store)) {
        return store;
      }
    }

    return null;
  }

  private extractItems(text: string): string[] {
    const commonItems = ['milk', 'bread', 'eggs', 'butter', 'cheese', 'meat', 'chicken', 'rice', 'sugar', 'salt'];
    const found: string[] = [];

    for (const item of commonItems) {
      if (text.includes(item)) {
        found.push(item);
      }
    }

    return found;
  }

  private extractDestination(text: string): string {
    if (text.includes('cart')) return 'cart';
    if (text.includes('home')) return 'home';
    if (text.includes('orders')) return 'orders';
    if (text.includes('tracking')) return 'tracking';
    return 'home';
  }
}

export const voiceService = new VoiceService();
