import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Dimensions,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function Perfil() {
  return (
    <View style={styles.mainContainer}>
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

        <Text style={styles.nombre}>Nombre de Usuario</Text>
        <Text style={styles.totalFotos}>Total fotos subidas:</Text>
        <Text style={styles.numeroFotos}>10</Text>
        <View style={styles.opciones}>
          <Text style={styles.titulo}>Correo electrónico:</Text>
          <Text style={styles.valor}>user@example.com</Text>
        </View>
        <View style={styles.opciones}>
          <Text style={styles.titulo}>Teléfono:</Text>
          <Text style={styles.valor}>640 548 215</Text>
          <Feather name="edit" size={20} color="black" style={{ marginLeft: 10 }}/>
        </View>
        <View style={styles.opciones}>
          <Text style={styles.titulo}>Dirección:</Text>
          <Text style={styles.valor}>Calle del Tuning, 47</Text>
          <Feather name="edit" size={20} color="black" style={{ marginLeft: 10 }}/>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    marginBottom: 10,
  },

  opciones: {
    flexDirection: "row",
    marginBottom: 20,
    width: "80%",
  },

  valor:{
    marginLeft: 10,
    fontSize: 18,
  }
});
