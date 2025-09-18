import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Phone, Video, Clock, Calendar, Star, Sparkles, CircleCheck as CheckCircle2, Plus, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HumanCallProgram() {
  const [allowHumanCalls, setAllowHumanCalls] = useState(true);
  const [allowVideoCalls, setAllowVideoCalls] = useState(true);

  const userPlan = 'free';
  const allowance = {
    audioCallsLeft: 2,
    videoCallsLeft: 1,
    nextReset: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  const plans = [
    {
      id: 'free',
      name: 'Community',
      price: 'Free',
      features: [
        '1 audio call per week',
        'Video call every 30 days',
        'Community support',
        'Basic scheduling'
      ],
      audioCalls: 1,
      videoFrequency: '30 days',
      color: ['#3b82f6', '#06b6d4'],
      current: userPlan === 'free'
    },
    {
      id: 'basic',
      name: 'Guided Path',
      price: '50 credits/month',
      features: [
        '3 audio calls per week',
        'Video call every 15 days',
        'Priority support',
        'Flexible scheduling',
        'Session recordings'
      ],
      audioCalls: 3,
      videoFrequency: '15 days',
      color: ['#8b5cf6', '#a855f7'],
      current: false,
      popular: true
    },
    {
      id: 'premium',
      name: 'Personal Sanctuary',
      price: '100 credits/month',
      features: [
        '5 audio calls per week',
        'Video call every 7 days',
        'Dedicated counselor',
        'Emergency support',
        'Personalized resources',
        'Advanced analytics'
      ],
      audioCalls: 5,
      videoFrequency: '7 days',
      color: ['#f6e05e', '#fbbf24'],
      current: false
    }
  ];

  const recentSessions = [
    {
      id: '1',
      type: 'audio',
      counselor: 'Sarah Chen',
      date: '2 days ago',
      duration: '35 min',
      rating: 5,
      topic: 'Stress Management',
      notes: 'Discussed coping strategies for work-related stress',
      color: ['#3b82f6', '#06b6d4']
    },
    {
      id: '2',
      type: 'video',
      counselor: 'Alex Rivera',
      date: '1 week ago',
      duration: '45 min',
      rating: 5,
      topic: 'Goal Setting',
      notes: 'Created actionable plan for personal development goals',
      color: ['#8b5cf6', '#a855f7']
    },
    {
      id: '3',
      type: 'audio',
      counselor: 'Maya Patel',
      date: '2 weeks ago',
      duration: '30 min',
      rating: 4,
      topic: 'Mindfulness Practice',
      notes: 'Learned new meditation techniques and breathing exercises',
      color: ['#10b981', '#059669']
    }
  ];

  const formatTimeUntilReset = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
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
            <Users size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Human Connection Hub</Text>
          <Text style={styles.headerSubtitle}>Connect with certified wellness professionals</Text>
        </View>

        {/* Current Allowance */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.allowanceCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.allowanceHeader}>
              <Clock size={24} color="#f6e05e" />
              <Text style={styles.allowanceTitle}>Your Current Allowance</Text>
            </View>
            <Text style={styles.allowanceSubtitle}>Available calls and reset schedule</Text>
            
            <View style={styles.allowanceStats}>
              <View style={styles.statItem}>
                <View style={styles.statIconRow}>
                  <Phone size={20} color="#f6e05e" />
                  <Text style={styles.statValue}>{allowance.audioCallsLeft}</Text>
                </View>
                <Text style={styles.statLabel}>Audio Calls Left</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconRow}>
                  <Video size={20} color="#f6e05e" />
                  <Text style={styles.statValue}>{allowance.videoCallsLeft}</Text>
                </View>
                <Text style={styles.statLabel}>Video Calls Left</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconRow}>
                  <Calendar size={20} color="#f6e05e" />
                  <Text style={styles.statValue}>{formatTimeUntilReset(allowance.nextReset)}</Text>
                </View>
                <Text style={styles.statLabel}>Until Reset</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.buyExtraButton}>
              <Plus size={16} color="#f6e05e" />
              <Text style={styles.buyExtraText}>Buy Extra Video Call (30 Credits)</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <View key={plan.id} style={[styles.planCard, plan.current && styles.currentPlanCard]}>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <LinearGradient
                    colors={plan.color}
                    style={styles.planIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {plan.id === 'free' ? <Users size={32} color="white" /> :
                     plan.id === 'basic' ? <Star size={32} color="white" /> :
                     <Sparkles size={32} color="white" />}
                  </LinearGradient>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>

                <View style={styles.planContent}>
                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <CheckCircle2 size={16} color="#f6e05e" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity disabled={plan.current}>
                    <LinearGradient
                      colors={plan.current ? ['#4a5568', '#2d3748'] : ['#f6e05e', '#fbbf24']}
                      style={styles.planButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {plan.current ? (
                        <>
                          <CheckCircle2 size={16} color="#a0aec0" />
                          <Text style={[styles.planButtonText, { color: '#a0aec0' }]}>Current Plan</Text>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} color="#1a202c" />
                          <Text style={[styles.planButtonText, { color: '#1a202c' }]}>
                            {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Preferences */}
        <View style={styles.section}>
          <View style={styles.preferencesCard}>
            <View style={styles.preferencesHeader}>
              <Shield size={24} color="#f6e05e" />
              <Text style={styles.preferencesTitle}>Communication Preferences</Text>
            </View>
            <Text style={styles.preferencesSubtitle}>Control how and when you can be contacted</Text>

            <View style={styles.preferencesContent}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Allow Human Calls</Text>
                  <Text style={styles.preferenceDescription}>
                    Permit scheduled calls with human wellness professionals
                  </Text>
                </View>
                <Switch
                  value={allowHumanCalls}
                  onValueChange={setAllowHumanCalls}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={allowHumanCalls ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>Allow Video Calls</Text>
                  <Text style={styles.preferenceDescription}>
                    Enable video sessions (requires consent for visual contact)
                  </Text>
                </View>
                <Switch
                  value={allowVideoCalls}
                  onValueChange={setAllowVideoCalls}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={allowVideoCalls ? '#1a202c' : '#a0aec0'}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.sessionsList}>
            {recentSessions.map((session) => (
              <TouchableOpacity key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionLeft}>
                    <LinearGradient
                      colors={session.color}
                      style={styles.sessionIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {session.type === 'video' ? 
                        <Video size={24} color="white" /> : 
                        <Phone size={24} color="white" />
                      }
                    </LinearGradient>
                    <View>
                      <Text style={styles.sessionTopic}>{session.topic}</Text>
                      <View style={styles.sessionMetaRow}>
                        <Text style={styles.sessionMeta}>with {session.counselor}</Text>
                        <View style={styles.metaDivider} />
                        <Calendar size={12} color="#a0aec0" />
                        <Text style={styles.sessionMeta}>{session.date}</Text>
                        <View style={styles.metaDivider} />
                        <Clock size={12} color="#a0aec0" />
                        <Text style={styles.sessionMeta}>{session.duration}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sessionRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        color={i < session.rating ? '#fbbf24' : '#4a5568'}
                        fill={i < session.rating ? '#fbbf24' : 'transparent'}
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.sessionNotes}>{session.notes}</Text>
              </TouchableOpacity>
            ))}
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
  allowanceCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  allowanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  allowanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  allowanceSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 20,
  },
  allowanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  buyExtraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buyExtraText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
    position: 'relative',
  },
  currentPlanCard: {
    borderColor: '#f6e05e',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#f6e05e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f6e05e',
  },
  planContent: {
    gap: 20,
  },
  planFeatures: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#a0aec0',
    flex: 1,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 8,
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
  sessionsList: {
    gap: 16,
  },
  sessionCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  sessionHeader: {
    marginBottom: 12,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 12,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionMeta: {
    fontSize: 14,
    color: '#a0aec0',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#4a5568',
  },
  sessionRating: {
    flexDirection: 'row',
    gap: 4,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
});