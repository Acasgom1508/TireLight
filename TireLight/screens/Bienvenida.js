import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

// Se modificará más adelante para hacer la app responsiva
const { width, height } = Dimensions.get("window");

export default function Bienvenida() {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.logo}
      />
      <View style={styles.container}>
        <Text style={styles.titulo}>
          El Rally Fotográfico TireLight llega a Sevilla
        </Text>
        <Text style={styles.subtitulo}>
          Cada año, una nueva ciudad se convierte en el escenario del mejor
          tuning. Captura su esencia y únete al rally donde la fotografía y la
          personalización se encuentran.
        </Text>
        <Image
          source={require("../assets/images/Bienvenida/Supra-Bienvenida.png")}
          style={styles.supra}
        />
        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("InicioSesion")}
        >
          <Text style={styles.textoBoton}>Empezar</Text>
          <Feather
            name="arrow-right-circle"
            size={width * 0.08}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    paddingVertical: height * 0.05,
  },

  logo: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: "contain",
    marginBottom: height * 0.04,
    marginTop: height * 0.04,
  },

  container: {
    marginHorizontal: width * 0.05,
    alignItems: "center",
  },

  titulo: {
    fontSize: width * 0.07,
    fontWeight: "900",
    color: "#393939",
    marginBottom: height * 0.02,
  },

  subtitulo: {
    fontSize: width * 0.05,
    color: "#404040",
    marginBottom: height * 0.02,
  },

  supra: {
    width: width * 1.2,
    height: height * 0.3,
    resizeMode: "contain",
    marginRight: height * 0.15,
  },

  boton: {
    backgroundColor: "#1E205B",
    borderRadius: 10,
    width: width * 0.6,
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
  },

  textoBoton: {
    fontSize: width * 0.07,
    color: "#FFFFFF",
    fontWeight: "300",
    marginRight: width * 0.03,
  },
  
});
