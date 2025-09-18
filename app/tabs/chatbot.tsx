import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Coins, Mic, Phone, PhoneOff, Send, Sparkles, Star, Video } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to NorthernStar! I'm Kali, your magical AI companion. How can I assist you on your wellness journey today? ✨",
      isUser: false,
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState<number>(150);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [transcript, setTranscript] = useState<string>("Kali is listening...");
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollingRef = useRef<number | null>(null);

  const quickActions = [
    { text: "Motivate Me", icon: Sparkles },
    { text: "Tell a Story", icon: Star },
    { text: "Remind Me", icon: Phone },
  ];

  // ---------- CONFIG - replace base URLs with your backend ----------
const HTTP_BASE = "http://192.168.0.103:5002"; // no https, it's http + correct port
const WS_BASE = "ws://192.168.0.103:5001";     // no wss, it's ws + correct port

  // -----------------------------------------------------------------

  // Fetch credits on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${HTTP_BASE}/api/credits/me`);
        if (!res.ok) throw new Error('Failed to fetch credits');
        const data = await res.json();
        if (isMounted && typeof data.balance === 'number') {
          setCredits(data.balance);
        }
      } catch (err) {
        // keep local default credits if backend unreachable
        console.warn('Credits fetch failed:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Scroll to bottom whenever messages/isTyping changes
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  // ---------- SEND MESSAGE (wired to backend) ----------
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    // Append user message immediately for snappy UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // POST to AI chat endpoint
      const res = await fetch(`${HTTP_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
      }

      const data = await res.json();
      // Expecting { reply: string } or { reply: string, suggestions: [...] }
      const aiText: string = data?.reply ?? "Kali couldn't form a reply right now — try again soon.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Optionally handle suggestions from API (not shown in UI currently)
    } catch (err) {
      console.error("Error fetching AI reply:", err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: "Hmm, I lost my magical connection 🌌. Try again?",
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick actions hook into sendMessage by setting input then sending
  const sendQuickAction = (action: string) => {
    setInputText(action);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // ---------- CALL FLOW ----------
  // Starts the call on backend and sets up transcript handling (WS or polling)
  const startCall = async (video: boolean) => {
    const cost = video ? 30 : 10;

    if (video && credits < 30) {
      alert('You need at least 30 credits for a video call with Kali.');
      return;
    }

    // Deduct immediately on UI for snappy UX (you can change to confirm after backend)
    if (video) {
      setCredits(prev => Math.max(0, prev - 30));
    } else {
      // voice cost optional to deduct; original code didn't deduct for voice, keep consistent
      // setCredits(prev => Math.max(0, prev - 10));
    }

    setIsVideoCall(video);
    setIsCallModalVisible(true);
    setTranscript("Kali is listening...");
    setWsConnected(false);

    try {
      // Start call on backend -> returns transcriptId, maybe callId
      const res = await fetch(`${HTTP_BASE}/api/call/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: video ? "video" : "voice" }),
      });

      if (!res.ok) {
        throw new Error(`Call start failed: ${res.status}`);
      }

      const data = await res.json();
      const id: string | undefined = data?.transcriptId ?? data?.callId;
      if (id) {
        setTranscriptId(id);
        // Try opening a websocket for live transcript
        openTranscriptSocket(id);
      } else {
        // fallback: no transcript id returned
        console.warn('No transcriptId returned from call/start');
        // Optionally we could poll with a call id or leave static
      }
    } catch (err) {
      console.error("Error starting call:", err);
      // Keep modal open even if backend failed so user can close it
    }
  };

  // End call: notify backend and optionally award credits (kept awarding +5 as original)
  const endCall = async () => {
    // Close WS/polling first
    closeTranscriptSocket();

    setIsCallModalVisible(false);
    setTranscriptId(null);
    // award 5 credits as in your original behavior
    setCredits(prev => prev + 5);

    try {
      await fetch(`${HTTP_BASE}/api/call/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endedAt: new Date().toISOString() /* optional */ }),
      });
    } catch (err) {
      console.error("Error ending call:", err);
    }
  };

  // ---------- Transcript handling: WebSocket + polling fallback ----------
  const openTranscriptSocket = (id: string) => {
    // Close existing first
    closeTranscriptSocket();

    try {
      // If your WS endpoint needs the transcript id appended, adapt accordingly:
      // e.g. `${WS_BASE}?transcriptId=${id}` or `${WS_BASE}/${id}`
      const wsUrl = `${WS_BASE}?transcriptId=${encodeURIComponent(id)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        // optional: send any auth/subscribe message if required
      };

      ws.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          // Expect { text: "...", partial?: true } or similar
          const text = parsed?.text ?? parsed?.transcript ?? evt.data;
          if (typeof text === 'string') setTranscript(text);
        } catch (e) {
          // if message isn't JSON, just use raw data
          setTranscript(evt.data);
        }
      };

      ws.onerror = (err) => {
        console.warn("Transcript WS error:", err);
        setWsConnected(false);
        // start polling as fallback
        startPollingTranscript(id);
      };

      ws.onclose = () => {
        setWsConnected(false);
        // start polling as fallback
        startPollingTranscript(id);
      };
    } catch (err) {
      console.error('Failed to open WS, starting polling fallback', err);
      startPollingTranscript(id);
    }
  };

  const closeTranscriptSocket = () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    } catch (e) {
      console.warn('Error closing ws', e);
    }
    setWsConnected(false);
    stopPollingTranscript();
  };

  const startPollingTranscript = (id: string) => {
    stopPollingTranscript();
    // poll every 3s
    const poll = async () => {
      try {
        const res = await fetch(`${HTTP_BASE}/api/call/transcript/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Transcript poll failed');
        const data = await res.json();
        if (data?.transcript) setTranscript(data.transcript);
      } catch (err) {
        console.warn('Transcript poll error', err);
      }
    };
    // run immediately then interval
    poll();
    // @ts-ignore setInterval return type
    pollingRef.current = setInterval(poll, 3000);
  };

  const stopPollingTranscript = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current as unknown as number);
      pollingRef.current = null;
    }
  };

  // cleanup WS/poll on unmount
  useEffect(() => {
    return () => {
      closeTranscriptSocket();
    };
  }, []);

  // ---------- UI (unchanged styles and structure) ----------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Star size={20} color="#f6e05e" />
          <Text style={styles.headerTitle}>AI Chat with Kali</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => startCall(false)}
          >
            <Phone size={16} color="#f6e05e" />
            <Text style={styles.callButtonText}>Voice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.callButton, credits < 30 && styles.disabledButton]}
            onPress={() => startCall(true)}
            disabled={credits < 30}
          >
            <Video size={16} color={credits >= 30 ? "#06b6d4" : "#4a5568"} />
            <Text style={[styles.callButtonText, credits < 30 && styles.disabledText]}>Video</Text>
            <Text style={[styles.creditsText, credits < 30 && styles.disabledText]}>30</Text>
            <Sparkles size={12} color={credits >= 30 ? "#06b6d4" : "#4a5568"} />
          </TouchableOpacity>
          
          <LinearGradient
            colors={['#f6e05e', '#fbbf24']}
            style={styles.creditsBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Coins size={16} color="#1a202c" />
            <Text style={styles.creditsValue}>{credits}</Text>
            <Sparkles size={12} color="#1a202c" />
          </LinearGradient>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageRow, message.isUser && styles.userMessageRow]}
          >
            <View style={styles.avatarContainer}>
              {message.isUser ? (
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>You</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['#f6e05e', '#fbbf24']}
                  style={styles.aiAvatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Star size={16} color="#1a202c" />
                </LinearGradient>
              )}
            </View>
            
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.messageRow}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#f6e05e', '#fbbf24']}
                style={styles.aiAvatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Star size={16} color="#1a202c" />
              </LinearGradient>
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>Kali is weaving magic</Text>
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {/* Quick Actions */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsContainer}
        >
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={action.text}
                style={styles.quickActionButton}
                onPress={() => sendQuickAction(action.text)}
              >
                <IconComponent size={16} color="#f6e05e" />
                <Text style={styles.quickActionText}>{action.text}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Share your thoughts with Kali..."
            placeholderTextColor="#a0aec0"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={!inputText.trim() ? ['#4a5568', '#2d3748'] : ['#f6e05e', '#fbbf24']}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Send size={20} color={!inputText.trim() ? "#a0aec0" : "#1a202c"} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Call Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCallModalVisible}
        onRequestClose={endCall}
      >
        <View style={styles.callModalOverlay}>
          <View style={styles.callModalContent}>
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.callAvatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={32} color="#1a202c" />
            </LinearGradient>
            
            <Text style={styles.callTitle}>Kali AI</Text>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>
                {isVideoCall ? "Video Call" : "Voice Call"}
              </Text>
              <Sparkles size={16} color="#f6e05e" />
            </View>
            
            {isVideoCall && (
              <View style={styles.videoFeed}>
                <Star size={48} color="#f6e05e" />
                <Text style={styles.videoText}>Kali's magical presence</Text>
              </View>
            )}
            
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptTitle}>Live Transcript:</Text>
              <View style={styles.transcriptBox}>
                <Sparkles size={16} color="#f6e05e" />
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
            </View>
            
            <View style={styles.callControls}>
              <TouchableOpacity style={styles.callControlButton}>
                <Mic size={20} color="#f7fafc" />
              </TouchableOpacity>
              
              {isVideoCall && (
                <TouchableOpacity style={styles.callControlButton}>
                  <Video size={20} color="#f7fafc" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.callControlButton, styles.endCallButton]}
                onPress={endCall}
              >
                <PhoneOff size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
    gap: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  callButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  disabledText: {
    color: '#4a5568',
  },
  creditsText: {
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: '600',
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  creditsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginTop: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0891b2',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#06b6d4',
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: '#1a202c',
    borderWidth: 1,
    borderColor: '#f6e05e',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#f7fafc',
  },
  typingBubble: {
    backgroundColor: '#1a202c',
    borderWidth: 1,
    borderColor: '#f6e05e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#a0aec0',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f6e05e',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d3748',
  },
  quickActionsContainer: {
    marginBottom: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2d3748',
    gap: 6,
  },
  quickActionText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#1a202c',
    borderWidth: 1,
    borderColor: '#2d3748',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f7fafc',
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  callModalContent: {
    backgroundColor: '#1a202c',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  callAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#f59e0b',
  },
  callTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6e05e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
    gap: 6,
  },
  callBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  videoFeed: {
    width: '100%',
    height: 200,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  videoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
  },
  transcriptContainer: {
    width: '100%',
    marginBottom: 24,
  },
  transcriptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 8,
  },
  transcriptBox: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transcriptText: {
    fontSize: 14,
    color: '#a0aec0',
    fontStyle: 'italic',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  callControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2d3748',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a5568',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
});
