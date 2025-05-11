import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Concurso() {
  // UseStates de los diferentes campos
  const [nombre, setNombre] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Firebase
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;

  const navigation = useNavigation();

  //Actualizar datos usuario
  useEffect(() => {
    if (user) {
      const cargarDatosUsuario = async () => {
        try {
          const refDoc = doc(db, "Usuarios", user.uid);
          const docSnap = await getDoc(refDoc);
          if (docSnap.exists()) {
            const datos = docSnap.data();
            setFotoPerfil(datos.fotoperfil);
            setNombre(datos.nombre);
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
        }
      };

      cargarDatosUsuario();
    }
  }, []);

  return (
    <View style={styles.mainContainer}>

      <View style={{ flexDirection: "row", alignItems: "center", marginRight: width * 0.3, marginTop: height * 0.02 }}>
        <Image
          source={{
            uri:
              fotoPerfil ||
              "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
          }}
          style={styles.image}
        />
        <Text style={styles.bienvenida}>Bienvenido {nombre}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AnnadirFoto")}>
        <Text>Añadir foto</Text>
        <Feather name="plus" size={20} color="#000" />
      </TouchableOpacity>
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

  image: {
    width: width * 0.15,
    height: width * 0.15,
    marginBottom: height * 0.02,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: "#9B9B9B",
    marginRight: width * 0.03,
  },

  bienvenida: {
    fontSize: width * 0.05,
    color: "#1E205B",
    marginBottom: height * 0.02,
  },
});
