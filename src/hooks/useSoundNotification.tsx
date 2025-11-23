import { useState, useCallback, useRef } from 'react';

export const useSoundNotification = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundNotificationsEnabled');
    return saved === null ? true : saved === 'true';
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<number>(0);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('soundNotificationsEnabled', String(newValue));
      return newValue;
    });
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!isSoundEnabled) return;

    // Prevent playing sound too frequently (debounce 2 seconds)
    const now = Date.now();
    if (now - lastPlayedRef.current < 2000) return;
    lastPlayedRef.current = now;

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const currentTime = ctx.currentTime;

      // Create a pleasant two-tone notification sound
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // First tone - E5 (659.25 Hz)
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(659.25, currentTime);
      
      // Second tone - A5 (880 Hz)
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(880, currentTime);

      // Connect oscillators to gain node
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.3);

      // Play first tone
      oscillator1.start(currentTime);
      oscillator1.stop(currentTime + 0.15);

      // Play second tone slightly delayed
      oscillator2.start(currentTime + 0.1);
      oscillator2.stop(currentTime + 0.3);

    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [isSoundEnabled]);

  return {
    isSoundEnabled,
    toggleSound,
    playNotificationSound,
  };
};
