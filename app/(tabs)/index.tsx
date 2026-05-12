import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Plus, Share2, Sparkles } from 'lucide-react-native';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { drinks } = useDrinks();

  const handleStartMixing = () => {
    router.push('/mixer');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.title}>Emoji Mixology</Text>
      <Text style={styles.subtitle}>Your unique drink menu</Text>
      
      <View style={styles.logoWrapper}>
        <View style={styles.logoShadow} />
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🍹</Text>
        </View>
      </View>

      <Text style={styles.emptyTitle}>No Drinks Yet!</Text>
      <Text style={styles.emptyText}>
        Mix up your first unique emoji drink and start building your menu.
      </Text>

      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={handleStartMixing}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Sparkles size={20} color={Colors.white} />
          <Text style={styles.buttonText}>Start Mixing</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderDrinkList = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Emoji Mixology</Text>
          <Text style={styles.subtitle}>Your unique drink menu</Text>
        </View>
        <TouchableOpacity style={styles.shareIcon}>
          <Share2 size={20} color={Colors.primary} />
        </TouchableOpacity>
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
  logoWrapper: {
    position: 'relative',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
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
