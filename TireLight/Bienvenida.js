import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather"; // Importa Feather

export default function Bienvenida() {
  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("./assets/images/Logo.png")}
        style={styles.imagen}
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
          source={require("./assets/images/Bienvenida/Supra-Bienvenida.png")}
          style={styles.supra}
        />
        <TouchableOpacity style={styles.boton}>
          <Text style={styles.textoBoton}>Empezar</Text>
          <Feather name="arrow-right-circle" size={35} color="#FFFFFF"/>
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
  },

  imagen: {
    width: 330,
    height: 67,
    resizeMode: "contain",
    marginTop: 80,
    marginBottom: 30,
  },

  container: {
    marginHorizontal: 20,
    alignItems: "center",
  },

  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#393939",
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
    width: 244,
    height: 64,
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
  },

  textoBoton: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: 300,
    marginRight: 15,
    marginTop: -6,
  },
});
