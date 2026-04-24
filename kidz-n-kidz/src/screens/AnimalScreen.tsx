import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { ANIMALS, Animal } from '../data/animals';
import { ScreenProps } from '../navigation/types';
import { C } from '../theme';

export default function AnimalScreen({ navigation }: ScreenProps<'Animals'>) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  async function playSound(uri: string, id: string) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      setPlayingId(id);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.log('Error playing sound', error);
      setPlayingId(null);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderItem = ({ item }: { item: Animal }) => (
    <Pressable 
      style={[s.card, playingId === item.id && s.cardPlaying]} 
      onPress={() => playSound(item.sound, item.id)}
    >
      <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={s.image} />
      <View style={s.footer}>
        <Text style={s.name}>{item.name}</Text>
        {playingId === item.id ? (
          <ActivityIndicator size="small" color={C.brand} />
        ) : (
          <Text style={s.icon}>🔊</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={s.title}>Real Animals</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <FlatList
        data={ANIMALS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4F8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  backIcon: { fontSize: 20 },
  title: { fontSize: 24, fontWeight: '900', color: C.ink },
  list: { padding: 10 },
  card: {
    flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardPlaying: { borderColor: C.brand, borderWidth: 3 },
  image: { width: '100%', height: 120, resizeMode: 'cover' },
  footer: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '800', color: C.ink },
  icon: { fontSize: 18 },
});
