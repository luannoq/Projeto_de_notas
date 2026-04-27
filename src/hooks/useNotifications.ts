import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
  }

  return 'local-only';
}

export async function sendWelcomeNotification(userName?: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '👋 Bem-vindo! / Welcome!',
        body: userName
          ? `Olá, ${userName}! Suas notas estão te esperando.`
          : 'Que bom ter você de volta!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  } catch (e) {
    console.log('Notificação não suportada no Expo Go');
  }
}

export async function sendNoteCreatedNotification(noteTitle: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Nota salva! / Note saved!',
        body: `"${noteTitle}" foi salva com sucesso.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  } catch (e) {
    console.log('Notificação não suportada no Expo Go');
  }
}

export async function scheduleReminderNotification(
  noteTitle: string,
  date: Date
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Lembrete / Reminder',
      body: `Você tem uma nota: "${noteTitle}"`,
      sound: true,
    },
    trigger: { date } as any,
  });
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}