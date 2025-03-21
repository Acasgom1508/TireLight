import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import { useState } from "react";
import Feather from "react-native-vector-icons/Feather";

export default function Perfil() {
  const [nombre, setNombre] = useState("Nombre de Usuario");
  const [telefono, setTelefono] = useState("640 548 215");
  const [direccion, setDireccion] = useState("Calle del Tuning, 47");

  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoTelefono, setEditandoTelefono] = useState(false);
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  const [tempNombre, setTempNombre] = useState(nombre);
  const [tempTelefono, setTempTelefono] = useState(telefono);
  const [tempDireccion, setTempDireccion] = useState(direccion);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior="height"
    >
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
            uri: "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
          }}
          style={styles.image}
        />

        <Button style={styles.botonCambiarFoto} title="Cambiar foto" />

        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.totalFotos}>Total fotos subidas:</Text>
        <Text style={styles.numeroFotos}>10</Text>

        <View style={styles.opciones}>
          <Text style={styles.titulo}>Correo electrónico:</Text>
          <Text style={styles.valor} numberOfLines={1} ellipsizeMode="tail">
            user@example.com
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
      </ScrollView>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    marginTop: 60,
  },
  
  botonAtras: {
    position: "absolute",
    left: 35,
  },

  header: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  textoHeader: {
    fontSize: 20,
  },

  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },

  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#9B9B9B",
  },

  nombre: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1E205B",
  },

  totalFotos: {
    marginTop: 10,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  
  numeroFotos: {
    fontSize: 45,
    marginBottom: 20,
    textAlign: "center",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E205B",
  },

  opciones: {
    flexDirection: "row",
    marginBottom: 15,
    width: "80%",
    alignSelf: "flex-start",
    alignItems: "center", 
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingBottom: 10,
  },
  valor: {
    marginLeft: 10,
    fontSize: 20,
    flex: 1,
  },
  input: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#1E205B",
  },
  
  botonGuardar: {
    marginLeft: 10,
  },
});