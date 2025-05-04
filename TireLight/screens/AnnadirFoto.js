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
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

export default function AnnadirFoto() {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.textoHeader}>Añadir foto</Text>
      </View>
      <Text>Añadir foto</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        marginTop: height * 0.06,
      },
    
      botonAtras: {
        position: "absolute",
        left: width * 0.1,
      },
    
      header: {
        flexDirection: "row",
        width: "100%",
        height: height * 0.07,
        justifyContent: "center",
        alignItems: "center",
      },
    
      textoHeader: {
        fontSize: width * 0.05,
      },
});
