import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Download, Share2, Palette } from 'lucide-react-native';
import { Colors, Gradients } from '@/constants/theme';
import { useDrinks } from '@/context/DrinkContext';

const MENU_TEMPLATES = [
  { id: 'classic', name: 'Classic Menu', description: 'Traditional cocktail menu layout' },
  { id: 'modern', name: 'Modern Minimal', description: 'Clean and contemporary design' },
  { id: 'vintage', name: 'Vintage Style', description: 'Retro cocktail menu aesthetic' },
  { id: 'tropical', name: 'Tropical Vibes', description: 'Beach-themed colorful design' },
];

export default function MenuEditScreen() {
  const router = useRouter();
  const { drinks } = useDrinks();
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [menuTitle, setMenuTitle] = useState('My Emoji Drink Menu');
  const [menuSubtitle, setMenuSubtitle] = useState('Handcrafted with love & emojis');
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleExport = () => {
    // Export functionality will be implemented
    alert('Export feature coming soon!');
  };

  const handleShare = () => {
    // Share functionality will be implemented
    alert('Share feature coming soon!');
  };

  const renderTemplateCard = (template: typeof MENU_TEMPLATES[0]) => {
    const isSelected = selectedTemplate === template.id;
    return (
      <Animated.View
        key={template.id}
        style={[
          styles.templateCard,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          })}] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.templateButton,
            isSelected && styles.selectedTemplate
          ]}
          onPress={() => setSelectedTemplate(template.id)}
          activeOpacity={0.8}
        >
          <View style={styles.templatePreview}>
            <View style={[styles.previewBox, { backgroundColor: getTemplateColor(template.id) }]}>
              <Palette size={24} color={Colors.white} />
            </View>
          </View>
          <View style={styles.templateInfo}>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateDesc}>{template.description}</Text>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getTemplateColor = (templateId: string) => {
    switch (templateId) {
      case 'classic': return Colors.primary;
      case 'modern': return '#64748B';
      case 'vintage': return '#92400E';
      case 'tropical': return '#059669';
      default: return Colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Customize Menu</Text>
            <Text style={styles.subtitle}>Design your perfect menu</Text>
          </View>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Menu Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Menu Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Menu Title</Text>
              <TextInput
                style={styles.input}
                value={menuTitle}
                onChangeText={setMenuTitle}
                placeholder="Enter menu title"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Menu Subtitle</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={menuSubtitle}
                onChangeText={setMenuSubtitle}
                placeholder="Enter menu subtitle"
                multiline
              />
            </View>
          </View>

          {/* Template Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Template</Text>
            {MENU_TEMPLATES.map(renderTemplateCard)}
          </View>

          {/* Preview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewContainer}>
              <LinearGradient
                colors={getTemplateColor(selectedTemplate) === Colors.primary ? Gradients.primary : [getTemplateColor(selectedTemplate), getTemplateColor(selectedTemplate)]}
                style={styles.previewHeader}
              >
                <Text style={styles.previewTitle}>{menuTitle}</Text>
                <Text style={styles.previewSubtitle}>{menuSubtitle}</Text>
              </LinearGradient>
              <View style={styles.previewDrinks}>
                {drinks.slice(0, 3).map((drink, index) => (
                  <View key={drink.id} style={styles.previewDrink}>
                    <Text style={styles.previewDrinkEmojis}>{drink.emojis.join(' ')}</Text>
                    <Text style={styles.previewDrinkName}>{drink.name}</Text>
                    <Text style={styles.previewDrinkDesc}>{drink.description}</Text>
                  </View>
                ))}
                {drinks.length > 3 && (
                  <Text style={styles.moreDrinksText}>+{drinks.length - 3} more drinks...</Text>
                )}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
              <Download size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  templateCard: {
    marginBottom: 12,
  },
  templateButton: {
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
  selectedTemplate: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  templatePreview: {
    marginRight: 16,
  },
  previewBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  templateDesc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  previewHeader: {
    padding: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  previewDrinks: {
    padding: 20,
  },
  previewDrink: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  previewDrinkEmojis: {
    fontSize: 18,
    marginBottom: 8,
  },
  previewDrinkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  previewDrinkDesc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  moreDrinksText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
