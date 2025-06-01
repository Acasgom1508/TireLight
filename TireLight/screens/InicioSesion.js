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
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

    if (correo.trim() === "" || pass.trim() === "") {
      alert("Debes llenar todos los campos");
      setCargando(false);
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, correo, pass);
      const user = response.user;
      // Consulta a la base de datos para obtener el rol del usuario
      const docRef = doc(FIREBASE_DB, "Usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      let rol;
      if (docSnap.exists()) {
        rol = docSnap.data().rol;
        console.log("Rol del usuario: " + rol);
      } else {
        console.log("No existe el documento con el ID: ", user.uid);
        rol = "usuario";
      }
      navigation.navigate("Pantallas", { rol });
      console.log(response);
    } catch (error) {
      console.log(error);
      let errorMessage = "Ocurrió un error";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya está en uso";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Intente más tarde";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciales inválidas";
      }
      alert(errorMessage);
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

          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={width * 0.06}
              color="#1E205B"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={correo}
              placeholder="Correo electrónico"
              placeholderTextColor="#404040"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setCorreo(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={width * 0.06}
              color="#1E205B"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.inputWithIcon,
                { paddingRight: width * 0.15 }
              ]}
              value={pass}
              placeholder="Contraseña"
              placeholderTextColor="#404040"
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

          <TouchableOpacity
            style={{ marginTop: height * 0.015 }}
            onPress={() => navigation.navigate("RecuperarCont")}
          >
            <Text style={styles.preguntaCont}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Indicador de carga o botón de iniciar sesión */}
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
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    marginTop: height * 0.06,
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

  // Nuevo contenedor de input + ícono
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1E205B",
    marginTop: height * 0.03,
  },

  // Estilo para el ícono dentro del input
  inputIcon: {
    marginLeft: width * 0.04,
    marginRight: width * 0.02,
  },

  // Estilo para el TextInput cuando tiene ícono
  inputWithIcon: {
    flex: 1,
    fontSize: width * 0.05,
    color: "#404040",
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

  pregunta: {
    fontSize: width * 0.045,
    color: "#1F1F25",
    marginBottom: height * 0.015,
    textAlign: "center",
    fontWeight: "bold",
  },

  preguntaCont: {
    fontSize: width * 0.045,
    color: "#ED6D2F",
    textAlign: "center",
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
    right: width * 0.04,
    top: (height * 0.07 - width * 0.06) / 2,
    zIndex: 1,
  },
});
