import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import i18n, { setStoredLanguage } from '../../src/i18n';
import { auth } from '../../src/config/firebase';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  async function changeLanguage(lang: string) {
    await i18n.changeLanguage(lang);
    await setStoredLanguage(lang);
    setCurrentLang(lang);
  }

  function handleLogout() {
    Alert.alert(t('settings.logoutConfirm'), t('settings.logoutMessage'), [
      { text: t('notes.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <View style={styles.content}>
        {/* Account Section */}
        <Text style={styles.sectionLabel}>{t('settings.account')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowEmoji}>👤</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>{t('settings.email')}</Text>
              <Text style={styles.rowValue}>{user?.email ?? '—'}</Text>
            </View>
          </View>
          {user?.displayName && (
            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: '#334155' }]}>
              <Text style={styles.rowEmoji}>✏️</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Nome / Name</Text>
                <Text style={styles.rowValue}>{user.displayName}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Language Section */}
        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.langRow}
            onPress={() => changeLanguage('pt')}
          >
            <View style={styles.langLeft}>
              <Text style={styles.rowEmoji}>🇧🇷</Text>
              <Text style={styles.langLabel}>{t('settings.portuguese')}</Text>
            </View>
            {currentLang === 'pt' && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.langRow}
            onPress={() => changeLanguage('en')}
          >
            <View style={styles.langLeft}>
              <Text style={styles.rowEmoji}>🇺🇸</Text>
              <Text style={styles.langLabel}>{t('settings.english')}</Text>
            </View>
            {currentLang === 'en' && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowEmoji}>🎓</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Curso</Text>
              <Text style={styles.rowValue}>Tecnologia em Desenvolvimento de Sistemas</Text>
            </View>
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: '#334155' }]}>
            <Text style={styles.rowEmoji}>📚</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Disciplina</Text>
              <Text style={styles.rowValue}>Mobile Application Development · CheckPoint 5</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 {t('settings.logout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: { color: '#F1F5F9', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  sectionLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowEmoji: { fontSize: 22 },
  rowInfo: { flex: 1 },
  rowLabel: { color: '#64748B', fontSize: 12, fontWeight: '500', marginBottom: 2 },
  rowValue: { color: '#F1F5F9', fontSize: 14, fontWeight: '500' },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  langLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langLabel: { color: '#F1F5F9', fontSize: 15, fontWeight: '500' },
  activeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#312E81',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  activeBadgeText: { color: '#6366F1', fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#334155', marginHorizontal: 16 },
  logoutButton: {
    marginTop: 28,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});
