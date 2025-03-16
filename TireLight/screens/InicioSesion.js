import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather"; // Importa Feather
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation

export default function InicioSesion() {
  const navigation = useNavigation(); // Hook para la navegación

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.imagen}
      />
      <Text style={styles.subtitulo}>
        Accede a tu cuenta y únete a la competencia fotográfica más vibrante del
        tuning.
      </Text>
      <View style={styles.container}>
        <View>
          <Text style={styles.titulo}>Inicio de Sesión</Text>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate("InicioSesion")} // Navega a InicioSesion
          >
            <Text style={styles.textoBoton}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

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
  },

  imagen: {
    width: 330,
    height: 67,
    resizeMode: "contain",
    marginTop: 80,
    marginBottom: 30,
  },

  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    flex: 1,
    width: "100%",
  },

  titulo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1E205B",
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 21,
    color: "#404040",
    textAlign: "center",
    marginBottom: 20,
  },

  supra: {
    width: 475,
    height: 247,
    resizeMode: "contain",
    marginTop: 50,
    marginRight: 123,
  },

  boton: {
    backgroundColor: "#1E205B",
    borderRadius: 10,
    marginTop: 50,
    width: 242,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    alignSelf: "center", 
  },

  textoBoton: {
    fontSize: 25,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: -4,
  },
});
