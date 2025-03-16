import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Bienvenida from "./screens/Bienvenida";
import InicioSesion from "./screens/InicioSesion";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenida" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Bienvenida" component={Bienvenida} />
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}