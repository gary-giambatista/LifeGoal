import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import GoalFeed from "../screens/GoalFeed";
import SavedQuotesScreen from "../screens/SavedQuotesScreen";
import C_SubStackNavigator from "./C_SubStackNavigator";

const Tab = createBottomTabNavigator();

const B_MainTabNavigator = () => {
	const { logOut, loading, user, theme } = useAuth();
	return (
		<Tab.Navigator
			initialRouteName="ExtraHomeScreen"
			screenOptions={{
				tabBarActiveTintColor: "#e91e63",
			}}
		>
			<Tab.Screen name="Saved Quotes" component={SavedQuotesScreen} />
			<Tab.Screen
				name="Goal Screen Tab Container"
				component={C_SubStackNavigator}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="home" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen name="Goal Feed" component={GoalFeed} />
		</Tab.Navigator>
	);
};

export default B_MainTabNavigator;