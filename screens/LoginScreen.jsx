import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginForm from '../components/LoginForm';
import { LinearGradient } from 'expo-linear-gradient'; // Install expo-linear-gradient

export default function LoginScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/random/1080x1920/?abstract' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(245, 247, 250, 0.8)', 'rgba(245, 247, 250, 0.9)']}
        style={styles.container}
      >
        <LoginForm navigation={navigation} />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});