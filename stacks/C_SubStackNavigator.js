//home goal screen and modal for quotes
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";
import GoalHelpModal from "../screens/GoalHelpModal";
import GoalScreen from "../screens/GoalScreen";

const Stack = createNativeStackNavigator();

const C_SubStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Group>
				<Stack.Screen name="Goal Screen" component={GoalScreen} />
			</Stack.Group>
			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="Goal Help Modal" component={GoalHelpModal} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default C_SubStackNavigator;
