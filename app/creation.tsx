import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function CreationScreen() {
  const router = useRouter();
  const { emojis } = useLocalSearchParams<{ emojis: string }>();
  const { addDrink } = useDrinks();
  
  const selectedEmojis: string[] = emojis ? JSON.parse(emojis) : [];
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Floating animations for emojis
  const animations = selectedEmojis.map(() => {
    const anim = new Animated.Value(0);
    return anim;
  });

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + i * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + i * 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleCollect = () => {
    if (!name) return;
    
    addDrink({
      name,
      description: description || 'A refreshing blend of vibes...',
      emojis: selectedEmojis,
    });
    
    router.replace('/(tabs)');
  };

  const handlePourOut = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={Gradients.background} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Your Creation</Text>
              <Text style={styles.headerSubtitle}>Name it to collect it</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.visualizerContainer}>
            <LinearGradient
              colors={Gradients.drinkCard}
              style={styles.drinkContainer}
            >
              {selectedEmojis.map((emoji, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.floatingEmoji,
                    {
                      left: 20 + (i * 30) % 80,
                      top: 40 + (i * 40) % 150,
                      transform: [
                        {
                          translateY: animations[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -20],
                          }),
                        },
                        { scale: 1.5 + (i * 0.2) },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Animated.View>
              ))}
              <View style={styles.glassHighlight} />
            </LinearGradient>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Drink Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Magic Sunset Potion"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="A refreshing blend of vibes..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.pourOutButton} onPress={handlePourOut}>
              <Trash2 size={24} color={Colors.textLight} />
              <Text style={styles.pourOutText}>Pour it out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.collectButton, !name && styles.disabledButton]} 
              onPress={handleCollect}
              disabled={!name}
            >
              <LinearGradient
                colors={name ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Star size={20} color={Colors.white} />
                <Text style={styles.collectText}>Collect into Menu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  drinkContainer: {
    width: width * 0.4,
    height: width * 0.6,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  floatingEmoji: {
    position: 'absolute',
  },
  emojiText: {
    fontSize: 30,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginTop: 10,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 30,
  },
  pourOutButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 18,
  },
  pourOutText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  collectButton: {
    flex: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
    height: '100%',
  },
  collectText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
