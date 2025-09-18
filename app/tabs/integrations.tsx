import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Watch, Activity, Heart, TrendingUp, Zap, CircleCheck as CheckCircle, Waves, Star, ChartBar as BarChart3, Sparkles, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BiometricData {
  currentMood: number;
  heartRate: {
    current: number;
    resting: number;
    max: number;
  };
  hrv: {
    current: number;
    average: number;
  };
  stress: {
    level: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  sleep: {
    lastNight: number;
    quality: number;
  };
}

export default function Integrations() {
  const [devices, setDevices] = useState([
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      description: 'Heart rate, HRV, activity tracking, and mindfulness data',
      emoji: '⌚',
      color: ['#4a5568', '#1a202c'],
      connected: true,
      features: ['Heart Rate', 'HRV', 'Activity', 'Sleep', 'Mindfulness'],
      lastSync: '2 minutes ago',
      batteryLevel: 85
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Comprehensive health metrics and sleep analysis',
      emoji: '🏃',
      color: ['#06b6d4', '#10b981'],
      connected: false,
      features: ['Steps', 'Heart Rate', 'Sleep', 'Stress', 'SpO2'],
      lastSync: null,
      batteryLevel: null
    },
    {
      id: 'garmin',
      name: 'Garmin',
      description: 'Advanced fitness and wellness tracking',
      emoji: '🎯',
      color: ['#3b82f6', '#1e40af'],
      connected: false,
      features: ['GPS', 'Heart Rate', 'VO2 Max', 'Training Load', 'Recovery'],
      lastSync: null,
      batteryLevel: null
    }
  ]);

  const biometricData: BiometricData = {
    currentMood: 0.75,
    heartRate: {
      current: 72,
      resting: 68,
      max: 185
    },
    hrv: {
      current: 45,
      average: 42
    },
    stress: {
      level: 0.3,
      trend: 'improving'
    },
    sleep: {
      lastNight: 7.5,
      quality: 0.82
    }
  };

  const emotionalTimeline = [
    { time: '6:00', mood: 0.6, event: 'Wake up', heartRate: 68 },
    { time: '8:00', mood: 0.75, event: 'Morning meditation', heartRate: 65 },
    { time: '12:00', mood: 0.8, event: 'Productive work session', heartRate: 72 },
    { time: '15:00', mood: 0.65, event: 'Stressful meeting', heartRate: 88 },
    { time: '18:00', mood: 0.7, event: 'Exercise', heartRate: 145 },
    { time: '21:00', mood: 0.8, event: 'Relaxing evening', heartRate: 70 },
  ];

  const handleConnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId
        ? { ...d, connected: true, lastSync: 'Just now' }
        : d
    ));
  };

  const handleDisconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId
        ? { ...d, connected: false, lastSync: null }
        : d
    ));
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 0.8) return '#10b981';
    if (mood >= 0.6) return '#fbbf24';
    if (mood >= 0.4) return '#f97316';
    return '#ef4444';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 0.8) return '😊';
    if (mood >= 0.6) return '🙂';
    if (mood >= 0.4) return '😐';
    return '😔';
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
            <Watch size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Wearable Integrations</Text>
          <Text style={styles.headerSubtitle}>Connect your devices for deeper wellness insights</Text>
        </View>

        {/* Connect Your Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect Your Devices</Text>
          <View style={styles.devicesContainer}>
            {devices.map((device) => (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceHeader}>
                  <LinearGradient
                    colors={device.color}
                    style={styles.deviceIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.deviceEmoji}>{device.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceTitleRow}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      {device.connected && (
                        <View style={styles.connectedBadge}>
                          <CheckCircle size={12} color="#10b981" />
                          <Text style={styles.connectedText}>Connected</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.deviceDescription}>{device.description}</Text>
                  </View>
                </View>

                <View style={styles.deviceContent}>
                  <Text style={styles.featuresLabel}>Features:</Text>
                  <View style={styles.featuresList}>
                    {device.features.map((feature) => (
                      <View key={feature} style={styles.featureChip}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {device.connected && device.lastSync && (
                    <Text style={styles.lastSyncText}>Last sync: {device.lastSync}</Text>
                  )}

                  <TouchableOpacity
                    onPress={() => device.connected ? handleDisconnectDevice(device.id) : handleConnectDevice(device.id)}
                  >
                    <LinearGradient
                      colors={device.connected ? ['#10b981', '#059669'] : ['#f6e05e', '#fbbf24']}
                      style={styles.deviceButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {device.connected ? (
                        <>
                          <Activity size={16} color="white" />
                          <Text style={[styles.deviceButtonText, { color: 'white' }]}>Connected</Text>
                        </>
                      ) : (
                        <>
                          <Zap size={16} color="#1a202c" />
                          <Text style={[styles.deviceButtonText, { color: '#1a202c' }]}>Connect</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Current Biometrics Dashboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Biometric Dashboard</Text>
            <TouchableOpacity style={styles.analyzeButton}>
              <BarChart3 size={16} color="#f6e05e" />
              <Text style={styles.analyzeButtonText}>Analyze Data</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.biometricsGrid}>
            {/* Current Mood */}
            <View style={styles.biometricCard}>
              <View style={styles.biometricHeader}>
                <Text style={styles.biometricLabel}>Current Mood</Text>
                <Text style={styles.biometricEmoji}>{getMoodEmoji(biometricData.currentMood)}</Text>
              </View>
              <Text style={[styles.biometricValue, { color: getMoodColor(biometricData.currentMood) }]}>
                {Math.round(biometricData.currentMood * 100)}%
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${biometricData.currentMood * 100}%`,
                      backgroundColor: getMoodColor(biometricData.currentMood)
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Heart Rate */}
            <View style={styles.biometricCard}>
              <View style={styles.biometricHeader}>
                <Text style={styles.biometricLabel}>Heart Rate</Text>
                <Heart size={16} color="#ef4444" />
              </View>
              <Text style={[styles.biometricValue, { color: '#ef4444' }]}>
                {biometricData.heartRate.current} bpm
              </Text>
              <Text style={styles.biometricSubtext}>
                Resting: {biometricData.heartRate.resting} bpm
              </Text>
            </View>

            {/* HRV */}
            <View style={styles.biometricCard}>
              <View style={styles.biometricHeader}>
                <Text style={styles.biometricLabel}>HRV</Text>
                <Waves size={16} color="#06b6d4" />
              </View>
              <Text style={[styles.biometricValue, { color: '#06b6d4' }]}>
                {biometricData.hrv.current}ms
              </Text>
              <Text style={styles.biometricSubtext}>
                Avg: {biometricData.hrv.average}ms
              </Text>
            </View>

            {/* Stress Level */}
            <View style={styles.biometricCard}>
              <View style={styles.biometricHeader}>
                <Text style={styles.biometricLabel}>Stress Level</Text>
                <TrendingUp size={16} color={biometricData.stress.trend === 'improving' ? '#10b981' : '#ef4444'} />
              </View>
              <Text style={[
                styles.biometricValue, 
                { color: biometricData.stress.level < 0.5 ? '#10b981' : '#f97316' }
              ]}>
                {Math.round((1 - biometricData.stress.level) * 100)}%
              </Text>
              <Text style={styles.biometricSubtext}>
                {biometricData.stress.trend}
              </Text>
            </View>
          </View>
        </View>

        {/* Emotional Timeline */}
        <View style={styles.section}>
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Today's Emotional Journey</Text>
            <Text style={styles.timelineSubtitle}>Mood and heart rate correlation throughout the day</Text>

            <View style={styles.timeline}>
              {emotionalTimeline.map((point, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <Text style={styles.timelineTime}>{point.time}</Text>
                    <View style={styles.timelineEvent}>
                      <Text style={styles.timelineEmoji}>{getMoodEmoji(point.mood)}</Text>
                      <Text style={styles.timelineEventText}>{point.event}</Text>
                    </View>
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.timelineMood}>
                      <Text style={styles.timelineLabel}>Mood:</Text>
                      <Text style={[styles.timelineValue, { color: getMoodColor(point.mood) }]}>
                        {Math.round(point.mood * 100)}%
                      </Text>
                    </View>
                    <View style={styles.timelineHeartRate}>
                      <Heart size={12} color="#ef4444" />
                      <Text style={[styles.timelineValue, { color: '#ef4444' }]}>{point.heartRate}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Sync Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync & Analysis</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#f6e05e', '#fbbf24']}
                style={styles.actionIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Activity size={32} color="#1a202c" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Sync All Devices</Text>
              <Text style={styles.actionDescription}>Update all biometric data from connected wearables</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Zap size={16} color="#f6e05e" />
                <Text style={styles.actionButtonText}>Sync Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#06b6d4', '#3b82f6']}
                style={styles.actionIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <BarChart3 size={32} color="white" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Emotional Analysis</Text>
              <Text style={styles.actionDescription}>Generate insights from your biometric patterns</Text>
              <TouchableOpacity style={styles.actionButton}>
                <TrendingUp size={16} color="#f6e05e" />
                <Text style={styles.actionButtonText}>Analyze Journey</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* Integration Benefits */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.benefitsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.benefitsIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={24} color="#1a202c" />
            </LinearGradient>
            <Text style={styles.benefitsTitle}>The Magic of Data</Text>
            <Text style={styles.benefitsDescription}>
              By connecting your wearables, we can predict mood patterns, suggest optimal check-in times,
              and provide personalized wellness recommendations based on your unique biometric signature.
            </Text>

            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <Sparkles size={24} color="#f6e05e" />
                <Text style={styles.benefitTitle}>Predictive Insights</Text>
                <Text style={styles.benefitDescription}>AI predicts your wellness needs</Text>
              </View>
              <View style={styles.benefitItem}>
                <Calendar size={24} color="#f6e05e" />
                <Text style={styles.benefitTitle}>Smart Scheduling</Text>
                <Text style={styles.benefitDescription}>Calls scheduled at optimal times</Text>
              </View>
              <View style={styles.benefitItem}>
                <TrendingUp size={24} color="#f6e05e" />
                <Text style={styles.benefitTitle}>Progress Tracking</Text>
                <Text style={styles.benefitDescription}>Visualize your wellness journey</Text>
              </View>
            </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  analyzeButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  devicesContainer: {
    gap: 16,
  },
  deviceCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  deviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceEmoji: {
    fontSize: 28,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  connectedText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  deviceDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  deviceContent: {
    gap: 12,
  },
  featuresLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7fafc',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: '#2d3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '600',
  },
  lastSyncText: {
    fontSize: 14,
    color: '#4a5568',
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deviceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  biometricCard: {
    width: '47%',
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  biometricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  biometricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a0aec0',
  },
  biometricEmoji: {
    fontSize: 20,
  },
  biometricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  biometricSubtext: {
    fontSize: 12,
    color: '#a0aec0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2d3748',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timelineCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    padding: 12,
    borderRadius: 8,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    color: '#a0aec0',
    fontFamily: 'monospace',
    minWidth: 40,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  timelineEmoji: {
    fontSize: 16,
  },
  timelineEventText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7fafc',
  },
  timelineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timelineMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineHeartRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#a0aec0',
  },
  timelineValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  benefitsCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  benefitsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 12,
  },
  benefitsDescription: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
});