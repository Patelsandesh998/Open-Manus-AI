import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShiningStars } from './ShiningStars';
import { X, Mic, AlertCircle, Keyboard } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onTranscript }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setError(null);
      setPermissionDenied(false);
      setTranscript('');
      setUseTextInput(false);
      setIsListening(false);
      return;
    }

    // If user chose text input, skip voice initialization
    if (useTextInput) {
      return;
    }

    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    let shouldRestart = true;

    const initializeVoice = async () => {
      try {
        // Request microphone permission first
        await setupAudioVisualization();

        // Only start speech recognition after mic permission is granted
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          if (event.error === 'not-allowed') {
            setPermissionDenied(true);
            setError('Microphone access was denied. Please allow microphone access in your browser settings.');
            shouldRestart = false;
          } else if (event.error === 'no-speech') {
            // Don't show error for no-speech, just continue listening
            return;
          } else if (event.error === 'network') {
            setError('Network error. Please check your internet connection.');
          } else if (event.error === 'aborted') {
            // Recognition was aborted, don't show error
            shouldRestart = false;
            return;
          } else {
            setError(`Error: ${event.error}. Please try again.`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Only restart if modal is still open and we should restart
          if (shouldRestart && isOpen) {
            try {
              setTimeout(() => {
                if (isOpen && shouldRestart) {
                  recognition.start();
                }
              }, 100);
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }
        };

        recognitionRef.current = recognition;
        
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to start recognition:', e);
          setError('Failed to start voice recognition. Please try again.');
        }
      } catch (err) {
        console.error('Failed to initialize voice:', err);
      }
    };

    initializeVoice();

    return () => {
      shouldRestart = false;
      setIsListening(false);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
        recognitionRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.log('Error closing audio context:', e);
        }
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, useTextInput]);

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(1, average / 128)); // Normalize and cap to 0-1
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
      setError(null);
      setPermissionDenied(false);
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError') {
        setError('Microphone is being used by another application. Please close other apps using the microphone.');
      } else {
        setError('Failed to access microphone. Please check your browser settings.');
      }
      throw error;
    }
  };

  const handleClose = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (transcript.trim()) {
      onTranscript(transcript.trim());
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-3xl overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#3B82F6]">
                  {useTextInput || permissionDenied ? (
                    <Keyboard className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {useTextInput || permissionDenied ? 'Text Input' : 'Voice Input'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {useTextInput || permissionDenied 
                      ? 'Type your message' 
                      : (isListening ? 'Listening...' : 'Initializing...')
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Always show Nava AI Logo with ShiningStars */}
              <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                  animate={{
                    scale: isListening ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: isListening ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <ShiningStars size="large" count={20} />
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 mt-4"
                  animate={{
                    opacity: isListening ? [1, 0.5, 1] : 1
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isListening ? Infinity : 0
                  }}
                >
                  <span className="text-lg font-semibold">
                    Nava <span className="text-primary">ai</span>
                  </span>
                </motion.div>
              </div>

              {/* Error state - below sphere with less prominence */}
              {error && (
                <div className="mb-6 p-3 rounded-xl bg-muted/30 border border-border/30 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{error}</p>
                    {permissionDenied && (
                      <div className="text-xs text-muted-foreground/70 space-y-1 mt-2">
                        <p className="font-semibold">Quick fix:</p>
                        <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
                          <li>Click the lock icon (🔒) in your browser's address bar</li>
                          <li>Find "Microphone" and change to "Allow"</li>
                          <li>Refresh and try again, or use text input below</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status indicator - always show */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.div
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#3B82F6]"
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                    opacity: isListening ? [1, 0.6, 1] : 0.3
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isListening ? Infinity : 0
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {permissionDenied 
                    ? 'Microphone access needed - use text input below'
                    : isListening 
                      ? 'Listening to your voice...' 
                      : 'Preparing...'}
                </span>
              </div>

              {/* Transcript display / Text input - always show */}
              <div className="space-y-4">
                {(permissionDenied || useTextInput) && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Keyboard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Text Input Mode</span>
                  </div>
                )}
                
                {(permissionDenied || useTextInput) ? (
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full min-h-[120px] p-4 rounded-2xl bg-muted/30 border border-border/30 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    autoFocus
                  />
                ) : (
                  <div className="min-h-[120px] p-6 rounded-2xl bg-muted/30 border border-border/30">
                    {transcript ? (
                      <p className="text-lg leading-relaxed">{transcript}</p>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Start speaking to see your words appear here...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Instructions and actions */}
              <div className="mt-6 space-y-3">
                {/* Switch to text input button */}
                {!permissionDenied && !useTextInput && (
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setUseTextInput(true);
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                        }
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      Having trouble? Type instead
                    </button>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  {!permissionDenied && !useTextInput && (
                    <p>Click anywhere outside or press the close button to finish</p>
                  )}
                  {(permissionDenied || useTextInput) && (
                    <p>Click outside or close to save your text</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};