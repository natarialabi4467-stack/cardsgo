import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';

const { width } = Dimensions.get('window');

const ICE_EFFECTS = [
  { emoji: '🧊', name: 'Ice Cubes', description: 'Classic chilling' },
  { emoji: '🧈', name: 'Crushed Ice', description: 'Fine texture' },
  { emoji: '❄️', name: 'Dry Ice', description: 'Smoky effect' },
  { emoji: '⚡', name: 'Lightning', description: 'Electric buzz' },
  { emoji: '✨', name: 'Sparkles', description: 'Magical shimmer' },
  { emoji: '🌟', name: 'Stars', description: 'Celestial glow' },
  { emoji: '🔥', name: 'Fire', description: 'Spicy heat' },
  { emoji: '🌈', name: 'Rainbow', description: 'Colorful spectrum' },
  { emoji: '💫', name: 'Dizzy', description: 'Whirling effect' },
  { emoji: '🌪️', name: 'Tornado', description: 'Swirling vortex' },
  { emoji: '🫧', name: 'Bubbles', description: 'Effervescent fizz' },
  { emoji: '🌊', name: 'Waves', description: 'Flowing motion' },
];

export default function IceEffectsScreen() {
  const router = useRouter();
  const { mixingState, updateMixingState } = useDrinks();
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [showQuantity, setShowQuantity] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelectEffect = (emoji: string) => {
    if (selectedEffects.includes(emoji)) {
      setSelectedEffects(prev => prev.filter(e => e !== emoji));
    } else if (selectedEffects.length < 5) {
      setSelectedEffects(prev => [...prev, emoji]);
      setCurrentSelection(emoji);
      setShowQuantity(true);
    }
  };

  const handleQuantitySelect = (quantity: number | '∞') => {
    if (currentSelection) {
      const newEffects = selectedEffects.map(emoji => 
        emoji === currentSelection 
          ? { emoji, quantity, category: 'ice' as const }
          : mixingState.ice.find(i => i.emoji === emoji) || { emoji, quantity: 1, category: 'ice' as const }
      );
      
      updateMixingState({
        step: 4,
        ice: newEffects,
      });
      setShowQuantity(false);
      setCurrentSelection(null);
    }
  };

  const handleNext = () => {
    if (selectedEffects.length > 0) {
      updateMixingState({ step: 4 });
      router.push('/mixer/garnish');
    } else {
      // Skip garnish if no effects selected
      updateMixingState({ step: 4 });
      router.push('/creation');
    }
  };

  const renderQuantityModal = () => {
    if (!showQuantity) return null;

    return (
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <Text style={styles.modalTitle}>How much?</Text>
          <Text style={styles.modalSubtitle}>Select the amount for {currentSelection}</Text>
          
          <View style={styles.quantityGrid}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.quantityButton}
                onPress={() => handleQuantitySelect(num)}
              >
                <Text style={styles.quantityText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.quantityButton, styles.infinityButton]}
              onPress={() => handleQuantitySelect('∞')}
            >
              <Text style={styles.quantityText}>∞</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressDot} />
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.stepTitle}>3. Ice & Effects</Text>
          <Text style={styles.stepSubtitle}>Add temperature and special effects (optional)</Text>

          <ScrollView style={styles.ingredientsList} showsVerticalScrollIndicator={false}>
            {ICE_EFFECTS.map((ingredient, index) => {
              const isSelected = selectedEffects.includes(ingredient.emoji);
              return (
                <Animated.View
                  key={ingredient.emoji}
                  style={[
                    styles.ingredientCard,
                    { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })}] }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.ingredientButton,
                      isSelected && styles.selectedIngredient
                    ]}
                    onPress={() => handleSelectEffect(ingredient.emoji)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.emojiContainer}>
                      <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
                    </View>
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      <Text style={styles.ingredientDesc}>{ingredient.description}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.textLight} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.skipButton]}
              onPress={() => {
                updateMixingState({ step: 4 });
                router.push('/mixer/garnish');
              }}
            >
              <Text style={styles.skipButtonText}>Skip Ice & Effects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, selectedEffects.length === 0 && styles.disabledButton]}
              onPress={handleNext}
              disabled={selectedEffects.length === 0}
            >
              <LinearGradient
                colors={selectedEffects.length > 0 ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Sparkles size={20} color={Colors.white} />
                <Text style={styles.nextButtonText}>Next: Garnish</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {renderQuantityModal()}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  spacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 30,
  },
  ingredientsList: {
    flex: 1,
    marginBottom: 20,
  },
  ingredientCard: {
    marginBottom: 12,
  },
  ingredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedIngredient: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientDesc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textLight,
  },
  skipButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 30,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  quantityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  infinityButton: {
    backgroundColor: Colors.primary,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
