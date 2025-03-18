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
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("window");

export default function InicioSesion() {
  const navigation = useNavigation();

  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const auth = FIREBASE_AUTH;

  const iniciarSesion = async () => {
    setCargando(true);
    try {
      const response = await signInWithEmailAndPassword(auth, correo, pass);
      console.log(response);
      
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión: " + error.message);
    } finally {
      setCargando(false);
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
          Accede a tu cuenta y únete a la competencia fotográfica más vibrante
          del tuning.
        </Text>
        <View style={styles.container}>
          <Text style={styles.titulo}>Iniciar Sesión</Text>

          <TextInput
            style={styles.input}
            value={correo}
            placeholder="Correo electrónico"
            onChangeText={(text) => setCorreo(text)}
          />

          <View style={{ position: "relative", width: width * 0.8 }}>
            <TextInput
              style={styles.input}
              value={pass}
              placeholder="Contraseña"
              secureTextEntry={!mostrarPass}
              onChangeText={(text) => setPass(text)}
            />
            <TouchableOpacity
              style={styles.iconoOjo}
              onPress={() => setMostrarPass(!mostrarPass)}
            >
              <Feather
                name={mostrarPass ? "eye" : "eye-off"}
                size={width * 0.06}
                color="#1E205B"
              />
            </TouchableOpacity>
          </View>

          {cargando ? (
            <ActivityIndicator
              size="large"
              color="#1E205B"
              style={{ marginVertical: width * 0.064 }}
            />
          ) : (
            <TouchableOpacity style={styles.boton} onPress={iniciarSesion}>
              <Text style={styles.textoBoton}>Iniciar sesión</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.pregunta}>¿No tienes cuenta? Créala ahora</Text>
          <TouchableOpacity
            style={styles.crearcuenta}
            onPress={() => navigation.navigate("Registro")}
          >
            <Text style={styles.textoBotonCrear}>Crear cuenta ahora</Text>
            <Feather
              name="arrow-right-circle"
              size={width * 0.08}
              color="#ED6D2F"
            />
          </TouchableOpacity>
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
    borderTopLeftRadius: width * 0.15,
    borderTopRightRadius: width * 0.15,
    width: "100%",
    flex: 1,
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
    marginTop: height * 0.03,
    width: width * 0.6,
    height: height * 0.07,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  textoBoton: {
    fontSize: width * 0.06,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: -2,
  },

  textoBotonCrear: {
    fontSize: width * 0.06,
    color: "#ED6D2F",
    fontWeight: "bold",
    marginTop: -2,
    marginRight: width * 0.03,
  },

  input: {
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.03,
    fontSize: width * 0.05,
    color: "#404040",
    borderWidth: 2,
    borderColor: "#1E205B",
  },

  pregunta: {
    fontSize: width * 0.045,
    color: "#1F1F25",
    marginTop: height * 0.035,
    marginBottom: height * 0.015,
    textAlign: "center",
    fontWeight: "bold",
  },

  crearcuenta: {
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.03,
    width: width * 0.7,
    height: height * 0.07,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#ED6D2F",
  },

  iconoOjo: {
    position: "absolute",
    right: width * 0.05,
    top: height * 0.05,
    zIndex: 1,
  },
});
