import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { BookPreviewProps } from "./types";

export const BookPreview: React.FC<BookPreviewProps> = ({
  title,
  genre,
  character,
  setting,
  theme,
  tone,
  onClose,
  visible,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.previewCard}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          testID="close-preview-button"
        >
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        
        <ScrollView>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gênero</Text>
            <Text style={styles.content}>{genre}</Text>
          </View>
          
          {character && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personagem Principal</Text>
              <Text style={styles.content}>{character}</Text>
            </View>
          )}
          
          {setting && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ambiente</Text>
              <Text style={styles.content}>{setting}</Text>
            </View>
          )}
          
          {theme && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tema</Text>
              <Text style={styles.content}>{theme}</Text>
            </View>
          )}
          
          {tone && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tom da História</Text>
              <Text style={styles.content}>{tone}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
};
