import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthContextProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
// import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
	return (
		<NavigationContainer>
			<AuthContextProvider>
				<StackNavigator />
				<StatusBar style="auto" />
			</AuthContextProvider>
		</NavigationContainer>
	);
}
