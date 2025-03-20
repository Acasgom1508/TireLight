import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

export default function Fotos() {
  return (
    <View style={styles.mainContainer}>
      <Text>Fotos</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#f2f2f2",
      alignItems: "center",
      justifyContent: "center",
    },
  });