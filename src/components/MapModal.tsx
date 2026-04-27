import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';

interface MapModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  noteTitle: string;
  address?: string;
  onClose: () => void;
}

export default function MapModal({
  visible,
  latitude,
  longitude,
  noteTitle,
  address,
  onClose,
}: MapModalProps) {
  const { t } = useTranslation();

  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t('map.title')}</Text>
            <Text style={styles.noteTitle} numberOfLines={1}>
              {noteTitle}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t('map.close')}</Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={noteTitle}
            description={address || t('map.noteCreated')}
            pinColor="#6366F1"
          />
        </MapView>

        {address && (
          <View style={styles.addressBar}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F172A',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noteTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 14,
  },
  map: {
    flex: 1,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 10,
  },
  addressIcon: {
    fontSize: 18,
  },
  addressText: {
    color: '#CBD5E1',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
