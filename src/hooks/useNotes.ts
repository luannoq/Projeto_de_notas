import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { LocationData } from './useLocation';

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export function useNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesList: Note[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            userId: data.userId,
            createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
          };
        });
        // Ordenar no cliente, mais recentes primeiro
        notesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setNotes(notesList);
        setLoading(false);
      },
      (err) => {
        console.log('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const createNote = useCallback(
    async (
      title: string,
      content: string,
      location?: LocationData | null
    ): Promise<string | null> => {
      if (!userId) return null;

      try {
        const docRef = await addDoc(collection(db, 'notes'), {
          title,
          content,
          userId,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          address: location?.address ?? null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (err: any) {
        setError(err.message);
        return null;
      }
    },
    [userId]
  );

  const updateNote = useCallback(
    async (id: string, title: string, content: string): Promise<boolean> => {
      try {
        await updateDoc(doc(db, 'notes', id), {
          title,
          content,
          updatedAt: serverTimestamp(),
        });
        return true;
      } catch (err: any) {
        setError(err.message);
        return false;
      }
    },
    []
  );

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  return { notes, loading, error, createNote, updateNote, deleteNote };
}