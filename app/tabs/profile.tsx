import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, TrendingUp, Calendar, Heart, Brain, Target, Star, Save, Award, Clock, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Mason',
    email: 'mason@example.com',
    bio: 'On a journey of self-discovery and wellness. Passionate about mindfulness and personal growth.',
    timezone: 'America/New_York',
    preferences: {
      aiCallsEnabled: true,
      humanCallsEnabled: true,
      videoCallsEnabled: true,
      emailNotifications: true,
      pushNotifications: true
    }
  });

  const emotionalTimeline = [
    { date: '2024-01-01', mood: 0.6, energy: 0.7, stress: 0.4 },
    { date: '2024-01-08', mood: 0.7, energy: 0.8, stress: 0.3 },
    { date: '2024-01-15', mood: 0.8, energy: 0.9, stress: 0.2 },
    { date: '2024-01-22', mood: 0.75, energy: 0.85, stress: 0.25 },
    { date: '2024-01-29', mood: 0.8, energy: 0.9, stress: 0.2 },
  ];

  const habitStats = {
    totalHabits: 3,
    activeStreak: 12,
    completionRate: 78,
    creditsEarned: 240
  };

  const achievements = [
    {
      id: 'first-week',
      title: 'First Steps',
      description: 'Completed your first session',
      unlocked: true,
      emoji: '🌟',
      date: '2 weeks ago'
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: '7 days in a row',
      unlocked: true,
      emoji: '🔥',
      date: '1 week ago'
    },
    {
      id: 'mindful-master',
      title: 'Mindful Master',
      description: '50 meditation sessions',
      unlocked: true,
      emoji: '🧘',
      date: '3 days ago'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Connected with 10 community members',
      unlocked: false,
      emoji: '🦋',
      date: null
    }
  ];

  const getCurrentMood = () => {
    return emotionalTimeline[emotionalTimeline.length - 1]?.mood || 0.75;
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 0.8) return '😊';
    if (mood >= 0.6) return '🙂';
    if (mood >= 0.4) return '😐';
    return '😔';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 0.8) return '#10b981';
    if (mood >= 0.6) return '#fbbf24';
    if (mood >= 0.4) return '#f97316';
    return '#ef4444';
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
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
            <User size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Your wellness journey and insights</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>Profile Information</Text>
            <Text style={styles.profileSubtitle}>Your basic account details</Text>

            <View style={styles.profileContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.name}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                  placeholderTextColor="#a0aec0"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.email}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  placeholderTextColor="#a0aec0"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={profile.bio}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#a0aec0"
                />
              </View>

              <TouchableOpacity>
                <LinearGradient
                  colors={['#f6e05e', '#fbbf24']}
                  style={styles.saveButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Save size={16} color="#1a202c" />
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Current Stats */}
        <View style={styles.section}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Current Status</Text>
            <Text style={styles.statsSubtitle}>Your wellness snapshot</Text>

            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <View style={styles.statRow}>
                  <Text style={styles.moodEmoji}>{getMoodEmoji(getCurrentMood())}</Text>
                  <Text style={styles.statLabel}>Current Mood</Text>
                  <Text style={[styles.statValue, { color: getMoodColor(getCurrentMood()) }]}>
                    {Math.round(getCurrentMood() * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statsGridItem}>
                  <Text style={styles.statsGridLabel}>Habit Streak</Text>
                  <Text style={styles.statsGridValue}>{habitStats.activeStreak} days</Text>
                </View>
                <View style={styles.statsGridItem}>
                  <Text style={styles.statsGridLabel}>Completion Rate</Text>
                  <Text style={styles.statsGridValue}>{habitStats.completionRate}%</Text>
                </View>
                <View style={styles.statsGridItem}>
                  <Text style={styles.statsGridLabel}>Credits Earned</Text>
                  <Text style={styles.statsGridValue}>{habitStats.creditsEarned}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Emotional Timeline */}
        <View style={styles.section}>
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <TrendingUp size={20} color="#f6e05e" />
              <Text style={styles.timelineTitle}>Emotional Timeline</Text>
            </View>
            <Text style={styles.timelineSubtitle}>Your wellness journey over time</Text>

            <View style={styles.timelineContent}>
              {emotionalTimeline.slice(-4).map((point, index) => (
                <View key={point.date} style={styles.timelineItem}>
                  <View style={styles.timelineItemHeader}>
                    <Text style={styles.timelineDate}>
                      {new Date(point.date).toLocaleDateString()}
                    </Text>
                    <View style={styles.timelineMetrics}>
                      <View style={styles.timelineMetric}>
                        <Heart size={12} color="#ef4444" />
                        <Text style={styles.timelineMetricText}>Mood: {Math.round(point.mood * 100)}%</Text>
                      </View>
                      <View style={styles.timelineMetric}>
                        <Star size={12} color="#fbbf24" />
                        <Text style={styles.timelineMetricText}>Energy: {Math.round(point.energy * 100)}%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressBars}>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarHeader}>
                        <Text style={styles.progressBarLabel}>Mood</Text>
                        <Text style={[styles.progressBarValue, { color: getMoodColor(point.mood) }]}>
                          {Math.round(point.mood * 100)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${point.mood * 100}%`,
                              backgroundColor: getMoodColor(point.mood)
                            }
                          ]} 
                        />
                      </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarHeader}>
                        <Text style={styles.progressBarLabel}>Energy</Text>
                        <Text style={[styles.progressBarValue, { color: '#fbbf24' }]}>
                          {Math.round(point.energy * 100)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${point.energy * 100}%`,
                              backgroundColor: '#fbbf24'
                            }
                          ]} 
                        />
                      </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarHeader}>
                        <Text style={styles.progressBarLabel}>Stress (inverted)</Text>
                        <Text style={[styles.progressBarValue, { color: '#10b981' }]}>
                          {Math.round((1 - point.stress) * 100)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${(1 - point.stress) * 100}%`,
                              backgroundColor: '#10b981'
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>

                  {index < emotionalTimeline.slice(-4).length - 1 && (
                    <View style={styles.timelineDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.achievementsCard}>
            <View style={styles.achievementsHeader}>
              <Award size={20} color="#f6e05e" />
              <Text style={styles.achievementsTitle}>Achievements</Text>
            </View>
            <Text style={styles.achievementsSubtitle}>Your wellness milestones</Text>

            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementItem,
                    achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                  ]}
                >
                  <Text style={[
                    styles.achievementEmoji,
                    !achievement.unlocked && styles.achievementEmojiLocked
                  ]}>
                    {achievement.emoji}
                  </Text>
                  <Text style={[
                    styles.achievementTitle,
                    { color: achievement.unlocked ? '#f6e05e' : '#4a5568' }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  {achievement.unlocked && achievement.date && (
                    <Text style={styles.achievementDate}>{achievement.date}</Text>
                  )}
                  {achievement.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedBadgeText}>Unlocked</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <View style={styles.preferencesCard}>
            <View style={styles.preferencesHeader}>
              <Settings size={20} color="#f6e05e" />
              <Text style={styles.preferencesTitle}>Preferences</Text>
            </View>
            <Text style={styles.preferencesSubtitle}>Customize your experience</Text>

            <View style={styles.preferencesContent}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>AI Check-in Calls</Text>
                  <Text style={styles.preferenceDescription}>Enable predictive AI companion calls</Text>
                </View>
                <Switch
                  value={profile.preferences.aiCallsEnabled}
                  onValueChange={(value) => handlePreferenceChange('aiCallsEnabled', value)}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={profile.preferences.aiCallsEnabled ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Human Support Calls</Text>
                  <Text style={styles.preferenceDescription}>Allow calls with human wellness professionals</Text>
                </View>
                <Switch
                  value={profile.preferences.humanCallsEnabled}
                  onValueChange={(value) => handlePreferenceChange('humanCallsEnabled', value)}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={profile.preferences.humanCallsEnabled ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Video Calls</Text>
                  <Text style={styles.preferenceDescription}>Enable video sessions (requires consent)</Text>
                </View>
                <Switch
                  value={profile.preferences.videoCallsEnabled}
                  onValueChange={(value) => handlePreferenceChange('videoCallsEnabled', value)}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={profile.preferences.videoCallsEnabled ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Email Notifications</Text>
                  <Text style={styles.preferenceDescription}>Receive wellness updates via email</Text>
                </View>
                <Switch
                  value={profile.preferences.emailNotifications}
                  onValueChange={(value) => handlePreferenceChange('emailNotifications', value)}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={profile.preferences.emailNotifications ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Push Notifications</Text>
                  <Text style={styles.preferenceDescription}>Receive real-time app notifications</Text>
                </View>
                <Switch
                  value={profile.preferences.pushNotifications}
                  onValueChange={(value) => handlePreferenceChange('pushNotifications', value)}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={profile.preferences.pushNotifications ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <TouchableOpacity>
                <LinearGradient
                  colors={['#2d3748', '#4a5568']}
                  style={styles.savePreferencesButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Save size={16} color="#f6e05e" />
                  <Text style={styles.savePreferencesButtonText}>Save Preferences</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
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
  profileCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  profileContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
  },
  textInput: {
    backgroundColor: '#2d3748',
    borderWidth: 1,
    borderColor: '#4a5568',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f7fafc',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  statsCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  statsContent: {
    gap: 16,
  },
  statItem: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodEmoji: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
    flex: 1,
    marginLeft: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsGridLabel: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
    textAlign: 'center',
  },
  statsGridValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f6e05e',
  },
  timelineCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  timelineContent: {
    gap: 24,
  },
  timelineItem: {
    gap: 16,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineDate: {
    fontSize: 14,
    color: '#a0aec0',
  },
  timelineMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineMetricText: {
    fontSize: 12,
    color: '#a0aec0',
  },
  progressBars: {
    gap: 12,
  },
  progressBarContainer: {
    gap: 4,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarLabel: {
    fontSize: 12,
    color: '#a0aec0',
  },
  progressBarValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2d3748',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timelineDivider: {
    height: 1,
    backgroundColor: '#2d3748',
  },
  achievementsCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  achievementItem: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  achievementUnlocked: {
    backgroundColor: '#f6e05e' + '10',
    borderWidth: 1,
    borderColor: '#f6e05e' + '30',
  },
  achievementLocked: {
    backgroundColor: '#2d3748' + '50',
    borderWidth: 1,
    borderColor: '#4a5568' + '50',
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementEmojiLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDate: {
    fontSize: 10,
    color: '#4a5568',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f6e05e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  preferencesCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  preferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  preferencesSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  preferencesContent: {
    gap: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#a0aec0',
  },
  savePreferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  savePreferencesButtonText: {
    fontSize: 16,
    color: '#f6e05e',
    fontWeight: '600',
  },
});