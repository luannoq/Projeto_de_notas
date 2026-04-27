import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Note } from '../hooks/useNotes';
import MapModal from './MapModal';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const { t } = useTranslation();
  const [mapVisible, setMapVisible] = useState(false);

  const formattedDate = note.createdAt.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  function handleDelete() {
    Alert.alert(
      t('notes.deleteConfirm'),
      t('notes.deleteMessage'),
      [
        { text: t('notes.cancel'), style: 'cancel' },
        {
          text: t('notes.delete'),
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ]
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onEdit(note)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.content} numberOfLines={3}>
          {note.content}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.date}>📅 {formattedDate}</Text>
          {note.latitude && note.longitude && (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => setMapVisible(true)}
            >
              <Text style={styles.mapButtonText}>
                📍 {t('notes.viewMap')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {note.address && (
          <Text style={styles.address} numberOfLines={1}>
            📌 {note.address}
          </Text>
        )}
      </TouchableOpacity>

      {note.latitude && note.longitude && (
        <MapModal
          visible={mapVisible}
          latitude={note.latitude}
          longitude={note.longitude}
          noteTitle={note.title}
          address={note.address}
          onClose={() => setMapVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: '#64748B',
    fontSize: 12,
  },
  mapButton: {
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapButtonText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
