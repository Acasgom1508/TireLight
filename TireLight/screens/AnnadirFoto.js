import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

export default function AnnadirFoto() {
  const navigation = useNavigation();

  const [foto, setFoto] = useState(null);

  // Firebase
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const user = auth.currentUser;

  // Cloudinary - datos API
  const cloud_name = "dai0shknj";
  const preset_name = "prueba";
  const [loading, setLoading] = useState(false);

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

      setFoto(urlSubida);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setLoading(false);
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
        <Text style={styles.textoHeader}>Publicar foto</Text>
      </View>

      {/* Boton añadir foto o foto */}
      {!foto ? (
        <TouchableOpacity style={styles.botonAnnadirFoto} onPress={pickImage}>
          <Feather
            name="upload"
            size={26}
            color="#333"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
            Añadir foto
          </Text>
        </TouchableOpacity>
      ) : (
        <Image
          source={{ uri: foto }}
          style={{
            width: "90%",
            height: height * 0.25,
            borderRadius: 10,
            marginVertical: height * 0.03,
            marginTop: height * 0.05,
          }}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
        }}
      >
        <TextInput style={styles.input} placeholder="Titulo" />

        <TouchableOpacity style={styles.botonAnnadir}>
          <Feather name="send" size={25} color="#1E205B" style={{ margin: 10 }} />
        </TouchableOpacity>
      </View>

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

  botonAnnadirFoto: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
    width: "90%",
    height: height * 0.25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    width: "85%",
    height: height * 0.06,
    fontSize: 18,
    color: "#404040",
    borderWidth: 2,
    borderColor: "#1E205B",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: height * 0.015,
  },

  botonAnnadir: {
    backgroundColor: "#ED6D2F",
    borderRadius: 30,
    width: "15%",
    height: height * 0.06,
    marginLeft: height * 0.01,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
