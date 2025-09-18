// Credits Service for managing user credits
import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDITS_KEY = 'user_credits';
const INITIAL_CREDITS = 100;

export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  timestamp: Date;
}

export class CreditsService {
  static async getCredits(): Promise<number> {
    try {
      const credits = await AsyncStorage.getItem(CREDITS_KEY);
      return credits ? parseInt(credits, 10) : INITIAL_CREDITS;
    } catch (error) {
      console.error('Error getting credits:', error);
      return INITIAL_CREDITS;
    }
  }

  static async addCredits(amount: number, description: string): Promise<number> {
    try {
      const currentCredits = await this.getCredits();
      const newCredits = currentCredits + amount;
      await AsyncStorage.setItem(CREDITS_KEY, newCredits.toString());
      
      // Log transaction
      await this.logTransaction({
        id: Date.now().toString(),
        amount,
        type: 'earned',
        description,
        timestamp: new Date(),
      });
      
      return newCredits;
    } catch (error) {
      console.error('Error adding credits:', error);
      throw error;
    }
  }

  static async spendCredits(amount: number, description: string): Promise<number> {
    try {
      const currentCredits = await this.getCredits();
      
      if (currentCredits < amount) {
        throw new Error('Insufficient credits');
      }
      
      const newCredits = currentCredits - amount;
      await AsyncStorage.setItem(CREDITS_KEY, newCredits.toString());
      
      // Log transaction
      await this.logTransaction({
        id: Date.now().toString(),
        amount,
        type: 'spent',
        description,
        timestamp: new Date(),
      });
      
      return newCredits;
    } catch (error) {
      console.error('Error spending credits:', error);
      throw error;
    }
  }

  static async logTransaction(transaction: CreditTransaction): Promise<void> {
    try {
      const transactions = await this.getTransactionHistory();
      transactions.unshift(transaction);
      
      // Keep only last 100 transactions
      const trimmedTransactions = transactions.slice(0, 100);
      await AsyncStorage.setItem('credit_transactions', JSON.stringify(trimmedTransactions));
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  }

  static async getTransactionHistory(): Promise<CreditTransaction[]> {
    try {
      const transactions = await AsyncStorage.getItem('credit_transactions');
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }
}
