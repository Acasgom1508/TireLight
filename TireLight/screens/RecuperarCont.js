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
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH} from "../FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const { width, height } = Dimensions.get("window");
export default function RecuperarCont() {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();

  const enviarEmail = async (correo) => {
    if (!correo) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }

    setCargando(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, correo);
      alert("Se ha enviado un correo para restablecer la contraseña.");
      setCargando(false);
      navigation.navigate("InicioSesion");
    } catch (error) {
      console.error(error);
      setCargando(false);
      alert("Error al enviar el correo. Verifica que el correo sea correcto.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView behavior="position">
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitulo}>
          Al ingresar tu correo electrónico recibirás un enlace para restablecer
          tu contraseña.
        </Text>
        <View style={styles.container}>
          <Text style={styles.titulo}>Restablecer Contraseña</Text>

          <TextInput
            style={styles.input}
            value={correo}
            placeholder="Correo electrónico"
            onChangeText={(text) => setCorreo(text)}
          />

          {/* Si esta cargando, aparece un indicador */}
          {cargando ? (
            <ActivityIndicator
              size="large"
              color="#1E205B"
              style={{ marginVertical: width * 0.064 }}
            />
          ) : (
            <TouchableOpacity
              style={styles.boton}
              onPress={() => enviarEmail(correo)}
            >
              <Text style={styles.textoBoton}>Enviar correo</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    paddingTop: height * 0.05,
  },

  logo: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: "contain",
    marginBottom: height * 0.04,
    marginTop: height * 0.04,
    alignSelf: "center",
  },

  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: width * 0.05,
    borderRadius: width * 0.15,
    width: "100%",
  },

  titulo: {
    fontSize: width * 0.115,
    fontWeight: "900",
    color: "#1E205B",
    marginBottom: height * 0.02,
    marginTop: height * 0.03,
  },

  subtitulo: {
    fontSize: width * 0.05,
    color: "#404040",
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.05,
  },

  boton: {
    backgroundColor: "#1E205B",
    borderRadius: width * 0.03,
    marginVertical: height * 0.03,
    width: width * 0.6,
    height: height * 0.07,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: height * 0.05,
  },

  textoBoton: {
    fontSize: width * 0.06,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: -2,
  },

  input: {
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: width * 0.05,
    fontSize: width * 0.05,
    color: "#404040",
    borderWidth: 2,
    borderColor: "#1E205B",
  },
});
