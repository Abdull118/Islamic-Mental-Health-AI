import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const TypingEffect = ({ text, style }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex += 1;
      if (currentIndex === text.length) {
        clearInterval(interval);
      }
    }, 100); // Adjust the speed of typing here
    return () => clearInterval(interval);
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
};

export default TypingEffect;
