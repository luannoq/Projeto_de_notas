import { useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export function useLocation() {
  const [loading, setLoading] = useState(false);

  async function getCurrentLocation(): Promise<LocationData | null> {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada / Permission denied',
          'Precisamos da localização para marcar onde a nota foi criada.\nWe need location to mark where the note was created.'
        );
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      // Optional geocoding - get address from coordinates
      try {
        const [addressResult] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (addressResult) {
          const parts = [
            addressResult.street,
            addressResult.district,
            addressResult.city,
          ].filter(Boolean);
          locationData.address = parts.join(', ');
        }
      } catch {
        // Geocoding is optional, don't fail
      }

      return locationData;
    } catch (error) {
      Alert.alert(
        'Erro / Error',
        'Não foi possível obter a localização.\nCould not get location.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { getCurrentLocation, loading };
}
