import { BusinessCardData } from '../types';
import { DEFAULT_CARD } from '../utils/defaultData';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// KEY FOR LOCAL STORAGE DEMO
const LOCAL_STORAGE_KEY = 'awjtech_cards';

export const cardService = {
  // Get all cards (for admin)
  getAllCards: async (): Promise<BusinessCardData[]> => {
    let firebaseCards: BusinessCardData[] = [];
    
    // 1. Try Firebase
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "cards"));
        querySnapshot.forEach((doc) => {
          firebaseCards.push(doc.data() as BusinessCardData);
        });
      } catch (e) {
        console.error("Error fetching from Firebase:", e);
        // We don't throw here to allow fallback to local storage if offline/error
      }
    }

    // 2. Get Local Storage
    let localCards: BusinessCardData[] = [];
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      localCards = JSON.parse(local);
    }

    // 3. Merge (Prefer Firebase if available, else Local, else Default)
    if (firebaseCards.length > 0) return firebaseCards;
    if (localCards.length > 0) return localCards;

    // 4. Fallback to Default
    return [DEFAULT_CARD];
  },

  // Get single card by slug
  getCardBySlug: async (slug: string): Promise<BusinessCardData | null> => {
    const cards = await cardService.getAllCards();
    return cards.find(c => c.slug === slug) || null;
  },

  // Save/Update Card
  saveCard: async (card: BusinessCardData): Promise<void> => {
    // 1. Save to Firebase if available
    if (db) {
      try {
        await setDoc(doc(db, "cards", card.id), card);
      } catch (e) {
        console.error("Error saving to Firebase", e);
        throw e; // Throw so UI shows error
      }
    }

    // 2. Save to Local Storage (Always keep sync for demo)
    const cards = await cardService.getAllCards();
    const existingIndex = cards.findIndex(c => c.id === card.id);
    
    let newCards = [...cards];
    if (existingIndex >= 0) {
      newCards[existingIndex] = card;
    } else {
      newCards.push(card);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCards));
  },

  // Delete Card
  deleteCard: async (id: string): Promise<void> => {
    // 1. Delete from Firebase
    if (db) {
      try {
        await deleteDoc(doc(db, "cards", id));
      } catch (e) {
        console.error("Error deleting from Firebase", e);
        throw e; // Throw so UI shows error
      }
    }

    // 2. Delete from Local Storage
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      let cards = JSON.parse(local) as BusinessCardData[];
      cards = cards.filter(c => c.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
    }
  }
};