import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Play, Star, ShoppingCart, Download, Volume2, Sparkles, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function VoiceStore() {
  const aiAvatars = [
    {
      id: 'luna',
      name: 'Luna',
      title: 'The Wise Mystic',
      description: 'Calming and insightful, perfect for meditation and reflection',
      price: 0,
      type: 'free',
      accent: 'British',
      personality: 'Wise, Calm, Nurturing',
      preview: 'Hello dear soul, I am Luna. Let me guide you through this journey of self-discovery.',
      emoji: '🌙',
      color: ['#3b82f6', '#8b5cf6']
    },
    {
      id: 'sage',
      name: 'Sage',
      title: 'The Ancient Scholar',
      description: 'Deep and thoughtful voice for storytelling and wisdom sharing',
      price: 25,
      type: 'premium',
      accent: 'American',
      personality: 'Wise, Patient, Scholarly',
      preview: 'Greetings, seeker of wisdom. I am Sage, keeper of ancient knowledge.',
      emoji: '📚',
      color: ['#f59e0b', '#f97316']
    },
    {
      id: 'aria',
      name: 'Aria',
      title: 'The Wellness Guide',
      description: 'Energetic and encouraging, ideal for motivation and wellness',
      price: 30,
      type: 'premium',
      accent: 'Australian',
      personality: 'Energetic, Encouraging, Positive',
      preview: 'Hey there! I\'m Aria, your wellness companion. Ready to feel amazing?',
      emoji: '🌟',
      color: ['#10b981', '#06b6d4']
    },
    {
      id: 'orion',
      name: 'Orion',
      title: 'The Dream Weaver',
      description: 'Mystical and soothing, perfect for bedtime stories and dreams',
      price: 50,
      type: 'exclusive',
      accent: 'Irish',
      personality: 'Mystical, Soothing, Dreamy',
      preview: 'Welcome to the realm of dreams, I am Orion, your guide to the stars.',
      emoji: '⭐',
      color: ['#8b5cf6', '#6366f1']
    }
  ];

  const voicePacks = [
    {
      id: 'fantasy-pack',
      name: 'Fantasy Realm Pack',
      description: 'Collection of magical voices inspired by fantasy worlds',
      voices: ['Elven Whisper', 'Dragon Sage', 'Forest Guardian'],
      price: 75,
      discount: 20,
      originalPrice: 95,
      emoji: '🏰',
      color: ['#8b5cf6', '#ec4899']
    },
    {
      id: 'meditation-pack',
      name: 'Serenity Collection',
      description: 'Peaceful voices designed for meditation and relaxation',
      voices: ['Ocean Breeze', 'Mountain Echo', 'Zen Master'],
      price: 60,
      discount: 15,
      originalPrice: 70,
      emoji: '🧘',
      color: ['#3b82f6', '#06b6d4']
    },
    {
      id: 'motivation-pack',
      name: 'Power Pack',
      description: 'High-energy voices to fuel your motivation and drive',
      voices: ['Victory Voice', 'Champion Spirit', 'Success Coach'],
      price: 80,
      discount: 25,
      originalPrice: 105,
      emoji: '🏆',
      color: ['#f97316', '#ef4444']
    }
  ];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'free': return { backgroundColor: '#10b981', text: '#ffffff' };
      case 'premium': return { backgroundColor: '#f6e05e', text: '#1a202c' };
      case 'exclusive': return { backgroundColor: '#fbbf24', text: '#1a202c' };
      default: return { backgroundColor: '#4a5568', text: '#ffffff' };
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
            <Mic size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Voice Emporium</Text>
          <Text style={styles.headerSubtitle}>Discover magical AI avatars and premium voice packs</Text>
        </View>

        {/* AI Avatars Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Companions</Text>
          <View style={styles.avatarsContainer}>
            {aiAvatars.map((avatar) => {
              const badgeStyle = getTypeBadgeColor(avatar.type);
              return (
                <View key={avatar.id} style={styles.avatarCard}>
                  <View style={styles.avatarHeader}>
                    <View style={styles.avatarInfo}>
                      <LinearGradient
                        colors={avatar.color}
                        style={styles.avatarIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                      </LinearGradient>
                      <View style={styles.avatarDetails}>
                        <View style={styles.avatarTitleRow}>
                          <Text style={styles.avatarName}>{avatar.name}</Text>
                          <View style={[styles.typeBadge, { backgroundColor: badgeStyle.backgroundColor }]}>
                            <Text style={[styles.typeBadgeText, { color: badgeStyle.text }]}>
                              {avatar.type}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.avatarTitle}>{avatar.title}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.avatarDescription}>{avatar.description}</Text>

                  <View style={styles.avatarMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Accent:</Text>
                      <Text style={styles.metricValue}>{avatar.accent}</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Style:</Text>
                      <Text style={styles.metricValue}>{avatar.personality.split(',')[0]}</Text>
                    </View>
                  </View>

                  <View style={styles.avatarActions}>
                    <TouchableOpacity style={styles.previewButton}>
                      <Play size={14} color="#f6e05e" />
                      <Text style={styles.previewButtonText}>Preview</Text>
                    </TouchableOpacity>

                    <View style={styles.purchaseArea}>
                      {avatar.price > 0 && (
                        <View style={styles.priceContainer}>
                          <Sparkles size={16} color="#f6e05e" />
                          <Text style={styles.priceText}>{avatar.price}</Text>
                        </View>
                      )}
                      <TouchableOpacity>
                        <LinearGradient
                          colors={avatar.type === 'free' ? ['#10b981', '#059669'] : ['#f6e05e', '#fbbf24']}
                          style={styles.purchaseButton}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          {avatar.type === 'free' ? (
                            <>
                              <Download size={16} color="white" />
                              <Text style={[styles.purchaseButtonText, { color: 'white' }]}>Select</Text>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} color="#1a202c" />
                              <Text style={[styles.purchaseButtonText, { color: '#1a202c' }]}>Purchase</Text>
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Voice Packs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Pack Collections</Text>
          <View style={styles.packsContainer}>
            {voicePacks.map((pack) => (
              <View key={pack.id} style={styles.packCard}>
                <View style={styles.packHeader}>
                  <LinearGradient
                    colors={pack.color}
                    style={styles.packIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.packEmoji}>{pack.emoji}</Text>
                  </LinearGradient>
                  <Text style={styles.packName}>{pack.name}</Text>
                  <Text style={styles.packDescription}>{pack.description}</Text>
                </View>

                <View style={styles.packContent}>
                  <Text style={styles.includesLabel}>Includes:</Text>
                  <View style={styles.voicesList}>
                    {pack.voices.map((voice) => (
                      <View key={voice} style={styles.voiceItem}>
                        <Volume2 size={12} color="#a0aec0" />
                        <Text style={styles.voiceText}>{voice}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.packFooter}>
                  <View style={styles.packPricing}>
                    {pack.discount > 0 && (
                      <Text style={styles.originalPrice}>{pack.originalPrice} credits</Text>
                    )}
                    <View style={styles.currentPrice}>
                      <Sparkles size={16} color="#f6e05e" />
                      <Text style={styles.priceValue}>{pack.price}</Text>
                    </View>
                    {pack.discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{pack.discount}% OFF</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity>
                    <LinearGradient
                      colors={['#f6e05e', '#fbbf24']}
                      style={styles.buyPackButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <ShoppingCart size={16} color="#1a202c" />
                      <Text style={styles.buyPackButtonText}>Buy Pack</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Preview Feature */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.previewCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.previewIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={24} color="#1a202c" />
            </LinearGradient>
            <Text style={styles.previewTitle}>Experience the Magic</Text>
            <Text style={styles.previewText}>
              Each voice is carefully crafted with unique personality traits and speaking patterns. 
              Preview any voice to find your perfect AI companion.
            </Text>
            <TouchableOpacity style={styles.browseButton}>
              <Heart size={16} color="#f6e05e" />
              <Text style={styles.browseButtonText}>Browse All Voices</Text>
            </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  avatarsContainer: {
    gap: 20,
  },
  avatarCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  avatarHeader: {
    marginBottom: 16,
  },
  avatarInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  avatarIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarDetails: {
    flex: 1,
  },
  avatarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  avatarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0aec0',
  },
  avatarDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 16,
    lineHeight: 20,
  },
  avatarMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7fafc',
  },
  avatarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  previewButtonText: {
    fontSize: 14,
    color: '#f6e05e',
    fontWeight: '600',
  },
  purchaseArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  packsContainer: {
    gap: 20,
  },
  packCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  packHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  packIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  packEmoji: {
    fontSize: 40,
  },
  packName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  packDescription: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
  packContent: {
    marginBottom: 20,
  },
  includesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 8,
  },
  voicesList: {
    gap: 8,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceText: {
    fontSize: 14,
    color: '#a0aec0',
  },
  packFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packPricing: {
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: '#4a5568',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  currentPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
  },
  discountBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  buyPackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buyPackButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  previewCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 12,
  },
  previewText: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  browseButtonText: {
    fontSize: 16,
    color: '#f6e05e',
    fontWeight: '600',
  },
});