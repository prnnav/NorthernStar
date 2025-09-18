import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Bot, Clock, Calendar, Heart, MessageCircle, Brain, Zap, Star, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckIns() {
  const predictedCall = {
    id: 'next-call',
    type: 'Motivation',
    time: '2 hours',
    confidence: 85,
    avatar: 'Luna',
    description: 'Based on your recent activity, you might benefit from a motivational check-in'
  };

  const callHistory = [
    {
      id: '1',
      type: 'Motivation',
      avatar: 'Luna',
      date: '2 hours ago',
      duration: '12 min',
      mood: 'Inspired',
      summary: 'Discussed goal-setting strategies and upcoming challenges',
      tags: ['goal-setting', 'motivation', 'planning'],
      color: ['#8b5cf6', '#a855f7']
    },
    {
      id: '2',
      type: 'Storytime',
      avatar: 'Sage',
      date: 'Yesterday',
      duration: '18 min',
      mood: 'Calm',
      summary: 'Shared wisdom through ancient parables about patience and growth',
      tags: ['wisdom', 'stories', 'patience'],
      color: ['#3b82f6', '#06b6d4']
    },
    {
      id: '3',
      type: 'Wellness',
      avatar: 'Aria',
      date: '2 days ago',
      duration: '15 min',
      mood: 'Refreshed',
      summary: 'Guided breathing exercises and mindfulness techniques',
      tags: ['breathing', 'mindfulness', 'wellness'],
      color: ['#10b981', '#059669']
    },
    {
      id: '4',
      type: 'Motivation',
      avatar: 'Luna',
      date: '3 days ago',
      duration: '20 min',
      mood: 'Energized',
      summary: 'Celebrated recent achievements and planned next steps',
      tags: ['celebration', 'achievement', 'planning'],
      color: ['#8b5cf6', '#a855f7']
    }
  ];

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'Motivation': return Brain;
      case 'Storytime': return MessageCircle;
      case 'Wellness': return Heart;
      default: return Bot;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'inspired': return '#8b5cf6';
      case 'calm': return '#3b82f6';
      case 'refreshed': return '#10b981';
      case 'energized': return '#f59e0b';
      default: return '#f6e05e';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#f6e05e', '#fbbf24']}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Bot size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>AI Companion Calls</Text>
          <Text style={styles.headerSubtitle}>Predictive check-ins with your magical AI guides</Text>
        </View>

        {/* Predicted Next Call */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.predictedCallCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.predictedCallHeader}>
              <View style={styles.predictedCallLeft}>
                <Clock size={24} color="#f6e05e" />
                <View>
                  <Text style={styles.predictedCallTitle}>Predicted Next Call</Text>
                  <Text style={styles.predictedCallDescription}>{predictedCall.description}</Text>
                </View>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{predictedCall.confidence}% confidence</Text>
              </View>
              <Sparkles size={32} color="#f6e05e" style={styles.sparkleIcon} />
            </View>

            <View style={styles.predictedCallContent}>
              <View style={styles.predictedCallInfo}>
                <LinearGradient
                  colors={['#8b5cf6', '#a855f7']}
                  style={styles.callTypeIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Brain size={32} color="white" />
                </LinearGradient>
                <View>
                  <Text style={styles.callTypeName}>{predictedCall.type} Session</Text>
                  <Text style={styles.callAvatar}>with {predictedCall.avatar}</Text>
                  <Text style={styles.callTime}>In {predictedCall.time}</Text>
                </View>
              </View>

              <View style={styles.predictedCallActions}>
                <TouchableOpacity style={styles.updateButton}>
                  <Zap size={16} color="#f6e05e" />
                  <Text style={styles.updateButtonText}>Update Prediction</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#f6e05e', '#fbbf24']}
                    style={styles.callNowButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Phone size={16} color="#1a202c" />
                    <Text style={styles.callNowButtonText}>Call Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Call History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent AI Check-ins</Text>
          <View style={styles.historyList}>
            {callHistory.map((call) => {
              const IconComponent = getCallTypeIcon(call.type);
              return (
                <TouchableOpacity key={call.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyLeft}>
                      <LinearGradient
                        colors={call.color}
                        style={styles.historyIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconComponent size={24} color="white" />
                      </LinearGradient>
                      <View>
                        <View style={styles.historyTitleRow}>
                          <Text style={styles.historyTitle}>{call.type} Session</Text>
                          <View style={[styles.moodBadge, { backgroundColor: getMoodColor(call.mood) + '20' }]}>
                            <Text style={[styles.moodText, { color: getMoodColor(call.mood) }]}>{call.mood}</Text>
                          </View>
                        </View>
                        <View style={styles.historyMetaRow}>
                          <Text style={styles.historyMeta}>with {call.avatar}</Text>
                          <View style={styles.metaDivider} />
                          <Calendar size={12} color="#a0aec0" />
                          <Text style={styles.historyMeta}>{call.date}</Text>
                          <View style={styles.metaDivider} />
                          <Clock size={12} color="#a0aec0" />
                          <Text style={styles.historyMeta}>{call.duration}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.historySummary}>{call.summary}</Text>

                  <View style={styles.historyTags}>
                    {call.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Call Insights */}
        <View style={styles.section}>
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Call Insights</Text>
            <Text style={styles.insightsSubtitle}>Your AI companion patterns and preferences</Text>
            
            <View style={styles.insightsGrid}>
              <View style={styles.insightItem}>
                <Text style={styles.insightValue}>85%</Text>
                <Text style={styles.insightLabel}>Prediction Accuracy</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightValue}>16min</Text>
                <Text style={styles.insightLabel}>Average Call Length</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightValue}>Luna</Text>
                <Text style={styles.insightLabel}>Preferred AI Companion</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Magical Quote */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.quoteCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.quoteIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={24} color="#1a202c" />
            </LinearGradient>
            <Text style={styles.quoteText}>
              "In the depths of winter, I finally learned that within me there lay an invincible summer."
            </Text>
            <Text style={styles.quoteAuthor}>— Albert Camus</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  predictedCallCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  predictedCallHeader: {
    marginBottom: 20,
    position: 'relative',
  },
  predictedCallLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  predictedCallTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  predictedCallDescription: {
    fontSize: 16,
    color: '#a0aec0',
    lineHeight: 22,
  },
  confidenceBadge: {
    backgroundColor: '#f6e05e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  predictedCallContent: {
    gap: 20,
  },
  predictedCallInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  callTypeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 4,
  },
  callAvatar: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
  },
  callTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f6e05e',
  },
  predictedCallActions: {
    flexDirection: 'row',
    gap: 12,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  updateButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  callNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  callNowButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  historyHeader: {
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  moodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyMeta: {
    fontSize: 14,
    color: '#a0aec0',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#4a5568',
  },
  historySummary: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 12,
    lineHeight: 20,
  },
  historyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2d3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f6e05e',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  quoteCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#f7fafc',
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 12,
    lineHeight: 26,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#a0aec0',
  },
});