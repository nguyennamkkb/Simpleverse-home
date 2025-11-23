import { useState, useRef, useEffect } from 'react';

export const useVoiceTools = () => {
    // Speech Recognition (Voice → Text)
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [recognitionError, setRecognitionError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Text-to-Speech (Text → Voice)
    const [textToSpeak, setTextToSpeak] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);

    // Check browser support
    const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);
    const [isSynthesisSupported, setIsSynthesisSupported] = useState(true);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsRecognitionSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN'; // Vietnamese by default

        recognition.onresult = (event: any) => {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalText += transcript + ' ';
                } else {
                    interimText += transcript;
                }
            }

            if (finalText) {
                setTranscript(prev => prev + finalText);
            }
            setInterimTranscript(interimText);
        };

        recognition.onerror = (event: any) => {
            setRecognitionError(`Error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;
    }, []);

    // Initialize Text-to-Speech voices
    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setIsSynthesisSupported(false);
            return;
        }

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set default voice (prefer Vietnamese or first available)
            const vietnameseVoice = availableVoices.find(v => v.lang.startsWith('vi'));
            setSelectedVoice(vietnameseVoice || availableVoices[0] || null);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // Speech Recognition Controls
    const startListening = () => {
        if (!recognitionRef.current) return;

        setRecognitionError(null);
        setIsListening(true);
        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (!recognitionRef.current) return;

        recognitionRef.current.stop();
        setIsListening(false);
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
        setRecognitionError(null);
    };

    const changeLanguage = (lang: string) => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = lang;
        }
    };

    // Text-to-Speech Controls
    const speak = () => {
        if (!isSynthesisSupported || !textToSpeak) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const pauseSpeaking = () => {
        window.speechSynthesis.pause();
    };

    const resumeSpeaking = () => {
        window.speechSynthesis.resume();
    };

    const copyTranscript = async () => {
        try {
            await navigator.clipboard.writeText(transcript);
            return true;
        } catch (error) {
            return false;
        }
    };

    const loadSampleText = () => {
        setTextToSpeak('Xin chào! Đây là công cụ chuyển văn bản thành giọng nói. Bạn có thể điều chỉnh tốc độ, cao độ và âm lượng để tùy chỉnh giọng đọc theo ý muốn.');
    };

    return {
        // Recognition
        isListening,
        transcript,
        interimTranscript,
        recognitionError,
        isRecognitionSupported,
        startListening,
        stopListening,
        clearTranscript,
        changeLanguage,
        copyTranscript,

        // Synthesis
        textToSpeak,
        setTextToSpeak,
        isSpeaking,
        voices,
        selectedVoice,
        setSelectedVoice,
        rate,
        setRate,
        pitch,
        setPitch,
        volume,
        setVolume,
        isSynthesisSupported,
        speak,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        loadSampleText
    };
};
