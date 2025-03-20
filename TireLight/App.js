import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";

import Bienvenida from "./screens/Bienvenida";
import InicioSesion from "./screens/InicioSesion";
import Registro from "./screens/Registro";
import Concurso from "./screens/Concurso";
import Fotos from "./screens/Fotos";
import Administracion from "./screens/Administracion";
import Perfil from "./screens/Perfil";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Bienvenida"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Bienvenida"
          component={Bienvenida}
          options={{ tabBarStyle: { display: "none" } }}
        />
        <Stack.Screen
          name="InicioSesion"
          component={InicioSesion}
          options={{ tabBarStyle: { display: "none" } }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ tabBarStyle: { display: "none" } }}
        />
        <Stack.Screen
          name="Pantallas"
          component={Pantallas}
          options={{ tabBarStyle: { display: "none" } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Pantallas({ route }) {
  const { rol } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Perfil") {
            iconName = "user";
          }

          if (route.name === "Concurso") {
            iconName = "camera";
          }

          if (route.name === "Fotos") {
            iconName = "image";
          }

          if (route.name === "Administracion") {
            iconName = "settings";
          }

          return (
            <Feather
              name={iconName}
              size={27}
              color={focused ? "#ED6D2F" : "black"}
            />
          );
        },

        tabBarStyle: {
          height: 60,
          paddingTop: 10,
          borderRadius: 80,
          paddingBottom: 10,
          backgroundColor: "white",
          elevation: 0,
          borderTopWidth: 0,
          marginHorizontal: 20,
          marginBottom: 30,
        },

        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Concurso"
        component={Concurso}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Fotos"
        component={Fotos}
        options={{ headerShown: false }}
      />

      {rol === "admin" && (
        <Tab.Screen
          name="Administracion"
          component={Administracion}
          options={{ headerShown: false }}
        />
      )}

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
