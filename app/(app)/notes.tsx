import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../../src/config/firebase';
import { useNotes, Note } from '../../src/hooks/useNotes';
import { useLocation } from '../../src/hooks/useLocation';
import { sendNoteCreatedNotification } from '../../src/hooks/useNotifications';
import NoteCard from '../../src/components/NoteCard';

export default function NotesScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid);
  const { getCurrentLocation, loading: locationLoading } = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  function openCreateModal() {
    setEditingNote(null);
    setTitleInput('');
    setContentInput('');
    setModalVisible(true);
  }

  function openEditModal(note: Note) {
    setEditingNote(note);
    setTitleInput(note.title);
    setContentInput(note.content);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!titleInput.trim()) return;
    setSaving(true);

    try {
      if (editingNote) {
        await updateNote(editingNote.id, titleInput.trim(), contentInput.trim());
      } else {
        const location = await getCurrentLocation();
        const id = await createNote(titleInput.trim(), contentInput.trim(), location);
        if (id) {
          await sendNoteCreatedNotification(titleInput.trim());
        }
      }
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
  }

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('notes.title')}</Text>
          <Text style={styles.headerSub}>
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('common.search')}
          placeholderTextColor="#475569"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 60 }} />
      ) : filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>{t('notes.empty')}</Text>
          <Text style={styles.emptySubtitle}>{t('notes.emptySubtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard note={item} onEdit={openEditModal} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNote ? t('notes.editNote') : t('notes.newNote')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{t('notes.titleLabel')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('notes.titlePlaceholder')}
              placeholderTextColor="#475569"
              value={titleInput}
              onChangeText={setTitleInput}
              maxLength={100}
            />

            <Text style={styles.inputLabel}>{t('notes.contentLabel')}</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder={t('notes.contentPlaceholder')}
              placeholderTextColor="#475569"
              value={contentInput}
              onChangeText={setContentInput}
              multiline
              textAlignVertical="top"
            />

            {!editingNote && (locationLoading || saving) && (
              <View style={styles.locationHint}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.locationHintText}>
                  {locationLoading ? t('location.getting') : t('notes.saving')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveButton, (saving || locationLoading) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || locationLoading}
            >
              <Text style={styles.saveButtonText}>
                {saving ? t('notes.saving') : t('notes.save')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: { color: '#F1F5F9', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: '#64748B', fontSize: 13, marginTop: 2 },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  addButtonText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 16 },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    color: '#F1F5F9',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#64748B', fontSize: 14, textAlign: 'center' },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '800' },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: { color: '#94A3B8', fontWeight: '700' },
  inputLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  modalInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    color: '#F1F5F9',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  textArea: { height: 120 },
  locationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  locationHintText: { color: '#64748B', fontSize: 13 },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
