import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Sparkles, Target, Brain, TrendingUp, ChevronRight, Coins, Calendar, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const userName = "Mason";
  const currentCredits = 150;
  const nextCheckIn = "2 hours";
  
  const habitCards = [
    { id: 1, name: "Morning Meditation", streak: 12, progress: 71, icon: Target, color: ['#3b82f6', '#06b6d4'] },
    { id: 2, name: "Gratitude Journal", streak: 8, progress: 43, icon: Star, color: ['#f59e0b', '#f97316'] },
    { id: 3, name: "Evening Reflection", streak: 5, progress: 43, icon: Brain, color: ['#8b5cf6', '#a855f7'] },
  ];

  const creditActions = [
    { 
      id: 'claim', 
      title: 'Claim Daily Bonus', 
      description: 'Get your 25 daily credits',
      icon: Sparkles,
      color: ['#10b981', '#059669']
    },
    { 
      id: 'create', 
      title: 'Purchase', 
      description: 'Access new credits fast',
      icon: Coins,
      color: ['#f59e0b', '#f97316']
    },
    { 
      id: 'earn', 
      title: 'Complete Activities', 
      description: 'Finish habits and goals',
      icon: TrendingUp,
      color: ['#8b5cf6', '#a855f7']
    },
  ];

  const upcomingCalls = [
    {
      id: 1,
      type: 'AI Companion',
      topic: 'Motivation Check-in',
      time: nextCheckIn,
      confidence: 85
    },
    {
      id: 2,
      type: 'Human Support',
      topic: 'Weekly Reflection',
      time: '3 days',
      confidence: 100
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#f6e05e', '#fbbf24', '#f59e0b']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View style={styles.sparkleContainer}>
                  <Sparkles size={20} color="#1a202c" />
                  <Text style={styles.greetingText}>Good morning</Text>
                </View>
                <View style={styles.creditsContainer}>
                  <LinearGradient
                    colors={['#f6e05e', '#fbbf24']}
                    style={styles.creditsBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Sparkles size={16} color="#1a202c" />
                    <Text style={styles.creditsText}>{currentCredits}</Text>
                  </LinearGradient>
                </View>
              </View>
              <Text style={styles.welcomeText}>Welcome back, <Text style={styles.nameText}>{userName}</Text></Text>
              <Text style={styles.subtitleText}>Ready to shine today? ⭐</Text>
              <View style={styles.starContainer}>
                <Star size={48} color="#fbbf24" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Habits Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Magical Habits</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#a0aec0" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {habitCards.map((habit) => {
              const IconComponent = habit.icon;
              return (
                <TouchableOpacity key={habit.id} style={styles.habitCard}>
                  <View style={styles.habitCardHeader}>
                    <IconComponent size={24} color="#f6e05e" />
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakText}>{habit.streak} day streak</Text>
                    </View>
                  </View>
                  <Text style={styles.habitTitle}>{habit.name}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>This Week</Text>
                      <Text style={styles.progressValue}>{habit.progress}% Complete</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={habit.color}
                        style={[styles.progressFill, { width: `${habit.progress}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Credits Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Credits & Rewards</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Manage Credits</Text>
              <ChevronRight size={16} color="#a0aec0" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridContainer}>
            {creditActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity key={action.id} style={styles.creditCard}>
                  <LinearGradient
                    colors={action.color}
                    style={styles.creditIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <IconComponent size={24} color="white" />
                  </LinearGradient>
                  <Text style={styles.creditTitle}>{action.title}</Text>
                  <Text style={styles.creditDescription}>{action.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Upcoming Calls */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Calls</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>All Calls</Text>
              <ChevronRight size={16} color="#a0aec0" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.callsContainer}>
            {upcomingCalls.map((call) => (
              <TouchableOpacity key={call.id} style={styles.callCard}>
                <View style={styles.callContent}>
                  <View style={styles.callLeft}>
                    <View style={styles.callIndicator} />
                    <View>
                      <Text style={styles.callType}>{call.type}</Text>
                      <Text style={styles.callTopic}>{call.topic}</Text>
                    </View>
                  </View>
                  <View style={styles.callRight}>
                    <Text style={styles.callTimeLabel}>In</Text>
                    <Text style={styles.callTime}>{call.time}</Text>
                  </View>
                </View>
                <View style={styles.callFooter}>
                  <View style={styles.predictionBadge}>
                    <Clock size={12} color="#a0aec0" />
                    <Text style={styles.predictionText}>Predicted</Text>
                  </View>
                  <Text style={styles.confidenceText}>{call.confidence}% confidence</Text>
                </View>
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
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
  },
  headerContent: {
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sparkleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginLeft: 6,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  nameText: {
    color: '#8b5cf6',
  },
  subtitleText: {
    fontSize: 16,
    color: '#4a5568',
    fontFamily: 'Inter_400Regular',
  },
  starContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#a0aec0',
    marginRight: 4,
  },
  horizontalScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  habitCard: {
    width: 280,
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadge: {
    backgroundColor: '#fef7e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: '#f6e05e',
    fontWeight: '600',
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#a0aec0',
  },
  progressValue: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2d3748',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  creditCard: {
    width: '31%',
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
    marginBottom: 12,
  },
  creditIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f7fafc',
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  creditDescription: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  callsContainer: {
    gap: 12,
  },
  callCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  callContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  callLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  callIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#f6e05e',
    borderRadius: 6,
    marginRight: 12,
  },
  callType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  callTopic: {
    fontSize: 14,
    color: '#a0aec0',
  },
  callRight: {
    alignItems: 'flex-end',
  },
  callTimeLabel: {
    fontSize: 12,
    color: '#a0aec0',
  },
  callTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f6e05e',
  },
  callFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  predictionText: {
    fontSize: 12,
    color: '#a0aec0',
    marginLeft: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#a0aec0',
  },
});
