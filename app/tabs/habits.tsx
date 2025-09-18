import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Target, Star, Brain, Calendar, CircleCheck as CheckCircle2, TrendingUp, Flame, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  rewardCredits: number;
  streak: number;
  progress: number;
  completedDates: string[]; // Array of completed dates in YYYY-MM-DD format
  color: string[];
  icon: any;
  createdAt: string;
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness',
      frequency: 'daily',
      rewardCredits: 10,
      streak: 12,
      progress: 71,
      completedDates: [
        '2025-01-01', '2025-01-02', '2025-01-04', '2025-01-05',
        '2025-01-06', '2025-01-08', '2025-01-09', '2025-01-11',
        '2025-01-12', '2025-01-13', '2025-01-15', '2025-01-16'
      ],
      color: ['#3b82f6', '#06b6d4'],
      icon: Target,
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      name: 'Gratitude Journal',
      description: 'Write 3 things I\'m grateful for',
      frequency: 'daily',
      rewardCredits: 15,
      streak: 8,
      progress: 43,
      completedDates: [
        '2025-01-02', '2025-01-03', '2025-01-05', '2025-01-06',
        '2025-01-08', '2025-01-10', '2025-01-12', '2025-01-14'
      ],
      color: ['#f59e0b', '#f97316'],
      icon: Star,
      createdAt: '2025-01-01'
    },
    {
      id: '3',
      name: 'Evening Reflection',
      description: 'Reflect on the day\'s learnings',
      frequency: 'daily',
      rewardCredits: 10,
      streak: 5,
      progress: 43,
      completedDates: [
        '2025-01-01', '2025-01-03', '2025-01-04', '2025-01-07',
        '2025-01-09', '2025-01-11', '2025-01-13'
      ],
      color: ['#8b5cf6', '#a855f7'],
      icon: Brain,
      createdAt: '2025-01-01'
    }
  ]);

  const [addHabitModalVisible, setAddHabitModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Add Habit Form State
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [rewardCredits, setRewardCredits] = useState('10');
  const [enableReminders, setEnableReminders] = useState(false);

  const iconOptions = [Target, Star, Brain, Flame, TrendingUp];
  const colorOptions = [
    ['#3b82f6', '#06b6d4'],
    ['#f59e0b', '#f97316'],
    ['#8b5cf6', '#a855f7'],
    ['#10b981', '#059669'],
    ['#ef4444', '#dc2626'],
    ['#ec4899', '#db2777']
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const totalHabits = habits.length;
  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = habits.filter(h => h.completedDates.includes(today)).length;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);

  const handleCompleteHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        let newCompletedDates;
        let newStreak = habit.streak;
        
        if (isCompleted) {
          // Remove today from completed dates
          newCompletedDates = habit.completedDates.filter(date => date !== today);
          newStreak = Math.max(0, habit.streak - 1);
        } else {
          // Add today to completed dates
          newCompletedDates = [...habit.completedDates, today].sort();
          newStreak = habit.streak + 1;
        }

        // Calculate progress for current week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(date.getDate() + i);
          weekDates.push(date.toISOString().split('T')[0]);
        }
        const completedThisWeek = weekDates.filter(date => newCompletedDates.includes(date)).length;
        const progress = Math.round((completedThisWeek / 7) * 100);

        return { 
          ...habit, 
          completedDates: newCompletedDates,
          streak: newStreak,
          progress
        };
      }
      return habit;
    }));
  };

  const openCalendar = (habit: Habit) => {
    setSelectedHabit(habit);
    setCalendarModalVisible(true);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateCompleted = (date: string) => {
    return selectedHabit?.completedDates.includes(date) || false;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentCalendarDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentCalendarDate);
    const firstDay = getFirstDayOfMonth(currentCalendarDate);
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCompleted = isDateCompleted(dateStr);
      const isToday = dateStr === today;

      calendarDays.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isCompleted && styles.calendarDayCompleted,
            isToday && styles.calendarDayToday
          ]}
          onPress={() => {
            if (selectedHabit) {
              const habitId = selectedHabit.id;
              const newCompletedDates = isCompleted 
                ? selectedHabit.completedDates.filter(date => date !== dateStr)
                : [...selectedHabit.completedDates, dateStr].sort();

              setHabits(prev => prev.map(habit => 
                habit.id === habitId 
                  ? { ...habit, completedDates: newCompletedDates }
                  : habit
              ));

              setSelectedHabit(prev => prev ? { ...prev, completedDates: newCompletedDates } : null);
            }
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isCompleted && styles.calendarDayTextCompleted,
            isToday && styles.calendarDayTextToday
          ]}>
            {day}
          </Text>
          {isCompleted && <CheckCircle2 size={12} color="white" style={styles.calendarCheck} />}
        </TouchableOpacity>
      );
    }

    return calendarDays;
  };

  const resetAddHabitForm = () => {
    setHabitName('');
    setHabitDescription('');
    setHabitFrequency('daily');
    setRewardCredits('10');
    setEnableReminders(false);
  };

  const handleCreateHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      description: habitDescription,
      frequency: habitFrequency,
      rewardCredits: parseInt(rewardCredits) || 10,
      streak: 0,
      progress: 0,
      completedDates: [],
      color: randomColor,
      icon: randomIcon,
      createdAt: today
    };

    setHabits(prev => [...prev, newHabit]);
    resetAddHabitForm();
    setAddHabitModalVisible(false);
    Alert.alert('Success', 'Magical habit created successfully!');
  };

  const getHabitWeeklyData = (habit: Habit) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      weeklyData.push(habit.completedDates.includes(dateStr));
    }
    return weeklyData;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Daily Habits</Text>
            <Text style={styles.headerSubtitle}>Build consistency through magical rituals</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setAddHabitModalVisible(true)}
          >
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Plus size={20} color="#1a202c" />
              <Text style={styles.addButtonText}>Add Habit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Flame size={16} color="#f6e05e" />
            </View>
            <Text style={styles.statValue}>{bestStreak}</Text>
            <Text style={styles.statSubtext}>days in a row</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Today's Progress</Text>
              <TrendingUp size={16} color="#f6e05e" />
            </View>
            <Text style={styles.statValue}>{todayCompletions}/{totalHabits}</Text>
            <Text style={styles.statSubtext}>habits completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Active Habits</Text>
              <Target size={16} color="#f6e05e" />
            </View>
            <Text style={styles.statValue}>{totalHabits}</Text>
            <Text style={styles.statSubtext}>magical rituals</Text>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          <View style={styles.habitsList}>
            {habits.map((habit) => {
              const IconComponent = habit.icon;
              const weeklyData = getHabitWeeklyData(habit);
              const isCompletedToday = habit.completedDates.includes(today);
              
              return (
                <TouchableOpacity key={habit.id} style={styles.habitCard}>
                  <View style={styles.habitHeader}>
                    <View style={styles.habitLeft}>
                      <LinearGradient
                        colors={habit.color}
                        style={styles.habitIconContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconComponent size={24} color="white" />
                      </LinearGradient>
                      <View>
                        <View style={styles.habitTitleRow}>
                          <Text style={styles.habitTitle}>{habit.name}</Text>
                          <View style={styles.streakBadge}>
                            <Flame size={12} color="#f6e05e" />
                            <Text style={styles.streakText}>{habit.streak} day streak</Text>
                          </View>
                        </View>
                        <Text style={styles.habitDescription}>{habit.description}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.habitActions}>
                      <TouchableOpacity 
                        style={styles.calendarButton}
                        onPress={() => openCalendar(habit)}
                      >
                        <Calendar size={16} color="#a0aec0" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.completeButton,
                          isCompletedToday && styles.completeButtonCompleted
                        ]}
                        onPress={() => handleCompleteHabit(habit.id)}
                      >
                        <CheckCircle2 size={16} color={isCompletedToday ? "#10b981" : "#f6e05e"} />
                        <Text style={[
                          styles.completeButtonText,
                          isCompletedToday && styles.completeButtonTextCompleted
                        ]}>
                          {isCompletedToday ? 'Completed' : 'Complete'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.habitProgress}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>This Week</Text>
                      <Text style={styles.progressValue}>{habit.progress}% Complete</Text>
                    </View>
                    
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={['#f6e05e', '#fbbf24']}
                        style={[styles.progressFill, { width: `${habit.progress}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    
                    <View style={styles.weeklyProgress}>
                      {daysOfWeek.map((day, index) => (
                        <View key={day} style={styles.dayColumn}>
                          <Text style={styles.dayLabel}>{day}</Text>
                          <View style={[
                            styles.dayIndicator,
                            { backgroundColor: weeklyData[index] ? '#10b981' : '#2d3748' }
                          ]}>
                            {weeklyData[index] && <CheckCircle2 size={16} color="white" />}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
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
              "The secret of getting ahead is getting started."
            </Text>
            <Text style={styles.quoteAuthor}>— Mark Twain</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addHabitModalVisible}
        onRequestClose={() => setAddHabitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Habit</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setAddHabitModalVisible(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Design a magical ritual to enhance your daily practice</Text>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Habit Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={habitName}
                  onChangeText={setHabitName}
                  placeholder="Enter habit name..."
                  placeholderTextColor="#a0aec0"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={habitDescription}
                  onChangeText={setHabitDescription}
                  placeholder="Describe your habit..."
                  placeholderTextColor="#a0aec0"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Frequency</Text>
                  <View style={styles.frequencyContainer}>
                    {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyOption,
                          habitFrequency === freq && styles.frequencyOptionActive
                        ]}
                        onPress={() => setHabitFrequency(freq)}
                      >
                        <Text style={[
                          styles.frequencyText,
                          habitFrequency === freq && styles.frequencyTextActive
                        ]}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Reward Credits</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rewardCredits}
                    onChangeText={setRewardCredits}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#a0aec0"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.reminderRow}>
                  <Text style={styles.formLabel}>Enable Reminders</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleSwitch,
                      enableReminders && styles.toggleSwitchActive
                    ]}
                    onPress={() => setEnableReminders(!enableReminders)}
                  >
                    <View style={[
                      styles.toggleHandle,
                      enableReminders && styles.toggleHandleActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateHabit}
              >
                <LinearGradient
                  colors={['#f6e05e', '#fbbf24']}
                  style={styles.createButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Star size={16} color="#1a202c" />
                  <Text style={styles.createButtonText}>Create Magical Habit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarModalVisible}
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <View style={styles.habitInfo}>
                {selectedHabit && (
                  <>
                    <LinearGradient
                      colors={selectedHabit.color}
                      style={styles.calendarHabitIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <selectedHabit.icon size={20} color="white" />
                    </LinearGradient>
                    <View>
                      <Text style={styles.calendarHabitName}>{selectedHabit.name}</Text>
                      <View style={styles.calendarStats}>
                        <View style={styles.calendarStat}>
                          <Flame size={12} color="#f6e05e" />
                          <Text style={styles.calendarStatText}>{selectedHabit.streak} day streak</Text>
                        </View>
                        <Text style={styles.calendarStatSeparator}>•</Text>
                        <Text style={styles.calendarStatText}>{selectedHabit.progress}% this week</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setCalendarModalVisible(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarNavigation}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateMonth('prev')}
              >
                <ChevronLeft size={20} color="#a0aec0" />
              </TouchableOpacity>
              <Text style={styles.calendarMonthYear}>
                {monthNames[currentCalendarDate.getMonth()]} {currentCalendarDate.getFullYear()}
              </Text>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateMonth('next')}
              >
                <ChevronRight size={20} color="#a0aec0" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekHeader}>
              {daysOfWeek.map(day => (
                <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>

            <View style={styles.calendarFooter}>
              <View style={styles.calendarFooterStats}>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatValue}>
                    {selectedHabit?.streak || 0}
                  </Text>
                  <Text style={styles.footerStatLabel}>Current Streak</Text>
                </View>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatValue}>
                    {selectedHabit ? selectedHabit.completedDates.filter(date => {
                      const dateObj = new Date(date);
                      return dateObj.getMonth() === currentCalendarDate.getMonth() &&
                             dateObj.getFullYear() === currentCalendarDate.getFullYear();
                    }).length : 0}
                  </Text>
                  <Text style={styles.footerStatLabel}>This Month</Text>
                </View>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatValue}>
                    {selectedHabit?.progress || 0}%
                  </Text>
                  <Text style={styles.footerStatLabel}>Completion Rate</Text>
                </View>
              </View>

              <View style={styles.calendarActions}>
                <TouchableOpacity
                  style={styles.markCompleteButton}
                  onPress={() => {
                    if (selectedHabit) {
                      handleCompleteHabit(selectedHabit.id);
                    }
                  }}
                >
                  <Text style={styles.markCompleteText}>Mark Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={() => setCalendarModalVisible(false)}
                >
                  <LinearGradient
                    colors={['#f6e05e', '#fbbf24']}
                    style={styles.doneButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
  },
  addButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#a0aec0',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 16,
  },
  habitsList: {
    gap: 24,
  },
  habitCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  habitHeader: {
    marginBottom: 20,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginRight: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: '#f6e05e',
    fontWeight: '600',
    marginLeft: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#a0aec0',
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2d3748',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonCompleted: {
    backgroundColor: '#065f46',
  },
  completeButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    marginLeft: 4,
    fontWeight: '600',
  },
  completeButtonTextCompleted: {
    color: '#10b981',
  },
  habitProgress: {
    gap: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#a0aec0',
  },
  dayIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  quoteCard: {
    padding: 32,
    borderRadius: 16,
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
    marginBottom: 8,
    lineHeight: 26,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#a0aec0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2d3748',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 24,
  },
  modalBody: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    color: '#f7fafc',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f7fafc',
    borderWidth: 2,
    borderColor: '#4a5568',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: '#2d3748',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a5568',
  },
  frequencyOptionActive: {
    backgroundColor: '#f6e05e',
    borderColor: '#fbbf24',
  },
  frequencyText: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '600',
  },
  frequencyTextActive: {
    color: '#1a202c',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    backgroundColor: '#2d3748',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleSwitchActive: {
    backgroundColor: '#f6e05e',
  },
  toggleHandle: {
    width: 24,
    height: 24,
    backgroundColor: '#a0aec0',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  toggleHandleActive: {
    backgroundColor: '#1a202c',
    alignSelf: 'flex-end',
  },
  createButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginLeft: 8,
  },
  calendarModalContent: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 24,
    width: '95%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2d3748',
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarHabitIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calendarHabitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 4,
  },
  calendarStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarStatText: {
    fontSize: 12,
    color: '#a0aec0',
    marginLeft: 4,
  },
  calendarStatSeparator: {
    fontSize: 12,
    color: '#a0aec0',
    marginHorizontal: 8,
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2d3748',
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    position: 'relative',
  },
  calendarDayCompleted: {
    backgroundColor: '#10b981',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#f6e05e',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#f7fafc',
    fontWeight: '500',
  },
  calendarDayTextCompleted: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendarDayTextToday: {
    color: '#f6e05e',
    fontWeight: 'bold',
  },
  calendarCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  calendarFooter: {
    gap: 20,
  },
  calendarFooterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerStat: {
    alignItems: 'center',
  },
  footerStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f6e05e',
    marginBottom: 4,
  },
  footerStatLabel: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  calendarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  markCompleteButton: {
    flex: 1,
    backgroundColor: '#2d3748',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  markCompleteText: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
});