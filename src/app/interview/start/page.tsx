"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Remember to install uuid: npm install uuid
import { ArrowLeft, Mic, MicOff, Send, MessageCircle, User, Bot, Play, Square } from "lucide-react";
import Groq from "groq-sdk";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  surveyId: string;
}

export default function InterviewStartPage({ params }: { params?: { uuid?: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"userinfo" | "chat">("userinfo");
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: "",
    age: "",
    gender: "",
    surveyId: ""
  });
  const [session_id, setsession_id] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Handle URL parameter for surveyId
  useEffect(() => {
    const surveyId = params?.uuid || searchParams?.get('surveyId');
    if (surveyId) {
      setUserInfo(prev => ({ ...prev, surveyId }));
      sessionStorage.setItem('surveyId', surveyId);
    }
  }, [params?.uuid, searchParams]);

  // Scroll chat to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          sendAnswer(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Welcome + first question once user info form is submitted
  const startInterview = async () => {
    // Prepare payload
    const payload = {
      uuid: userInfo.surveyId,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender.toLowerCase(),
    };
  
    setIsProcessing(true);
    // TODO: change the link
    try {
      const res = await fetch(`https://e9555883258a.ngrok-free.app/api/surveys/${userInfo.surveyId}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to start interview");
  
      const data = await res.json();
  
      const sessionId = data.data?.ai_session?.session_id;
      const initialQuestion = data.data?.ai_session?.initial_response;
      const status = data.data?.ai_session?.status;
  
      if (!sessionId || !initialQuestion) {
        throw new Error("Invalid response from server");
      }
  
      sessionStorage.setItem("session_id", sessionId);
      setsession_id(sessionId);
  
      // Initialize chat messages
      // const welcome: Message = {
      //   id: "assistant-welcome",
      //   type: "assistant",
      //   content: "Hello!",
      //   timestamp: new Date(),
      // };
      const firstQuestion: Message = {
        id: `q-initial`,
        type: "assistant",
        content: initialQuestion,
        timestamp: new Date(),
      };
  
      setMessages([firstQuestion]);
      setStep("chat");
      speakText(firstQuestion.content);
  
    } catch (error) {
      console.error(error);
      alert("Failed to start interview. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  // TODO change the fetch url to the new one
  // Fetch next question from API, pass the user's previous answer
  const fetchNextQuestion = async (answer: string) => {
    if (!session_id || !userInfo.surveyId) {
      console.error("Missing session_id or surveyId");
      return;
    }
  
    setIsProcessing(true);
  
    // TODO: change the link
    try {
      const response = await fetch(`https://e9555883258a.ngrok-free.app/api/surveys/${userInfo.surveyId}/customers/${userInfo.surveyId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: answer }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch next question");
      }
      const data = await response.json();

      let question: string | undefined;
      let status: number | undefined;
      
      if (data.data?.ai_session) {
        // Initial response format
        question = data.data.ai_session.initial_response;
        status = data.data.ai_session.status;
      } else if (data.data?.ai_response) {
        // Follow-up chat response format
        question = data.data.ai_response.message;
        status = data.data.status;
      } else {
        throw new Error("Malformed response");
      }
      
      if (status === -1) {
        const endMsg: Message = {
          id: "end",
          type: "assistant",
          content: "That concludes our interview! Thank you for your time.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, endMsg]);
        speakText(endMsg.content);
        setIsProcessing(false);
        return;
      } else if (question) {
        // Show and play TTS for question
      }
  
      if (question) {
        setIsSpeaking(true);
        try {
          const ttsResponse = await fetch(
            "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
              },
              body: JSON.stringify({ text: question }),
            }
          );
  
          if (!ttsResponse.ok) throw new Error("TTS API error");
  
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
  
          await audio.play();
  
          const questionMessage: Message = {
            id: `q-${Date.now()}`,
            type: "assistant",
            content: question,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, questionMessage]);
  
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
        } catch (error) {
          console.error("TTS/Audio error:", error);
          setIsSpeaking(false);
          setMessages(prev => [
            ...prev,
            {
              id: `q-${Date.now()}`,
              type: "assistant",
              content: question,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: "error",
          type: "assistant",
          content: "Sorry, there was an error fetching the next question.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };
  

  const sendAnswer = (answer: string) => {
    if (!answer.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: answer.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    fetchNextQuestion(answer);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    try {
      const response = await fetch(
        "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token c3ff4a1fd93fb5adad42674253b99e07c5f86d58",
          },
          body: JSON.stringify({ text }),
        }
      );
      if (!response.ok) throw new Error("TTS API error");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.play();
    } catch (error) {
      console.error("TTS failed:", error);
      setIsSpeaking(false);
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      // Use webm format which is better supported by Deepgram
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Record in 100ms chunks for better quality
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Convert recorded audio to text using Deepgram
  const convertAudioToText = async (audioBlob: Blob): Promise<string> => {
    try {
      // Convert blob to array buffer for proper API call
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
        method: 'POST',
        headers: {
          'Authorization': 'Token c3ff4a1fd93fb5adad42674253b99e07c5f86d58',
          'Content-Type': 'audio/webm;codecs=opus',
        },
        body: arrayBuffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Deepgram API error:', response.status, errorText);
        throw new Error(`Speech-to-text conversion failed: ${response.status}`);
      }

      const result = await response.json();
      const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      console.log('Transcription result:', transcript);
      return transcript;
    } catch (error) {
      console.error('Error converting audio to text:', error);
      return '';
    }
  };

  // Handle sending recorded audio as answer
  const sendAudioAnswer = async () => {
    if (!recordedAudio) return;

    setIsProcessing(true);
    try {
      const transcript = await convertAudioToText(recordedAudio);
      if (transcript.trim()) {
        sendAnswer(transcript);
      } else {
        alert("Could not understand the audio. Please try again.");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing audio. Please try again.");
    } finally {
      setIsProcessing(false);
      setRecordedAudio(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer(inputText);
    }
  };

  if (step === "userinfo") {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
        <h1 className="text-white text-3xl mb-6 font-bold">Enter Your Details</h1>
        <form
          className="max-w-md w-full space-y-4"
          onSubmit={e => {
            e.preventDefault();
            if (userInfo.name && userInfo.age && userInfo.surveyId) {
              startInterview();
            }
          }}
        >
          <input
            type="text"
            placeholder="Name"
            value={userInfo.name}
            onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
            required
            className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="Age"
            value={userInfo.age}
            onChange={e => setUserInfo({ ...userInfo, age: e.target.value })}
            required
            min="1"
            max="120"
            className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-400"
          />
          <select
            value={userInfo.gender}
            onChange={e => setUserInfo({ ...userInfo, gender: e.target.value })}
            required
            className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-400"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Survey ID"
            value={userInfo.surveyId}
            onChange={e => setUserInfo({ ...userInfo, surveyId: e.target.value })}
            required
            className="w-full px-4 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-400"
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 py-2 rounded font-semibold hover:bg-cyan-600 transition"
          >
            Start Interview
          </button>
        </form>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Interview Session</h1>
          <p className="text-slate-400">
            Speak or type your responses — each question will play automatically.
          </p>
        </motion.div>

        {/* Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800 rounded-xl border border-slate-700 h-[600px] flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.type === "user" ? "bg-cyan-500" : "bg-slate-600"
                    }`}
                  >
                    {msg.type === "user" ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      msg.type === "user" ? "bg-cyan-500 text-black" : "bg-slate-700 text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700 rounded-lg px-4 py-3 flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                rows={2}
                disabled={isProcessing}
              />
              
              {/* Audio Recording Controls */}
              {!recordedAudio ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg transition-all ${
                    isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {isRecording ? <Square size={20} /> : <Play size={20} />}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendAudioAnswer}
                  disabled={isProcessing}
                  className="p-3 bg-gradient-to-r from-green-400 to-green-500 text-black rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </motion.button>
              )}

              {/* Text Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendAnswer(inputText)}
                disabled={!inputText.trim() || isProcessing}
                className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </motion.button>
            </div>

            <div className="flex justify-between mt-3 text-xs text-slate-400">
              <div className="flex gap-4">
                {isRecording && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Recording...
                  </span>
                )}
                {recordedAudio && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Audio ready to send
                  </span>
                )}
                {isSpeaking && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    Speaking...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} />
                <span>{messages.length} messages</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
