import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';

export default function MenuSelectionScreen() {
  const router = useRouter();
  const { drinks } = useDrinks();
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleDrinkSelection = (drinkId: string) => {
    setSelectedDrinks(prev => 
      prev.includes(drinkId) 
        ? prev.filter(id => id !== drinkId)
        : [...prev, drinkId]
    );
  };

  const handleNext = () => {
    if (selectedDrinks.length > 0) {
      router.push('/menu/edit');
    }
  };

  const selectedDrinksData = drinks.filter(drink => selectedDrinks.includes(drink.id));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Generate Menu</Text>
            <Text style={styles.subtitle}>Select drinks for your menu</Text>
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.selectionSummary}>
            <Text style={styles.summaryText}>
              {selectedDrinks.length} of {drinks.length} selected
            </Text>
          </View>

          <ScrollView style={styles.drinksList} showsVerticalScrollIndicator={false}>
            {drinks.map((drink, index) => {
              const isSelected = selectedDrinks.includes(drink.id);
              return (
                <Animated.View
                  key={drink.id}
                  style={[
                    styles.drinkCard,
                    { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })}] }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.drinkButton,
                      isSelected && styles.selectedDrink
                    ]}
                    onPress={() => toggleDrinkSelection(drink.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.drinkPreview}>
                      <View style={styles.emojiContainer}>
                        {drink.emojis.slice(0, 3).map((emoji, i) => (
                          <Text key={i} style={styles.emojiText}>{emoji}</Text>
                        ))}
                      </View>
                      <View style={styles.drinkInfo}>
                        <Text style={styles.drinkName}>{drink.name}</Text>
                        <Text style={styles.drinkDesc}>{drink.description}</Text>
                        <Text style={styles.drinkEmojis}>
                          {drink.emojis.join(' ')}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                      {isSelected && <Check size={20} color={Colors.white} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.nextButton, selectedDrinks.length === 0 && styles.disabledButton]}
            onPress={handleNext}
            disabled={selectedDrinks.length === 0}
          >
            <LinearGradient
              colors={selectedDrinks.length > 0 ? Gradients.button : ['#E2E8F0', '#E2E8F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.nextButtonText}>
                Next: Customize Menu ({selectedDrinks.length} drinks)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  spacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectionSummary: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  drinksList: {
    flex: 1,
    marginBottom: 20,
  },
  drinkCard: {
    marginBottom: 12,
  },
  drinkButton: {
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
  selectedDrink: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  drinkPreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    marginRight: 16,
  },
  emojiText: {
    fontSize: 20,
    marginRight: 4,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  drinkDesc: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  drinkEmojis: {
    fontSize: 12,
    color: Colors.textLight,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
});
