import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';

const { width } = Dimensions.get('window');

const GARNISH_INGREDIENTS = [
  { emoji: '🍒', name: 'Cherry', description: 'Classic cocktail garnish' },
  { emoji: '🍋', name: 'Lemon Twist', description: 'Citrus peel garnish' },
  { emoji: '🌿', name: 'Mint', description: 'Fresh aromatic herb' },
  { emoji: '🌺', name: 'Hibiscus', description: 'Exotic flower' },
  { emoji: '🥝', name: 'Kiwi Slice', description: 'Tropical fruit slice' },
  { emoji: '🍊', name: 'Orange Slice', description: 'Citrus wheel' },
  { emoji: '🍓', name: 'Strawberry', description: 'Sweet berry' },
  { emoji: '🌶️', name: 'Chili Pepper', description: 'Spicy kick' },
  { emoji: '🫒', name: 'Olive', description: 'Savory garnish' },
  { emoji: '🧈', name: 'Whipped Cream', description: 'Creamy topping' },
  { emoji: '🍫', name: 'Chocolate', description: 'Sweet shavings' },
  { emoji: '🌰', name: 'Cinnamon', description: 'Spicy stick' },
];

export default function GarnishSelectionScreen() {
  const router = useRouter();
  const { mixingState, updateMixingState } = useDrinks();
  const [selectedGarnish, setSelectedGarnish] = useState<string[]>([]);
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

  const handleSelectGarnish = (emoji: string) => {
    if (selectedGarnish.includes(emoji)) {
      setSelectedGarnish(prev => prev.filter(g => g !== emoji));
    } else if (selectedGarnish.length < 5) {
      setSelectedGarnish(prev => [...prev, emoji]);
      setCurrentSelection(emoji);
      setShowQuantity(true);
    }
  };

  const handleQuantitySelect = (quantity: number | '∞') => {
    if (currentSelection) {
      const newGarnish = selectedGarnish.map(emoji => 
        emoji === currentSelection 
          ? { emoji, quantity, category: 'garnish' as const }
          : mixingState.garnish.find(g => g.emoji === emoji) || { emoji, quantity: 1, category: 'garnish' as const }
      );
      
      updateMixingState({
        step: 4,
        garnish: newGarnish,
      });
      setShowQuantity(false);
      setCurrentSelection(null);
    }
  };

  const handleMixItUp = () => {
    // Prepare all selected ingredients for the creation page
    const allEmojis = [
      ...mixingState.base.map(b => b.emoji),
      ...mixingState.flavors.map(f => f.emoji),
      ...mixingState.ice.map(i => i.emoji),
      ...selectedGarnish,
    ];

    if (allEmojis.length > 0) {
      // Navigate to creation with all selected emojis
      router.push({
        pathname: '/creation',
        params: { emojis: JSON.stringify(allEmojis) }
      });
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

  const getTotalIngredients = () => {
    return mixingState.base.length + mixingState.flavors.length + mixingState.ice.length + selectedGarnish.length;
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
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.activeDot]} />
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.stepTitle}>4. Garnish & Extras</Text>
          <Text style={styles.stepSubtitle}>Add finishing touches (optional)</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Mix So Far</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Base:</Text>
                <Text style={styles.summaryValue}>{mixingState.base.map(b => b.emoji).join(' ') || 'None'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Flavors:</Text>
                <Text style={styles.summaryValue}>{mixingState.flavors.map(f => f.emoji).join(' ') || 'None'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Effects:</Text>
                <Text style={styles.summaryValue}>{mixingState.ice.map(i => i.emoji).join(' ') || 'None'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Garnish:</Text>
                <Text style={styles.summaryValue}>{selectedGarnish.join(' ') || 'None'}</Text>
              </View>
            </View>
            <Text style={styles.totalCount}>Total: {getTotalIngredients()} ingredients</Text>
          </View>

          <ScrollView style={styles.ingredientsList} showsVerticalScrollIndicator={false}>
            {GARNISH_INGREDIENTS.map((ingredient, index) => {
              const isSelected = selectedGarnish.includes(ingredient.emoji);
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
                    onPress={() => handleSelectGarnish(ingredient.emoji)}
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
              onPress={handleMixItUp}
            >
              <Text style={styles.skipButtonText}>Skip Garnish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mixButton, getTotalIngredients() === 0 && styles.disabledButton]}
              onPress={handleMixItUp}
              disabled={getTotalIngredients() === 0}
            >
              <LinearGradient
                colors={getTotalIngredients() > 0 ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Sparkles size={20} color={Colors.white} />
                <Text style={styles.mixButtonText}>Mix It Up!</Text>
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
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryContent: {
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
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
  mixButton: {
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
  mixButtonText: {
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
