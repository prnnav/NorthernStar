import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coins, Gift, Plus, TrendingUp, ShoppingCart, Zap, Star, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Credits() {
  const currentCredits = 150;
  
  const creditActions = [
    {
      id: 'claim',
      title: 'Claim Daily Bonus',
      description: 'Collect your daily 25 credits',
      icon: Gift,
      color: ['#10b981', '#059669'],
    },
    {
      id: 'create',
      title: 'Create Opportunity',
      description: 'Design new ways to earn credits',
      icon: Plus,
      color: ['#3b82f6', '#06b6d4'],
    },
    {
      id: 'earn',
      title: 'Complete Activities',
      description: 'Finish habits and goals for rewards',
      icon: TrendingUp,
      color: ['#8b5cf6', '#a855f7'],
    },
    {
      id: 'buy',
      title: 'Purchase Credits',
      description: 'Buy credits with real money',
      icon: ShoppingCart,
      color: ['#f97316', '#ef4444'],
    },
    {
      id: 'spend',
      title: 'Spend & Rewards',
      description: 'Use credits for premium features',
      icon: Zap,
      color: ['#f6e05e', '#fbbf24'],
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'earned', amount: 15, description: 'Completed Morning Meditation', time: '2 hours ago', color: '#10b981' },
    { id: 2, type: 'claimed', amount: 25, description: 'Daily bonus claimed', time: '1 day ago', color: '#3b82f6' },
    { id: 3, type: 'spent', amount: -30, description: 'Premium voice pack', time: '2 days ago', color: '#f97316' },
    { id: 4, type: 'earned', amount: 20, description: 'Weekly habit streak bonus', time: '3 days ago', color: '#10b981' },
  ];

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
            <Coins size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Credit Treasury</Text>
          <Text style={styles.headerSubtitle}>Manage your magical currency</Text>
          
          <View style={styles.creditsDisplay}>
            <LinearGradient
              colors={['#1a202c', '#2d3748']}
              style={styles.creditsCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Sparkles size={24} color="#f6e05e" />
              <Text style={styles.creditsAmount}>{currentCredits}</Text>
              <Text style={styles.creditsLabel}>Credits Available</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Credit Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit Actions</Text>
          <View style={styles.gridContainer}>
            {creditActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity 
                  key={action.id} 
                  style={[styles.actionCard, { marginBottom: index >= creditActions.length - 1 ? 0 : 16 }]}
                >
                  <LinearGradient
                    colors={action.color}
                    style={styles.actionIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <IconComponent size={32} color="white" />
                  </LinearGradient>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                  <View style={styles.actionButton}>
                    <Star size={16} color="#f6e05e" />
                    <Text style={styles.actionButtonText}>
                      {action.id === 'buy' ? 'Purchase' : action.id === 'spend' ? 'Explore' : 'Activate'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionsTitle}>Transaction History</Text>
            <Text style={styles.transactionsSubtitle}>Your recent credit activity</Text>
            
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIndicator, { backgroundColor: transaction.color }]} />
                    <View>
                      <Text style={styles.transactionDescription}>{transaction.description}</Text>
                      <Text style={styles.transactionTime}>{transaction.time}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.transactionBadge,
                    { backgroundColor: transaction.amount > 0 ? '#10b981' : '#ef4444' }
                  ]}>
                    <Text style={styles.transactionAmount}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </Text>
                  </View>
                </View>
              ))}
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
    marginBottom: 24,
  },
  creditsDisplay: {
    width: '100%',
  },
  creditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  creditsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginHorizontal: 12,
  },
  creditsLabel: {
    fontSize: 16,
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
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    marginLeft: 6,
    fontWeight: '600',
  },
  transactionsContainer: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 4,
  },
  transactionsSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 16,
  },
  transactionsList: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    color: '#a0aec0',
  },
  transactionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});