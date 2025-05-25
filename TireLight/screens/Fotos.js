import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import Feather from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

export default function Fotos() {
  const navigation = useNavigation();

  const [imagenesUsuario, setImagenesUsuario] = useState([]);
  const [nombre, setNombre] = useState("Nombre de Usuario");

  // Firebase
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;
  const isFocused = useIsFocused();

  // Cargamos las imágenes
  useEffect(() => {
    (async () => {
      try {
        const refDoc = doc(db, "Usuarios", user.uid);
        const docSnap = await getDoc(refDoc);
        if (docSnap.exists()) {
          const datos = docSnap.data();
          setNombre(datos.nombre);
        }

        const fotosSnap = await getDocs(collection(db, "Fotos"));
        const imgs = fotosSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((d) => d.Usuario === nombre)
          .map((d) => ({
            id: d.id,
            tematica: d.Tematica,
            url: d.Url,
            titulo: d.Titulo,
            fecha: d.Fecha,
            votos: d.Votos || 0,
            estado: d.Estado,
          }));
        setImagenesUsuario(imgs);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar las temáticas o imágenes.");
      }
    })();
  }, [isFocused, user, imagenesUsuario]);

  const borrarFoto = (id) => async () => {
    try {
      const refDoc = doc(db, "Fotos", id);
      await deleteDoc(refDoc);
      Alert.alert("Foto eliminada", "Foto eliminada correctamente.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la foto.");
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Aceptada":
        return "green";
      case "Cancelada":
        return "#d31818";
      case "Pendiente":
        return "#FFA500";
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.textoHeader}>Mis fotos</Text>
      </View>
      <ScrollView style={styles.scrollViewFotos}>
        {imagenesUsuario.length > 0 ? (
          imagenesUsuario.map((foto, i) => (
            <View style={styles.fotoContainer} key={i}>
              <Image
                source={{ uri: foto.url }}
                style={styles.fotoRallyUsuario}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.tituloFoto}>{foto.titulo}</Text>
                <Text style={styles.subtituloFoto}>
                  <Text style={{ fontWeight: "bold" }}>Estado: </Text>
                  <Text
                    style={{
                      color: getEstadoColor(foto.estado),
                      fontWeight: "bold",
                    }}
                  >
                    {foto.estado}
                  </Text>
                </Text>
                <Text style={styles.subtituloFoto}>
                  <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                  {foto.fecha}
                </Text>
                <TouchableOpacity style={styles.botonBorrar} onPress={borrarFoto(foto.id)}>
                  <Feather name="trash" size={30} color="white" style={{margin: 10}}/>
                </TouchableOpacity>
              </View>
              <Text style={styles.tematicaFoto}>{foto.tematica}</Text>
              <Text style={styles.votosFoto}>{foto.votos}</Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            No hay imágenes.
          </Text>
        )}
      </ScrollView>
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

  scrollViewFotos: {
    width: "100%",
    paddingHorizontal: width * 0.03,
    marginBottom: 5,
  },

  fotoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingBottom: 15,
  },

  fotoRallyUsuario: {
    width: "100%",
    height: height * 0.25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  tituloFoto: {
    fontWeight: "bold",
    color: "#ED6D2F",
    fontSize: width * 0.05,
    marginBottom: 5,
  },

  subtituloFoto: { fontSize: width * 0.04, color: "#1E205B" },

  tematicaFoto: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "#1E205B",
    position: "absolute",
    top: 0,
    right: -1,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  votosFoto: {
    position: "absolute",
    backgroundColor: "#ED6D2F",
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.08,
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  botonBorrar: {
    backgroundColor: "red",
    borderRadius: 15,
    height: height * 0.06,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: 30,
    right: 20,
  }
});
