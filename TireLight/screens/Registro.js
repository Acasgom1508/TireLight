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
import { useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function Registro() {
  const navigation = useNavigation();

  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [NombreyApellidos, setNombreyApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [cargando, setCargando] = useState(false);
  const [mostrarPass1, setMostrarPass1] = useState(false);
  const [mostrarPass2, setMostrarPass2] = useState(false);
  const auth = FIREBASE_AUTH;

  const crearCuenta = async () => {
    setCargando(true);

    if (
      correo.trim() === "" ||
      pass.trim() === "" ||
      confirmPass.trim() === "" ||
      NombreyApellidos.trim() === "" ||
      telefono.trim() === "" ||
      direccion.trim() === ""
    ) {
      alert("Complete todos los campos");
      setCargando(false);
      return;
    }

    if (pass !== confirmPass) {
      alert("Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    if (pass.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      setCargando(false);
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const response = await createUserWithEmailAndPassword(auth, correo, pass);
      const user = response.user; // Obtener usuario creado

      // Guardar en Firestore con el UID como nombre del documento
      await setDoc(doc(FIREBASE_DB, "Usuarios", user.uid), {
        nombre: NombreyApellidos,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        rol: "usuario",
        fotoperfil: "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
        fotos: 0,
        Votos: 20,
      });

      console.log("Usuario registrado con UID:", user.uid);
      alert("El usuario se creó correctamente. Inicia sesión para continuar.");

      // Reiniciar campos
      setNombreyApellidos("");
      setCorreo("");
      setPass("");
      setConfirmPass("");
      setTelefono("");
      setDireccion("");

      // Volver a la pantalla anterior
      navigation.goBack();
    } catch (error) {
      console.log(error);
      let errorMessage = "Ocurrió un error";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya está en uso";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Intente más tarde";
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
          Regístrate y sé parte del rally fotográfico donde el tuning y la
          creatividad se encuentran.
        </Text>
        <View style={styles.container}>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <ScrollView>
            <TextInput
              style={styles.input}
              value={NombreyApellidos}
              placeholder="Nombre y Apellidos"
              onChangeText={setNombreyApellidos}
            />
            <TextInput
              style={styles.input}
              value={correo}
              placeholder="Correo electrónico"
              onChangeText={setCorreo}
            />
            <TextInput
              style={styles.input}
              value={telefono}
              placeholder="Teléfono"
              onChangeText={setTelefono}
            />
            <TextInput
              style={styles.input}
              value={direccion}
              placeholder="Dirección"
              onChangeText={setDireccion}
            />
            <View style={{ position: "relative", width: width * 0.8 }}>
              <TextInput
                style={styles.input}
                value={pass}
                placeholder="Contraseña"
                secureTextEntry={!mostrarPass1}
                onChangeText={setPass}
              />
              <TouchableOpacity
                style={styles.iconoOjo}
                onPress={() => setMostrarPass1(!mostrarPass1)}
              >
                <Feather
                  name={mostrarPass1 ? "eye" : "eye-off"}
                  size={width * 0.06}
                  color="#1E205B"
                />
              </TouchableOpacity>
            </View>
            <View style={{ position: "relative", width: width * 0.8 }}>
              <TextInput
                style={styles.input}
                value={confirmPass}
                placeholder="Repetir contraseña"
                secureTextEntry={!mostrarPass2}
                onChangeText={setConfirmPass}
              />
              <TouchableOpacity
                style={styles.iconoOjo}
                onPress={() => setMostrarPass2(!mostrarPass2)}
              >
                <Feather
                  name={mostrarPass2 ? "eye" : "eye-off"}
                  size={width * 0.06}
                  color="#1E205B"
                />
              </TouchableOpacity>
            </View>
            {cargando ? (
              <ActivityIndicator
                size="large"
                color="#ED6D2F"
                style={{ marginVertical: width * 0.064 }}
              />
            ) : (
              <TouchableOpacity style={styles.boton} onPress={crearCuenta}>
                <Text style={styles.textoBoton}>Crear cuenta</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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
    marginTop: height * 0.01,
  },
  subtitulo: {
    fontSize: width * 0.05,
    color: "#404040",
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.05,
  },
  boton: {
    backgroundColor: "#ED6D2F",
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
  iconoOjo: {
    position: "absolute",
    right: width * 0.05,
    top: height * 0.05,
    zIndex: 1,
  },
});
