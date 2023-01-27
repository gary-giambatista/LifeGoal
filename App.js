import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { AuthContextProvider } from "./hooks/useAuth";
import A_LoginRouterStackNavigator from "./stacks/A_LoginRouterStackNavigator";
// import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
	//Import Fonts
	let [fontsLoaded] = useFonts({
		IndieFlower: require("./assets/fonts/IndieFlower-Regular.ttf"),
		FuzzyBubblesRegular: require("./assets/fonts/FuzzyBubbles-Regular.ttf"),
		FuzzyBubblesBold: require("./assets/fonts/FuzzyBubbles-Bold.ttf"),
	});
	if (!fontsLoaded) {
		return null;
	}
	return (
		<NavigationContainer>
			<AuthContextProvider>
				<A_LoginRouterStackNavigator />
				<StatusBar style="auto" />
			</AuthContextProvider>
		</NavigationContainer>
	);
}
