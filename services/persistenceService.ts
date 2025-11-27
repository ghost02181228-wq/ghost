import { Asset, Transaction } from '../types';
import { FIREBASE_CONFIG_STRING } from '../constants';

// NOTE: We are dynamically importing firebase logic or falling back to localStorage
// to ensure the app doesn't crash if Firebase isn't set up.

class PersistenceService {
  private useFirebase: boolean = false;
  private db: any = null;

  constructor() {
    this.init();
  }

  private async init() {
    if (FIREBASE_CONFIG_STRING) {
      try {
        // In a real CLI environment, we would import { initializeApp } from 'firebase/app';
        // For this generated output to work in a preview without npm install, 
        // we mainly rely on LocalStorage, but structued to allow easy swap.
        // If the user provides a valid config string, we assume they have the SDK.
        
        // For this demo: We default to LocalStorage to guarantee "Run Anywhere" capability
        // as requested ("Preview Mode"). Real Firebase requires actual SDK imports which might
        // not be present in the sandbox.
        // However, I will simulate the logic structure.
        this.useFirebase = false; 
        console.log("System: Firebase config detected but using LocalStorage for stability in preview.");
      } catch (e) {
        console.warn("Firebase init failed:", e);
        this.useFirebase = false;
      }
    }
  }

  // --- Transactions ---

  async getTransactions(): Promise<Transaction[]> {
    if (this.useFirebase) {
      // Real Firestore logic would go here
      return [];
    } else {
      const stored = localStorage.getItem('alp_transactions');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async addTransaction(tx: Transaction): Promise<void> {
    if (this.useFirebase) {
      // Real Firestore logic
    } else {
      const current = await this.getTransactions();
      const updated = [tx, ...current];
      localStorage.setItem('alp_transactions', JSON.stringify(updated));
      
      // Update assets derived from transactions for simplicity in Mock mode
      this.updateAssetsFromTransaction(tx);
    }
  }

  // --- Assets ---

  async getAssets(): Promise<Asset[]> {
    if (this.useFirebase) {
      return [];
    } else {
      const stored = localStorage.getItem('alp_assets');
      return stored ? JSON.parse(stored) : [];
    }
  }

  // Helper to maintain asset state in LocalStorage mode
  private async updateAssetsFromTransaction(tx: Transaction) {
    const assets = await this.getAssets();
    const existingIndex = assets.findIndex(a => a.symbol === tx.symbol);

    if (existingIndex > -1) {
      const asset = assets[existingIndex];
      if (tx.type === 'BUY') {
        const totalCost = (asset.avgCost * asset.quantity) + (tx.price * tx.quantity);
        const newQuantity = asset.quantity + tx.quantity;
        asset.avgCost = totalCost / newQuantity;
        asset.quantity = newQuantity;
      } else {
        asset.quantity -= tx.quantity;
      }
      
      if (asset.quantity <= 0) {
        assets.splice(existingIndex, 1);
      }
    } else if (tx.type === 'BUY') {
      assets.push({
        id: crypto.randomUUID(),
        symbol: tx.symbol,
        name: tx.symbol, // Simplified
        quantity: tx.quantity,
        avgCost: tx.price
      });
    }
    
    localStorage.setItem('alp_assets', JSON.stringify(assets));
  }
  
  // Method to clear data for testing
  clearData() {
      localStorage.removeItem('alp_assets');
      localStorage.removeItem('alp_transactions');
  }
}

export const persistenceService = new PersistenceService();
