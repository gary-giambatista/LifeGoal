import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
	const [user, setUser] = useState(true);
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			{user ? (
				<Stack.Screen name="Home" component={HomeScreen} />
			) : (
				<Stack.Screen name="Login" component={LoginScreen} />
			)}
		</Stack.Navigator>
	);
};

export default StackNavigator;
