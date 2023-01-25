import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "../screens/LoginScreen";
import B_MainTabNavigator from "./B_MainTabNavigator";

const Stack = createNativeStackNavigator();

const A_LoginRouterStackNavigator = () => {
	const { user } = useAuth();

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			{user ? (
				<Stack.Screen name="Tab Navigator" component={B_MainTabNavigator} />
			) : (
				<Stack.Screen name="Login" component={LoginScreen} />
			)}
		</Stack.Navigator>
	);
};

export default A_LoginRouterStackNavigator;
