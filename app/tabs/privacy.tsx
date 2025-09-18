import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Lock, EyeOff, Network, Database, Star, Sparkles, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Privacy() {
  const [syntheticDataEnabled, setSyntheticDataEnabled] = useState(true);
  const [blockchainProofGenerated, setBlockchainProofGenerated] = useState(false);

  const privacyFeatures = [
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted before leaving your device',
      icon: Lock,
      status: 'active',
      color: ['#10b981', '#059669']
    },
    {
      id: 'anonymization',
      title: 'Data Anonymization',
      description: 'Personal identifiers are stripped and replaced with secure tokens',
      icon: EyeOff,
      status: 'active',
      color: ['#3b82f6', '#06b6d4']
    },
    {
      id: 'blockchain',
      title: 'Blockchain Verification',
      description: 'Cryptographic proofs verify data integrity without revealing content',
      icon: Network,
      status: 'pending',
      color: ['#8b5cf6', '#a855f7']
    },
    {
      id: 'synthetic',
      title: 'Synthetic Data Generation',
      description: 'AI creates realistic but fake data for matching while preserving privacy',
      icon: Database,
      status: syntheticDataEnabled ? 'active' : 'disabled',
      color: ['#f6e05e', '#fbbf24']
    }
  ];

  const blockchainSteps = [
    {
      id: 1,
      title: 'Generate Encrypted Profile',
      description: 'Create cryptographic proof of your wellness profile',
      completed: blockchainProofGenerated,
      action: () => setBlockchainProofGenerated(true)
    },
    {
      id: 2,
      title: 'Submit to Blockchain',
      description: 'Store your encrypted proof on the decentralized network',
      completed: false,
      disabled: !blockchainProofGenerated,
      action: () => console.log('Submit to blockchain')
    },
    {
      id: 3,
      title: 'Enable Oracle Matching',
      description: 'Allow secure matching with compatible individuals',
      completed: false,
      disabled: !blockchainProofGenerated,
      action: () => console.log('Enable matching')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#fbbf24';
      case 'disabled': return '#4a5568';
      default: return '#4a5568';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle2;
      case 'pending': return AlertTriangle;
      case 'disabled': return EyeOff;
      default: return Shield;
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
            <Shield size={48} color="#1a202c" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Privacy Sanctuary</Text>
          <Text style={styles.headerSubtitle}>Blockchain privacy & synthetic data matching</Text>
        </View>

        {/* Privacy Features Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Protection Features</Text>
          <View style={styles.featuresContainer}>
            {privacyFeatures.map((feature) => {
              const IconComponent = feature.icon;
              const StatusIconComponent = getStatusIcon(feature.status);
              
              return (
                <View key={feature.id} style={styles.featureCard}>
                  <View style={styles.featureHeader}>
                    <View style={styles.featureLeft}>
                      <LinearGradient
                        colors={feature.color}
                        style={styles.featureIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconComponent size={24} color="white" />
                      </LinearGradient>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(feature.status) + '20' }]}>
                      <StatusIconComponent size={12} color={getStatusColor(feature.status)} />
                      <Text style={[styles.statusText, { color: getStatusColor(feature.status) }]}>
                        {feature.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Blockchain Integration Wizard */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.blockchainCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.blockchainHeader}>
              <Network size={24} color="#f6e05e" />
              <Text style={styles.blockchainTitle}>Blockchain Privacy Setup</Text>
            </View>
            <Text style={styles.blockchainSubtitle}>
              Secure your wellness data with cryptographic proofs and decentralized verification
            </Text>

            <View style={styles.stepsContainer}>
              {blockchainSteps.map((step) => (
                <View 
                  key={step.id} 
                  style={[
                    styles.stepItem,
                    { 
                      backgroundColor: step.completed 
                        ? '#10b981' + '20' 
                        : step.disabled 
                          ? '#4a5568' + '20' 
                          : '#f6e05e' + '20',
                      borderColor: step.completed 
                        ? '#10b981' 
                        : step.disabled 
                          ? '#4a5568' 
                          : '#f6e05e'
                    }
                  ]}
                >
                  <View style={styles.stepLeft}>
                    <View style={[
                      styles.stepNumber,
                      { 
                        backgroundColor: step.completed 
                          ? '#10b981' 
                          : step.disabled 
                            ? '#4a5568' 
                            : '#f6e05e'
                      }
                    ]}>
                      {step.completed ? (
                        <CheckCircle2 size={16} color="white" />
                      ) : (
                        <Text style={[
                          styles.stepNumberText,
                          { color: step.disabled ? '#a0aec0' : '#1a202c' }
                        ]}>
                          {step.id}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={[
                        styles.stepTitle,
                        { color: step.disabled ? '#4a5568' : '#f7fafc' }
                      ]}>
                        {step.title}
                      </Text>
                      <Text style={[
                        styles.stepDescription,
                        { color: step.disabled ? '#4a5568' : '#a0aec0' }
                      ]}>
                        {step.description}
                      </Text>
                    </View>
                  </View>

                  {!step.completed && (
                    <TouchableOpacity 
                      onPress={step.action}
                      disabled={step.disabled}
                      style={[
                        styles.stepButton,
                        { opacity: step.disabled ? 0.5 : 1 }
                      ]}
                    >
                      <LinearGradient
                        colors={['#f6e05e', '#fbbf24']}
                        style={styles.stepButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Zap size={16} color="#1a202c" />
                        <Text style={styles.stepButtonText}>
                          {step.id === 1 ? 'Generate' : step.id === 2 ? 'Submit' : 'Enable'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Synthetic Data Controls */}
        <View style={styles.section}>
          <View style={styles.syntheticCard}>
            <View style={styles.syntheticHeader}>
              <Database size={24} color="#f6e05e" />
              <Text style={styles.syntheticTitle}>Synthetic Data Preferences</Text>
            </View>
            <Text style={styles.syntheticSubtitle}>
              Control how your data is used for privacy-preserving matching
            </Text>

            <View style={styles.syntheticContent}>
              <View style={styles.syntheticToggle}>
                <View style={styles.syntheticToggleInfo}>
                  <Text style={styles.syntheticToggleLabel}>Enable Synthetic Data Generation</Text>
                  <Text style={styles.syntheticToggleDescription}>
                    Allow AI to create realistic but fake versions of your data for matching purposes. 
                    This provides additional privacy while enabling meaningful connections.
                  </Text>
                </View>
                <Switch
                  value={syntheticDataEnabled}
                  onValueChange={setSyntheticDataEnabled}
                  trackColor={{ false: '#2d3748', true: '#f6e05e' }}
                  thumbColor={syntheticDataEnabled ? '#1a202c' : '#a0aec0'}
                />
              </View>

              <View style={styles.howItWorks}>
                <Text style={styles.howItWorksTitle}>How Synthetic Data Works:</Text>
                <View style={styles.howItWorksList}>
                  <View style={styles.howItWorksItem}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.howItWorksText}>AI analyzes patterns in your wellness data</Text>
                  </View>
                  <View style={styles.howItWorksItem}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.howItWorksText}>Generates statistically similar but entirely artificial data points</Text>
                  </View>
                  <View style={styles.howItWorksItem}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.howItWorksText}>Uses synthetic data for matching while keeping your real data private</Text>
                  </View>
                  <View style={styles.howItWorksItem}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.howItWorksText}>Your actual data never leaves your encrypted profile</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Privacy Philosophy */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1a202c', '#2d3748']}
            style={styles.philosophyCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['#f6e05e', '#fbbf24']}
              style={styles.philosophyIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={24} color="#1a202c" />
            </LinearGradient>
            <Text style={styles.philosophyTitle}>Your Dignity is Preserved</Text>
            <Text style={styles.philosophyDescription}>
              Through cutting-edge cryptography and synthetic data generation, we ensure that your personal 
              wellness journey remains entirely private. You can connect with compatible individuals and 
              receive personalized support without ever compromising your sensitive data.
            </Text>

            <View style={styles.philosophyFeatures}>
              <View style={styles.philosophyFeature}>
                <Lock size={24} color="#f6e05e" />
                <Text style={styles.philosophyFeatureTitle}>Zero Knowledge</Text>
                <Text style={styles.philosophyFeatureDescription}>We never see your real data</Text>
              </View>
              <View style={styles.philosophyFeature}>
                <Shield size={24} color="#f6e05e" />
                <Text style={styles.philosophyFeatureTitle}>Cryptographic Security</Text>
                <Text style={styles.philosophyFeatureDescription}>Military-grade encryption</Text>
              </View>
              <View style={styles.philosophyFeature}>
                <Sparkles size={24} color="#f6e05e" />
                <Text style={styles.philosophyFeatureTitle}>Meaningful Connections</Text>
                <Text style={styles.philosophyFeatureDescription}>Privacy doesn't limit compatibility</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  featureDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  blockchainCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  blockchainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  blockchainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  blockchainSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 24,
    lineHeight: 20,
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
  stepButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  stepButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  syntheticCard: {
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  syntheticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  syntheticTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
  },
  syntheticSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 24,
  },
  syntheticContent: {
    gap: 24,
  },
  syntheticToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syntheticToggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  syntheticToggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 8,
  },
  syntheticToggleDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  howItWorks: {
    borderTopWidth: 1,
    borderTopColor: '#2d3748',
    paddingTop: 24,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7fafc',
    marginBottom: 16,
  },
  howItWorksList: {
    gap: 12,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  howItWorksText: {
    fontSize: 14,
    color: '#a0aec0',
    flex: 1,
    lineHeight: 20,
  },
  philosophyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  philosophyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  philosophyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7fafc',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 16,
  },
  philosophyDescription: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  philosophyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  philosophyFeature: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  philosophyFeatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f7fafc',
    textAlign: 'center',
  },
  philosophyFeatureDescription: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
});