import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as Font from 'expo-font';
import TypingEffect from './components/TypingEffect'; // Import the TypingEffect component
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons

const { width, height } = Dimensions.get('window');

const loadFonts = async () => {
  await Font.loadAsync({
    'Arslan': require('./assets/fonts/Arslan.ttf'),
  });
};

const emotions = [
  { name: 'Happy', icon: 'sentiment-very-satisfied' },
  { name: 'Content', icon: 'sentiment-satisfied' },
  { name: 'Anxious', icon: 'sentiment-dissatisfied' },
  { name: 'Stressed', icon: 'sentiment-very-dissatisfied' }, 
  { name: 'Lonely', icon: 'sentiment-neutral' },
  { name: 'Angry', icon: 'sentiment-very-dissatisfied' },
];

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    loadAssets();
  }, []);

  const handleEmotionPress = async (emotion) => {
    try {
      const response = await fetch('http://192.168.0.12:5001/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: emotion }),
      });
      const data = await response.json();
      Alert.alert('API Response', data.response);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground
          source={require('./assets/images/bg4.png')} // Specify the path to your background image file
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <TypingEffect text="ٱلسَّلَامُ عَلَيْكُمْ" style={styles.greeting} />
        </ImageBackground>
      </View>
      <View style={styles.emotionContainer}>
        <Text style={styles.emotionHeader}>How are you feeling?</Text>
        <View style={styles.emotions}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.name}
              style={styles.emotionButton}
              onPress={() => handleEmotionPress(emotion.name)}
            >
              <Icon name={emotion.icon} size={40} color="#000" />
              <Text style={styles.emotionText}>{emotion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '30%',
    backgroundColor: 'green',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '140%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  greeting: {
    flex: 1,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 100,
    fontSize: 50,
    marginTop: 50,
    fontFamily: 'Arslan',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionContainer: { 
    backgroundColor: "white",
    borderRadius: 5,
    height: "30%",
    width: '85%',
    marginTop: -50,
    // iOS Shadow
    shadowColor: 'rgba(16, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    // Android Shadow
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emotionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emotions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  emotionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionText: {
    marginTop: 5,
    fontSize: 16,
  },
});

export default HomeScreen;
