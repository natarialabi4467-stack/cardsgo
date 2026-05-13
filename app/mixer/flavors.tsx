import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';

const { width } = Dimensions.get('window');

const FLAVOR_INGREDIENTS = [
  { emoji: '🍓', name: 'Strawberry', description: 'Sweet and fruity' },
  { emoji: '🍋', name: 'Lemon', description: 'Zesty and bright' },
  { emoji: '🍊', name: 'Orange', description: 'Citrus burst' },
  { emoji: '🥭', name: 'Mango', description: 'Tropical sweet' },
  { emoji: '🍒', name: 'Cherry', description: 'Rich and bold' },
  { emoji: '🫐', name: 'Blueberry', description: 'Deep and tangy' },
  { emoji: '🍑', name: 'Peach', description: 'Juicy and sweet' },
  { emoji: '🥝', name: 'Kiwi', description: 'Tart and fresh' },
  { emoji: '🍍', name: 'Pineapple', description: 'Exotic tang' },
  { emoji: '🍉', name: 'Watermelon', description: 'Refreshing sweet' },
  { emoji: '🍌', name: 'Banana', description: 'Creamy smooth' },
  { emoji: '🍇', name: 'Grape', description: 'Sweet and bold' },
];

export default function FlavorsSelectionScreen() {
  const router = useRouter();
  const { mixingState, updateMixingState } = useDrinks();
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
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

  const handleSelectFlavor = (emoji: string) => {
    if (selectedFlavors.includes(emoji)) {
      setSelectedFlavors(prev => prev.filter(f => f !== emoji));
    } else if (selectedFlavors.length < 5) {
      setSelectedFlavors(prev => [...prev, emoji]);
      setCurrentSelection(emoji);
      setShowQuantity(true);
    }
  };

  const handleQuantitySelect = (quantity: number | '∞') => {
    if (currentSelection) {
      const newFlavors = selectedFlavors.map(emoji => 
        emoji === currentSelection 
          ? { emoji, quantity, category: 'flavors' as const }
          : mixingState.flavors.find(f => f.emoji === emoji) || { emoji, quantity: 1, category: 'flavors' as const }
      );
      
      updateMixingState({
        step: 3,
        flavors: newFlavors,
      });
      setShowQuantity(false);
      setCurrentSelection(null);
    }
  };

  const handleNext = () => {
    if (selectedFlavors.length > 0) {
      updateMixingState({ step: 3 });
      router.push('/mixer/ice');
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
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.stepTitle}>2. Select Flavors</Text>
          <Text style={styles.stepSubtitle}>Add taste dimensions (max 5)</Text>

          <ScrollView style={styles.ingredientsList} showsVerticalScrollIndicator={false}>
            {FLAVOR_INGREDIENTS.map((ingredient, index) => {
              const isSelected = selectedFlavors.includes(ingredient.emoji);
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
                    onPress={() => handleSelectFlavor(ingredient.emoji)}
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

          <TouchableOpacity
            style={[styles.nextButton, selectedFlavors.length === 0 && styles.disabledButton]}
            onPress={handleNext}
            disabled={selectedFlavors.length === 0}
          >
            <LinearGradient
              colors={selectedFlavors.length > 0 ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.nextButtonText}>Next: Ice & Effects</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  nextButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
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
