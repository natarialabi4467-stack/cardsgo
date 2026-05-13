import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, FileText, Plus, Share2, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { drinks, isFirstTime } = useDrinks();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartMixing = () => {
    // Use the new step-by-step mixer flow
    router.push('/mixer/base');
  };

  const handleGenerateMenu = () => {
    if (drinks.length > 0) {
      router.push('/menu/select');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Sparkles size={48} color={Colors.primary} />
          </View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>emojDRiNKs</Text>
          <Text style={styles.subtitle}>Create your unique drink</Text>
        </View>
      </Animated.View>

      <Animated.View style={{
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          })
        }]
      }}>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStartMixing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Gradients.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.startButtonText}>Start Mixing</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderDrinkList = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Emoji Mixology</Text>
          <Text style={styles.subtitle}>Your unique drink menu</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.actionIcon, drinks.length === 0 && styles.disabledIcon]} 
            onPress={handleGenerateMenu}
            disabled={drinks.length === 0}
          >
            <FileText size={20} color={drinks.length > 0 ? Colors.primary : Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareIcon}>
            <Share2 size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {drinks.map((drink) => (
          <TouchableOpacity 
            key={drink.id} 
            style={styles.drinkCard}
            activeOpacity={0.9}
          >
            <View style={styles.drinkPreview}>
              <LinearGradient
                colors={Gradients.drinkCard}
                style={styles.drinkGradient}
              >
                <Text style={styles.previewEmoji}>{drink.emojis[0]}</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.drinkInfo}>
              <Text style={styles.drinkName}>{drink.name}</Text>
              <Text style={styles.drinkDesc} numberOfLines={1}>{drink.description}</Text>
              <View style={styles.emojiList}>
                {drink.emojis.map((emoji, idx) => (
                  <Text key={idx} style={styles.miniEmoji}>{emoji}</Text>
                ))}
              </View>
            </View>
            
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleStartMixing}
        activeOpacity={0.8}
      >
        <View style={styles.fabContent}>
          <Plus size={24} color={Colors.white} />
          <Text style={styles.fabText}>Mix New Drink</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
    >
      {drinks.length === 0 ? renderEmptyState() : renderDrinkList()}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logoShadow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.05,
    top: -20,
    left: -20,
  },
  logoEmoji: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  mainButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  startButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  shareIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  drinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  drinkPreview: {
    width: 70,
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 16,
  },
  drinkGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 30,
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
  emojiList: {
    flexDirection: 'row',
    gap: 4,
  },
  miniEmoji: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fabText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
