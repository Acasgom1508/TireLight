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
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Concurso() {
  // UseStates de los diferentes campos
  const [nombre, setNombre] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [tematica, setTematica] = useState(null);
  const [antiguaTematica, setAntiguaTematica] = useState(null);
  const [antiguoGanador, setAntiguoGanador] = useState(null);
  const [imagenesTematica, setImagenesTematica] = useState([]);
  const [bases, setBases] = useState(null);
  const [votos, setVotos] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
                url: data.Url,
                titulo: data.Titulo,
                fecha: data.Fecha,
                votos: data.Votos,
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

  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: height * 0.1,
          marginTop: height * 0.02,
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
        onPress={() => navigation.navigate("AnnadirFoto")}
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
        <View style={styles.encabezado}>
          <Text style={styles.textoEncabezado}>
            Temática anterior: {antiguaTematica}
          </Text>
        </View>

        {/* Temática actual */}
        <View style={styles.encabezado}>
          <Text style={styles.textoEncabezado}>
            Temática actual: {tematica}
          </Text>
        </View>
        {imagenesTematica.length > 0 ? (
          imagenesTematica.map((foto, index) => (
            <View style={styles.fotoContainer} key={index}>
              <Image
                source={{ uri: foto.url }}
                style={{
                  width: width * 0.75,
                  height: height * 0.2,
                  borderRadius: 10,
                  marginBottom: 10,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: "#9B9B9B",
                }}
              />
              <Text style={{ fontWeight: "bold" }}>Título: {foto.titulo}</Text>
              <Text>Fecha: {foto.fecha}</Text>
              <Text>Votos: {foto.votos}</Text>
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
    width: "100%",
    height: height * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },

  textoEncabezado: {
    fontSize: width * 0.05,
  },

  imagen: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: "#9B9B9B",
    marginRight: width * 0.03,
  },

  bienvenida: {
    fontSize: width * 0.05,
    color: "#1E205B",
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
  },

  botonBases: {
    position: "absolute",
    top: height * 0.037,
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
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
  },

  fotoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
});
