import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";
import TypingEffect from "./components/TypingEffect"; // Import the TypingEffect component
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment/moment";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library
import * as Clipboard from "expo-clipboard";
import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const loadFonts = async () => {
  await Font.loadAsync({
    Patrick: require("./assets/fonts/PatrickHand-Regular.ttf"),
  });
};

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [momentDate, setMomentDate] = useState();
  const [currentHijriDay, setCurrentHijriDay] = useState();
  const [currentHijriMonth, setCurrentHijriMonth] = useState();
  const [currentHijriYear, setCurrentHijriYear] = useState();
  const [verseTextAr, setVerseTextAr] = useState();
  const [verseTextEn, setVerseTextEn] = useState();
  const [verseNumber, setVerseNumber] = useState();
  const [sound, setSound] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const verses = [
    { chapter: 2, verse: 286 },
    { chapter: 9, verse: 51 },
    { chapter: 10, verse: 57 },
    { chapter: 13, verse: 28 },
    { chapter: 14, verse: 7 },
    { chapter: 16, verse: 97 },
    { chapter: 17, verse: 70 },
    { chapter: 39, verse: 53 },
    { chapter: 40, verse: 60 },
    { chapter: 57, verse: 4 },
    { chapter: 59, verse: 23 },
    { chapter: 65, verses: [2, 3] },
  ];

  const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    return verses[randomIndex];
  };

  const getVerseOfDay = async () => {
    const { chapter, verse } = getRandomVerse();
    try {
      const response = await fetch(
        `http://api.alquran.cloud/v1/ayah/${chapter}:${verse}/ar`
      );
      const json = await response.json();
      setVerseTextAr(json.data.text);
      setVerseNumber(json.data.number);

      const responseEn = await fetch(
        `http://api.alquran.cloud/v1/ayah/${chapter}:${verse}/en.asad`
      );
      const jsonEn = await responseEn.json();
      setVerseTextEn(jsonEn.data.text);
    } catch (error) {
      console.log(error);
    }
  };

  const playQuran = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: `https://cdn.islamic.network/quran/audio/128/ar.shaatree/${verseNumber}.mp3` },
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while playing the audio");
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const loadAssets = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    loadAssets();
  }, []);

  const handleEmotionPress = async (emotion) => {
    try {
      const response = await fetch("http://192.168.0.12:5001/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: emotion }),
      });
      const data = await response.json();
      Alert.alert("API Response", data.response);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const getHijriDate = async () => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/gToH?=${momentDate}`
      );
      const json = await response.json();

      setCurrentHijriDay(json.data.hijri.day);
      setCurrentHijriMonth(json.data.hijri.month.en);
      setCurrentHijriYear(json.data.hijri.year);
    } catch (error) {
      console.log(error);
    }
  };

  const momentGetDate = () => {
    setMomentDate(moment().format("ddd MMMM D"));
  };

  const copyToClipboard = () => {
    Clipboard.setString(verseTextAr);
    Alert.alert("Copied", "Verse text has been copied to clipboard");
  };

  const openVerseCard = () => {
    setSelectedId(verseNumber);
  };

  useEffect(() => {
    getHijriDate();
    momentGetDate();
  }, []);

  useEffect(() => {
    getVerseOfDay();
  }, []);

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
      {/* Heading Container */}
      <View style={styles.header}>
        <LinearGradient
          colors={["rgb(211, 8, 237) ", "rgb(146, 20, 254)"]} // Sky Blue gradient
          style={styles.header}
        >
          <ImageBackground
            source={require("./assets/images/bg4.png")} // Specify the path to your background image file
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.headerContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.currentDate}>{momentDate}</Text>
                <Text style={styles.currentDate}>
                  {currentHijriMonth} {currentHijriDay}, {currentHijriYear} AH
                </Text>
              </View>

              <View style={styles.greetingContainer}>
                <TypingEffect
                  text="Good Morning, Name"
                  style={styles.greeting}
                />
              </View>
            </View>
          </ImageBackground>
        </LinearGradient>
      </View>

      <View style={styles.dailyVerse}>
        <Text style={styles.verseHeading}>Verse of The Day</Text>
        <Text style={styles.verseText}>{verseTextAr}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openVerseCard} style={styles.iconButton}>
            <Icon name="info" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openVerseCard} style={styles.iconButton}>
            <Icon name="heart" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={copyToClipboard} style={styles.iconButton}>
            <Icon name="copy" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={playQuran} style={styles.iconButton}>
            <Icon name="play" size={15} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedId && (
        <>
          <Animated.View
            layout={Layout}
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.overlay}
          />
          <Animated.View
            layout={Layout}
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContent}
          >
            <ScrollView>
              <Text style={styles.modalTitle}>Verse Details</Text>
              <Text style={styles.verseTextCard}>{verseTextAr}</Text>
              <Text style={styles.verseTextCard}>{verseTextEn}</Text>
              <TouchableOpacity
                onPress={() => setSelectedId(null)}
                style={styles.closeButton}
              >
                <Icon name="close" size={15} color="white" />
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  headerContainer: {
    flexDirection: "row-reverse",
    paddingTop: 50,
    padding: 10,
  },
  header: {
    width: "100%",
    height: 150,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "120%",
    flex: 1,
  },
  imageStyle: {
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  greeting: {
    color: "white",
    fontSize: 25,
    fontFamily: "Patrick",
  },
  greetingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    color: "white",
    fontFamily: "Patrick",
    alignItems: "flex-end",
  },
  todayHeader: {
    color: "white",
    fontFamily: "Patrick",
    fontSize: 20,
  },
  currentDate: {
    fontFamily: "Patrick",
    color: "white",
    fontSize: 20,
  },
  dailyVerse: {
    backgroundColor: "white",
    alignSelf: "center",
    width: "90%",
    height: "min-content",
    marginTop: -25,
    borderRadius: 10,
    // iOS Shadow
    shadowColor: "rgba(16, 24, 40, 0.05)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    // Android Shadow
    elevation: 3,
    padding: 20,
    paddingBottom: 60,
  },
  verseHeading: {
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Patrick",
    marginBottom: 10,
    marginTop: -10,
  },
  verseText: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    position: 'absolute',
    right: 10,
    bottom: 20

  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 50,
    
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  verseTextCard: {
    color: "black",
    fontSize: 18,
    fontFamily: "Lato",
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: { 
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    position: 'absolute',
    top: 0,
    right: 0
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default HomeScreen;
