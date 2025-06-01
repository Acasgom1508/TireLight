import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  increment,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Concurso() {
  const [nombre, setNombre] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [votosUsuario, setVotosUsuario] = useState(0);

  const [tematica, setTematica] = useState(null);
  const [duracionTematica, setDuracionTematica] = useState(null);
  const [imagenesTematica, setImagenesTematica] = useState([]);
  const [bases, setBases] = useState(null);

  const [antiguaTematica, setAntiguaTematica] = useState(null);
  const [agUsuario, setAgUsuario] = useState(null);
  const [agFoto, setAgFoto] = useState(null);
  const [agVotos, setAgVotos] = useState(0);
  const [agFecha, setAgFecha] = useState(null);
  const [agTitulo, setAgTitulo] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Cargamos datos usuario
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const refDoc = doc(db, "Usuarios", user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const datos = snap.data();
          setFotoPerfil(datos.fotoperfil);
          setNombre(datos.nombre);
          setVotosUsuario(datos.Votos || 0);
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
      }
    })();
  }, [isFocused, user]);

  // Cargamos temática e imágenes
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const snaps = await getDocs(collection(db, "Tematicas"));
        let actual = null;
        snaps.forEach((doc) => {
          const d = doc.data();
          if (d.Seleccionado === "Si") {
            setTematica(d.Titulo);
            setBases(d.Bases);
            setDuracionTematica(d.Duracion);
            actual = d.Titulo;
          } else if (d.Seleccionado === "AG") {
            setAntiguaTematica(d.Titulo);
          }
        });
        if (actual) {
          const fotosSnap = await getDocs(collection(db, "Fotos"));
          const imgs = fotosSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((d) => d.Tematica === actual && d.Estado === "Aceptada")
            .map((d) => ({
              id: d.id,
              usuario: d.Usuario,
              url: d.Url,
              titulo: d.Titulo,
              fecha: d.Fecha,
              votos: d.Votos || 0,
            }));
          setImagenesTematica(imgs);
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar las temáticas o imágenes.");
      }
    })();
  }, [isFocused, user]);

  // Cargamos ganador anterior
  useEffect(() => {
    if (!antiguaTematica) return;
    (async () => {
      try {
        const snaps = await getDocs(collection(db, "Fotos"));
        snaps.forEach((doc) => {
          const d = doc.data();
          if (d.Tematica === antiguaTematica && d.Estado === "Ganadora") {
            setAgUsuario(d.Usuario);
            setAgFoto(d.Url);
            setAgVotos(d.Votos || 0);
            setAgFecha(d.Fecha);
            setAgTitulo(d.Titulo);
          }
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudieron cargar los datos del ganador.");
      }
    })();
  }, [isFocused, user]);

  // Función de voto
  const sumarVotos = async (fotoId, votosActuales) => {
    if (votosUsuario === 0) {
      return Alert.alert("Límite alcanzado", `Ya has usado tus 20 votos.`);
    }
    try {
      const fotoRef = doc(db, "Fotos", fotoId);
      const userRef = doc(db, "Usuarios", user.uid);

      await updateDoc(fotoRef, { Votos: increment(1) });
      await updateDoc(userRef, { Votos: increment(-1) });

      // Actualizamos estado local
      setImagenesTematica((prev) =>
        prev.map((f) =>
          f.id === fotoId ? { ...f, votos: votosActuales + 1 } : f
        )
      );
      setVotosUsuario((prev) => prev - 1);

      // Mostramos alerta con el número actualizado
      const restantes = votosUsuario - 1;
      Alert.alert(
        "Has votado",
        `Te quedan ${restantes} voto${restantes === 1 ? "" : "s"}.`
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron registrar los votos.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Cabecera usuario */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: height * 0.1,
          paddingLeft: width * 0.05,
          paddingBottom: height * 0.04,
        }}
      >
        <Image
          source={{
            uri:
              fotoPerfil ||
              "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
          }}
          style={styles.imagen}
        />
        <Text style={styles.bienvenida}>Bienvenido {nombre}</Text>
      </View>

      {/* Botón añadir */}
      <TouchableOpacity
        style={styles.botonAnnadir}
        onPress={() =>
          navigation.navigate("AnnadirFoto", {
            nombreUsuario: nombre,
            tematica,
          })
        }
      >
        <Feather name="plus" size={25} color="#fff" />
      </TouchableOpacity>

      {/* Botón info */}
      <TouchableOpacity
        style={styles.botonBases}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="info" size={35} color="#1E205B" />
      </TouchableOpacity>

      {/* Modal bases */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.contenedorModal}>
          <View style={styles.contenidoModal}>
            <Text style={styles.tituloModal}>Bases de la temática actual</Text>
            <Text style={styles.textoModal}>{bases || "No hay bases."}</Text>
            <Text style={styles.textoInformativo}>
              Recuerda que durante cada rally tendrás 20 votos disponibles.
              Puedes gestionarlos como desees, pero no serán recargados hasta
              que comience el siguiente rally
            </Text>
            <TouchableOpacity
              style={styles.botonCerrar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollViewFotos}>
        {/* Ganador anterior */}
        {antiguaTematica && (
          <View>
            <View style={styles.encabezado}>
              <Text style={styles.subtituloAG}>Ganador anterior</Text>
              <Text style={styles.textoEncabezado}>{antiguaTematica}</Text>
            </View>
            <View style={styles.fotoContainer}>
              <Image source={{ uri: agFoto }} style={styles.fotoRallyUsuario} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.tituloFoto}>{agTitulo}</Text>
                <Text style={styles.subtituloFoto}>
                  <Text style={{ fontWeight: "bold" }}>Usuario: </Text>
                  {agUsuario}
                </Text>
                <Text style={styles.subtituloFoto}>
                  <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                  {agFecha}
                </Text>
              </View>
              <Text style={styles.votosFoto}>{agVotos}</Text>
            </View>
          </View>
        )}

        {/* Temática actual */}
        <View style={styles.encabezado}>
          <Text style={styles.textoEncabezado}>{tematica}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              alignItems: "center",
              marginBottom: 15,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "#ED6D2F",
              padding: 10,
              width: "50%",
            }}
          >
            <Text>
              ⏳ {duracionTematica} día{duracionTematica === 1 ? "" : "s"}{" "}
              restantes
            </Text>
          </View>
        </View>

        {/* Lista de fotos */}
        {imagenesTematica.length > 0 ? (
          imagenesTematica.map((foto, i) => (
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
              </View>
              <Text style={styles.votosFoto}>{foto.votos}</Text>
              <TouchableOpacity
                style={styles.botonVotar}
                onPress={() => sumarVotos(foto.id, foto.votos)}
              >
                <Feather name="thumbs-up" size={25} color="white" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            No hay imágenes.
          </Text>
        )}
      </ScrollView>

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

  encabezado: {
    padding: 7,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ED6D2F",
    marginTop: 15,
    marginBottom: 15,
  },

  textoEncabezado: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
  },

  subtituloAG: {
    fontSize: width * 0.04,
    color: "#fff",
    marginLeft: 10,
  },

  imagen: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: "#9B9B9B",
    position: "absolute",
    top: height * 0.01,
    left: width * -0.3,
  },

  bienvenida: {
    fontSize: width * 0.05,
    color: "#1E205B",
    position: "absolute",
    top: height * 0.03,
    left: width * -0.13,
  },

  botonAnnadir: {
    position: "absolute",
    bottom: height * 0.05,
    right: width * 0.1,
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: "#1E205B",
    borderRadius: width * 0.25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },

  botonBases: {
    position: "absolute",
    top: height * 0.028,
    right: width * 0.09,
  },

  contenedorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  contenidoModal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },

  tituloModal: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  textoModal: { fontSize: 16, marginBottom: 20 },

  textoInformativo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  botonCerrar: { backgroundColor: "#1E205B", borderRadius: 5, padding: 10 },

  textoBotonCerrar: { color: "white", fontSize: 16 },

  scrollViewFotos: {
    width: "100%",
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.05,
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

  botonVotar: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#1E205B",
    borderWidth: 1,
    borderColor: "#C2C2C2",
    padding: 15,
    borderRadius: 15,
  },
});
