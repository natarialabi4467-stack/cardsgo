import { Colors, Gradients } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const INGREDIENTS = {
  SWEETS: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯'],
  VIBES: ['✨', '⭐', '🌟', '🔥', '🧊', '🫧', '🌿', '🌸', '🌺', '🌹', '🌻', '🌈', '⚡', '💖', '❄️'],
  FRUITS: ['🍓', '🍒', '🍎', '🍉', '🍑', '🍊', '🍍', '🍌', '🍋', '🥝', '🍇', '🫐', '🍈', '🥭'],
};

export default function MixerScreen() {
  const router = useRouter();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(prev => prev.filter(e => e !== emoji));
    } else if (selectedEmojis.length < 5) {
      setSelectedEmojis(prev => [...prev, emoji]);
    }
  };

  const removeEmoji = (index: number) => {
    setSelectedEmojis(prev => prev.filter((_, i) => i !== index));
  };

  const handleMix = () => {
    if (selectedEmojis.length > 0) {
      // Pass selected emojis to the creation screen
      router.push({
        pathname: '/creation',
        params: { emojis: JSON.stringify(selectedEmojis) }
      });
    }
  };

  const renderCategory = (title: string, emojis: string[]) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.emojiGrid}>
        {emojis.map((emoji) => {
          const isSelected = selectedEmojis.includes(emoji);
          return (
            <TouchableOpacity
              key={emoji}
              style={[styles.emojiButton, isSelected && styles.selectedEmojiButton]}
              onPress={() => toggleEmoji(emoji)}
              activeOpacity={0.7}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={Gradients.background} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Ingredients</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.selectionArea}>
          <View style={styles.selectionSlots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.slot}>
                {selectedEmojis[i] ? (
                  <View style={styles.selectedEmojiWrapper}>
                    <Text style={styles.slotEmoji}>{selectedEmojis[i]}</Text>
                    <TouchableOpacity 
                      style={styles.removeIcon} 
                      onPress={() => removeEmoji(i)}
                    >
                      <X size={12} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.emptySlot} />
                )}
              </View>
            ))}
            <Text style={styles.counterText}>{selectedEmojis.length}/5</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCategory('SWEETS', INGREDIENTS.SWEETS)}
          {renderCategory('VIBES', INGREDIENTS.VIBES)}
          {renderCategory('FRUITS', INGREDIENTS.FRUITS)}
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.mixButton, selectedEmojis.length === 0 && styles.disabledButton]}
            onPress={handleMix}
            disabled={selectedEmojis.length === 0}
          >
            <LinearGradient
              colors={selectedEmojis.length > 0 ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Sparkles size={20} color={Colors.white} />
              <Text style={styles.mixButtonText}>Mix It Up!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  selectionArea: {
    padding: 20,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectionSlots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  slot: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  selectedEmojiWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotEmoji: {
    fontSize: 24,
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.text,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  counterText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  categoryContainer: {
    marginBottom: 30,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textLight,
    marginBottom: 15,
    letterSpacing: 1,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: (width - 80) / 5,
    height: (width - 80) / 5,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  selectedEmojiButton: {
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  emojiText: {
    fontSize: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  mixButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  mixButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
