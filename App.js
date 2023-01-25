import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthContextProvider } from "./hooks/useAuth";
import A_LoginRouterStackNavigator from "./stacks/A_LoginRouterStackNavigator";
// import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
	return (
		<NavigationContainer>
			<AuthContextProvider>
				<A_LoginRouterStackNavigator />
				<StatusBar style="auto" />
			</AuthContextProvider>
		</NavigationContainer>
	);
}
