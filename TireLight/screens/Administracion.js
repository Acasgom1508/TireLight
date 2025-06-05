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
  updateDoc,
  collection,
  getDocs,
  increment,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import Feather from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

export default function Administracion() {
  const navigation = useNavigation();

  const [imagenesUsuario, setImagenesUsuario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Firebase
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;
  const isFocused = useIsFocused();

  // Cargamos las imágenes
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const fotosSnap = await getDocs(collection(db, "Fotos"));
        const imgs = fotosSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((d) => d.Estado === "Pendiente")
          .map((d) => ({
            id: d.id,
            tematica: d.Tematica,
            url: d.Url,
            titulo: d.Titulo,
            fecha: d.Fecha,
            usuario: d.Usuario,
            estado: d.Estado,
          }));
        setImagenesUsuario(imgs);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar las temáticas o imágenes.");
      }
    })();
  }, [isFocused, user, imagenesUsuario]);

  // Cargamos los usuarios
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const usuariosSnap = await getDocs(collection(db, "Usuarios"));
        // Primero quitamos todos los documentos cuyo id sea igual a user.uid
        const lista = usuariosSnap.docs
          .filter((doc) => doc.id !== user.uid)
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nombre: data.nombre,
              correo: data.correo,
              rol: data.rol,
            };
          });
        setUsuarios(lista);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar los usuarios.");
      }
    })();
  }, [isFocused, user, usuarios]);

  // Aceptar foto
  const aceptarFoto = async (id) => {
    try {
      const fotoRef = doc(db, "Fotos", id);
      await updateDoc(fotoRef, { Estado: "Aceptada" });

      // Actualizar el número de fotos de la temática
      const tematicasRef = collection(FIREBASE_DB, "Tematicas");
      const querySnapshot = await getDocs(tematicasRef);

      querySnapshot.forEach(async (docSnapshot) => {
        if (docSnapshot.data().Seleccionado === "Si") {
          const tematicaDocRef = doc(FIREBASE_DB, "Tematicas", docSnapshot.id);
          await updateDoc(tematicaDocRef, { Fotos: increment(1) });
        }
      });

      Alert.alert("Éxito", "Foto aceptada correctamente.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo aceptar la foto.");
    }
  };
  const rechazarFoto = async (id) => {
    try {
      const fotoRef = doc(db, "Fotos", id);
      await updateDoc(fotoRef, { Estado: "Rechazada" });
      Alert.alert("Éxito", "Foto rechazada correctamente.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo aceptar la foto.");
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
        <Text style={styles.textoHeader}>Admin</Text>
      </View>

      <ScrollView style={styles.scrollViewFotos}>
        <View style={styles.usuarios}>
          <Text style={styles.textoinformativo}>Administrar Usuarios</Text>
          {usuarios.length > 0 ? (
            usuarios.map((usuario, i) => (
              <View
                key={i}
                style={{
                  paddingVertical: 20,
                  paddingLeft: 10,
                  alignItems: "left",
                }}
              >
                <Text style={styles.nombreUsuario}>
                  {usuario.nombre} -{" "}
                  {usuario.rol == "admin" ? "Administrador" : "Usuario normal"}
                </Text>
                <Text style={styles.correoUsuario}>{usuario.correo}</Text>
                <TouchableOpacity
                  style={styles.botonUsuarioNormal}
                  onPress={async () => {
                    const usuarioRef = doc(db, "Usuarios", usuario.id);
                    await updateDoc(usuarioRef, { rol: "usuario" });
                    Alert.alert(
                      "Éxito",
                      "Ahora el usuario es un usuario normal."
                    );
                    setUsuarios((prev) =>
                      prev.map((u) =>
                        u.id === usuario.id ? { ...u, rol: "usuario" } : u
                      )
                    );
                  }}
                >
                  <Feather
                    name="refresh-cw"
                    size={30}
                    color="#38A169"
                    style={{ margin: 10 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonHacerAdmin}
                  onPress={async () => {
                    const usuarioRef = doc(db, "Usuarios", usuario.id);
                    await updateDoc(usuarioRef, { rol: "admin" });
                    Alert.alert(
                      "Éxito",
                      "Se ha asignado el rol de administrador al usuario correctamente."
                    );
                    setUsuarios((prev) =>
                      prev.map((u) =>
                        u.id === usuario.id ? { ...u, rol: "admin" } : u
                      )
                    );
                  }}
                >
                  <Feather
                    name="star"
                    size={30}
                    color="#FFC400"
                    style={{ margin: 10 }}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.textoinformativo}>
              No hay usuarios registrados.
            </Text>
          )}
        </View>

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
                  <Text style={{ fontWeight: "bold" }}>Usuario: </Text>
                  {foto.usuario}
                </Text>
                <Text style={styles.subtituloFoto}>
                  <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                  {foto.fecha}
                </Text>
                <TouchableOpacity
                  style={styles.botonRechazar}
                  onPress={() => rechazarFoto(foto.id)}
                >
                  <Feather
                    name="x-circle"
                    size={30}
                    color="white"
                    style={{ margin: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botonAceptar}
                  onPress={() => aceptarFoto(foto.id)}
                >
                  <Feather
                    name="check-circle"
                    size={30}
                    color="white"
                    style={{ margin: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.tematicaFoto}>{foto.tematica}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.textoinformativo}>
            No hay imágenes pendientes. {"\n"} Cuando un usuario suba una foto,
            aparecerá aquí.
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
    left: width * 0.07,
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

  botonRechazar: {
    backgroundColor: "red",
    borderRadius: 15,
    height: height * 0.06,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: 25,
    right: 100,
  },

  botonAceptar: {
    backgroundColor: "green",
    borderRadius: 15,
    height: height * 0.06,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: 25,
    right: 20,
  },

  textoinformativo: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "#404040",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },

  usuarios: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
  },

  nombreUsuario: {
    fontSize: width * 0.04,
    color: "#1E205B",
    fontWeight: "bold",
    marginVertical: 5,
  },

  correoUsuario: {
    fontSize: width * 0.035,
    color: "#404040",
    marginBottom: 5,
  },

  botonUsuarioNormal: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    padding: 5,
  },

  botonHacerAdmin: {
    position: "absolute",
    right: 80,
    top: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    padding: 5,
  },
});
