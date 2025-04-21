import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

export default function Perfil() {
  // UseStates de los diferentes campos
  const [nombre, setNombre] = useState("Nombre de Usuario");
  const [telefono, setTelefono] = useState("640 548 215");
  const [direccion, setDireccion] = useState("Calle del Tuning, 47");
  const [correo, setCorreo] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [fotos, setFotos] = useState(0);

  // UseStates para editar los campos
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoTelefono, setEditandoTelefono] = useState(false);
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  // UseStates para los campos temporales
  const [tempNombre, setTempNombre] = useState(nombre);
  const [tempTelefono, setTempTelefono] = useState(telefono);
  const [tempDireccion, setTempDireccion] = useState(direccion);
  const [modalVisible, setModalVisible] = useState(false);

  // Firebase
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;

  // Cloudinary - datos API
  const cloud_name = "dai0shknj";
  const preset_name = "prueba";
  const [loading, setLoading] = useState(false);

  // Navigation
  const navigation = useNavigation(); 

  // UseEffect para cargar los datos del usuario al iniciar la pantalla
  useEffect(() => {
    if (user) {
      const cargarDatosUsuario = async () => {
        try {
          const refDoc = doc(db, "Usuarios", user.uid);
          const docSnap = await getDoc(refDoc);
          if (docSnap.exists()) {
            const datos = docSnap.data();
            setCorreo(datos.correo);
            setFotoPerfil(datos.fotoperfil);
            setNombre(datos.nombre);
            setTelefono(datos.telefono);
            setDireccion(datos.direccion);
            setFotos(datos.fotos);
            setTempNombre(datos.nombre);
            setTempTelefono(datos.telefono);
            setTempDireccion(datos.direccion);
          }
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
        }
      };

      cargarDatosUsuario();
    }
  }, []);

  // Función para actualizar los campos del usuario
  const actualizarCampo = async (campo, valor) => {
    if (user) {
      try {
        const refDoc = doc(db, "Usuarios", user.uid);
        await updateDoc(refDoc, { [campo]: valor });
      } catch (error) {
        Alert.alert("Error", `No se pudo actualizar el campo ${campo}`);
      }
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("InicioSesion");
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
      });
  };

  // Función para eliminar la cuenta del usuario
  const eliminarCuenta = () => {
    const user = auth.currentUser;
    if (user) {
      user
        .delete()
        .then(() => {
          Alert.alert(
            "Cuenta eliminada",
            "Tu cuenta ha sido eliminada correctamente."
          );
          navigation.navigate("InicioSesion");
        })
        .catch((error) => {
          Alert.alert(
            "Error",
            "No se pudo eliminar la cuenta. Inténtalo de nuevo."
          );
        });
    }
  };

  // Función para abrir la galería y seleccionar una imagen
  const pickImage = async () => {
    // Solicita permisos si no están dados
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert("Permisos denegados", "Necesitas dar acceso a la galería");
      return;
    }

    // Abre la galería
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      uploadImage(selectedImage);
    }
  };

  // Función para subir la imagen a Cloudinary
  const uploadImage = async (image) => {
    // Código adaptado a react native de https://github.com/regenerik/guia-cloudinary-reactjs/blob/master/Cloudinary.jsx
    const data = new FormData();

    data.append("file", {
      uri: image.uri,
      name: "upload.jpg",
      type: "image/jpeg",
    });
    data.append("upload_preset", preset_name);

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const file = await response.json();
      const urlSubida = file.secure_url;

      // Actualizamos la imagen en Firebase directamente con la URL recibida
      if (user) {
        try {
          const refDoc = doc(db, "Usuarios", user.uid);
          await updateDoc(refDoc, { fotoperfil: urlSubida });
        } catch (error) {
          Alert.alert("Error", "No se pudo actualizar la foto de perfil");
        }
      }

      setFotoPerfil(urlSubida);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior="height">
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonAtras}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.textoHeader}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image
          source={{
            uri:
              fotoPerfil ||
              "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
          }}
          style={styles.image}
        />

        <Button
          style={styles.botonCambiarFoto}
          title="Cambiar foto"
          onPress={pickImage}
        />

        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.totalFotos}>Total fotos subidas:</Text>
        <Text style={styles.numeroFotos}>{fotos}</Text>

        <View style={styles.opciones}>
          <Text style={styles.titulo}>Correo electrónico:</Text>
          <Text style={styles.valor} numberOfLines={1} ellipsizeMode="tail">
            {correo}
          </Text>
        </View>

        <View style={styles.opciones}>
          <Text style={styles.titulo}>Nombre:</Text>
          {editandoNombre ? (
            <TextInput
              style={styles.input}
              value={tempNombre}
              onChangeText={setTempNombre}
              autoFocus
            />
          ) : (
            <Text style={styles.valor} numberOfLines={1} ellipsizeMode="tail">
              {nombre}
            </Text>
          )}
          {editandoNombre ? (
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={() => {
                setNombre(tempNombre);
                actualizarCampo("nombre", tempNombre);
                setEditandoNombre(false);
              }}
            >
              <Feather name="check" size={20} color="green" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditandoNombre(true)}>
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.opciones}>
          <Text style={styles.titulo}>Teléfono:</Text>
          {editandoTelefono ? (
            <TextInput
              style={styles.input}
              value={tempTelefono}
              onChangeText={setTempTelefono}
              autoFocus
            />
          ) : (
            <Text style={styles.valor} numberOfLines={1} ellipsizeMode="tail">
              {telefono}
            </Text>
          )}
          {editandoTelefono ? (
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={() => {
                setTelefono(tempTelefono);
                actualizarCampo("telefono", tempTelefono);
                setEditandoTelefono(false);
              }}
            >
              <Feather name="check" size={20} color="green" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditandoTelefono(true)}>
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.opciones}>
          <Text style={styles.titulo}>Dirección:</Text>
          {editandoDireccion ? (
            <TextInput
              style={styles.input}
              value={tempDireccion}
              onChangeText={setTempDireccion}
              autoFocus
            />
          ) : (
            <Text style={styles.valor} numberOfLines={1} ellipsizeMode="tail">
              {direccion}
            </Text>
          )}
          {editandoDireccion ? (
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={() => {
                setDireccion(tempDireccion);
                actualizarCampo("direccion", tempDireccion);
                setEditandoDireccion(false);
              }}
            >
              <Feather name="check" size={20} color="green" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditandoDireccion(true)}>
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
          <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonBorrar}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="trash" size={20} color="red" />
          <Text style={styles.borrarCuenta}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.containerModal}>
          <View style={styles.contenidoModal}>
            <Text style={styles.tituloModal}>
              ¿Estás seguro de que deseas eliminar tu cuenta?
            </Text>
            <Text style={styles.subtituloModal}>
              Esta acción no se puede deshacer.
            </Text>
            <View style={styles.botonesModal}>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotonesModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonEliminarDef}
                onPress={() => {
                  setModalVisible(false);
                  eliminarCuenta();
                }}
              >
                <Text style={styles.textoBotonesModal}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    marginTop: height * 0.1,
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

  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: width,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.1,
  },

  image: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: height * 0.02,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: "#9B9B9B",
  },

  nombre: {
    marginTop: height * 0.02,
    fontSize: width * 0.06,
    fontWeight: "700",
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "#1E205B",
  },

  totalFotos: {
    marginTop: height * 0.01,
    fontSize: width * 0.05,
    marginBottom: height * 0.02,
    textAlign: "center",
  },

  numeroFotos: {
    fontSize: width * 0.1,
    marginBottom: height * 0.02,
    textAlign: "center",
  },

  titulo: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#1E205B",
  },

  opciones: {
    flexDirection: "row",
    marginBottom: height * 0.02,
    alignSelf: "flex-start",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingBottom: height * 0.01,
  },
  valor: {
    marginLeft: width * 0.02,
    fontSize: width * 0.05,
    flex: 1,
  },
  input: {
    marginLeft: width * 0.02,
    fontSize: width * 0.045,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#1E205B",
  },

  botonGuardar: {
    marginLeft: width * 0.02,
  },

  cerrarSesion: {
    fontSize: width * 0.05,
    color: "white",
    fontWeight: "bold",
  },

  botonCerrar: {
    backgroundColor: "#ED6D2F",
    borderRadius: 10,
    width: width * 0.5,
    height: height * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
  },

  botonBorrar: {
    marginTop: height * 0.03,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  borrarCuenta: {
    fontSize: width * 0.05,
    color: "red",
    marginLeft: width * 0.02,
  },

  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  contenidoModal: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: width * 0.05,
    alignItems: "center",
  },

  tituloModal: {
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    textAlign: "center",
  },

  subtituloModal: {
    fontSize: width * 0.035,
    color: "#666",
    marginBottom: height * 0.02,
    textAlign: "center",
  },

  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  botonCancelar: {
    backgroundColor: "#BEBEBE",
    padding: width * 0.03,
    borderRadius: 5,
    flex: 1,
    marginRight: width * 0.02,
    alignItems: "center",
  },

  botonEliminarDef: {
    backgroundColor: "red",
    padding: width * 0.03,
    borderRadius: 5,
    flex: 1,
    marginLeft: width * 0.02,
    alignItems: "center",
  },

  textoBotonesModal: {
    color: "white",
    fontWeight: "bold",
  },
});
