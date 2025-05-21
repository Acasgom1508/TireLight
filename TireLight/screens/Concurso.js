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
  TextInput,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Concurso() {
  // UseStates de los diferentes campos
  const [nombre, setNombre] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [tematica, setTematica] = useState(null);
  const [antiguaTematica, setAntiguaTematica] = useState(null);
  const [agUsuario, setAgUsuario] = useState(null);
  const [agFoto, setAgFoto] = useState(null);
  const [agVotos, setAgVotos] = useState(null);
  const [agFecha, setAgFecha] = useState(null);
  const [agTitulo, setAgTitulo] = useState(null);
  const [imagenesTematica, setImagenesTematica] = useState([]);
  const [bases, setBases] = useState(null);
  const [votos, setVotos] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroVotados, setNumeroVotados] = useState(0);

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

  // Cargamos la temática actual
  useEffect(() => {
    const cargarTematicasYFotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Tematicas"));
        let tematicaActual = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Seleccionado === "Si") {
            setTematica(data.Titulo);
            setBases(data.Bases);
            tematicaActual = data.Titulo;
          } else if (data.Seleccionado === "AG") {
            setAntiguaTematica(data.Titulo);
          }
        });

        // Si se ha encontrado la temática actual, cargar fotos
        if (tematicaActual) {
          const fotosSnapshot = await getDocs(collection(db, "Fotos"));

          const imagenesFiltradas = fotosSnapshot.docs
            .filter((doc) => doc.data().Tematica === tematicaActual)
            .map((doc) => {
              const data = doc.data();
              return {
                usuario: data.Usuario,
                url: data.Url,
                titulo: data.Titulo,
                fecha: data.Fecha,
                votos: data.Votos,
                id: doc.id,
              };
            });

          setImagenesTematica(imagenesFiltradas);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar las temáticas o imágenes.");
      }
    };

    cargarTematicasYFotos();
  }, []);

  // Cargamos la foto ganadora de la temática anterior
  useEffect(() => {
    if (!antiguaTematica) return; // No hacer nada si aún no está definida

    const cargarDatosAG = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Fotos"));

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Tematica === antiguaTematica) {
            setAgUsuario(data.Usuario);
            setAgFoto(data.Url);
            setAgVotos(data.Votos);
            setAgFecha(data.Fecha);
            setAgTitulo(data.Titulo);
          }
        });
      } catch (error) {
        console.error("Error al cargar datos AG:", error);
        Alert.alert("Error", "No se pudieron cargar los datos AG.");
      }
    };

    cargarDatosAG();
  }, [antiguaTematica]);

  // Sumar votos a una foto y actualizar
  const sumarVotos = async (fotoId, votos) => {
    if (numeroVotados >= 10) {
      Alert.alert(
        "Límite de votos alcanzado",
        "Ya has votado 3 veces. No puedes votar más.",
        [{ text: "OK" }]
      );
    } else {
      try {
        const fotoRef = doc(db, "Fotos", fotoId);
        const nuevosVotos = votos + 1;

        // Se actualizar en Firestore
        await updateDoc(fotoRef, {
          Votos: nuevosVotos,
        });

        // Se actualizat el estado local. Prev es el estado anterior de la variable
        setImagenesTematica((prev) =>
          prev.map((foto) =>
            // Si la foto coincide con la que se ha votado, se le actualiza el número de votos
            foto.id === fotoId ? { ...foto, votos: nuevosVotos } : foto
          )
        );
        setNumeroVotados((prev) => prev + 1);
        Alert.alert("Éxito", "Has votado con éxito, te quedan " + (9 - numeroVotados) + " votos.");
      } catch (error) {
        console.error("Error al sumar votos:", error);
        Alert.alert("Error", "No se pudieron sumar los votos.");
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
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

      {/* Boton añadir foto */}
      <TouchableOpacity
        style={styles.botonAnnadir}
        onPress={() => navigation.navigate("AnnadirFoto",{nombreUsuario: nombre, tematica: tematica})}
      >
        <Feather name="plus" size={25} color="#fff" />
      </TouchableOpacity>

      {/* Boton ver bases */}
      <TouchableOpacity
        style={styles.botonBases}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="info" size={35} color="#1E205B" />
      </TouchableOpacity>

      {/* Modal que se ve al darle al boton de información */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.contenedorModal}>
          <View style={styles.contenidoModal}>
            <Text style={styles.tituloModal}>Bases de la temática actual</Text>
            <Text style={styles.textoModal}>
              {bases || "No hay bases disponibles."}
            </Text>
            <TouchableOpacity
              style={styles.botonCerrar}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollViewFotos}>
        {/* Antiguo ganador */}

        {antiguaTematica ? (
          <View>
            <View style={styles.encabezado}>
              <Text style={styles.textoEncabezado}>
                Ganador "{antiguaTematica}"
              </Text>
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
        ) : (
          <View />
        )}

        {/* Temática actual */}
        <View style={styles.encabezado}>
          <Text style={styles.textoEncabezado}>{tematica}</Text>
        </View>
        {imagenesTematica.length > 0 ? (
          imagenesTematica.map((foto, index) => (
            <View style={styles.fotoContainer} key={index}>
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
                style={{
                  position: "absolute",
                  backgroundColor: "#1E205B",
                  borderWidth: 1,
                  borderColor: "#C2C2C2",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 15,
                  borderRadius: 15,
                  top: 10,
                  right: 10,
                }}
                onPress={() => {
                  sumarVotos(foto.id, foto.votos);
                }}
              >
                <Feather name="thumbs-up" size={25} color="white" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            No hay imágenes para esta temática.
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
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ED6D2F",
    marginBottom: 10,
    marginTop: 15,
  },

  textoEncabezado: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },

  imagen: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: "#9B9B9B",
    marginRight: width * 0.03,
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
    zIndex: 999, // para que esté por encima de otros elementos
  },

  botonBases: {
    position: "absolute",
    top: height * 0.028,
    right: width * 0.09,
    justifyContent: "center",
    alignItems: "center",
  },

  contenedorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  contenidoModal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  textoModal: {
    fontSize: 16,
    marginBottom: 20,
  },

  botonCerrar: {
    backgroundColor: "#1E205B",
    borderRadius: 5,
    padding: 10,
  },

  textoBotonCerrar: {
    color: "white",
    fontSize: 16,
  },

  scrollViewFotos: {
    alignSelf: "center",
    marginTop: height * 0.07,
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
  },

  fotoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingBottom: 15,
    marginBottom: 15,
  },

  fotoRallyUsuario: {
    width: "100%",
    height: height * 0.25,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },

  tituloFoto: {
    fontWeight: "bold",
    color: "#ED6D2F",
    fontSize: width * 0.05,
    marginBottom: 5,
  },

  subtituloFoto: {
    fontSize: width * 0.04,
    color: "#1E205B",
  },

  votosFoto: {
    position: "absolute",
    color: "#fff",
    backgroundColor: "#ED6D2F",
    fontWeight: "bold",
    fontSize: width * 0.08,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 15,
    top: 0,
    left: 0,
  },
});
