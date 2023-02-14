import {
	AntDesign,
	Feather,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import GoalFeed from "../screens/GoalFeed";
import PlanScreen from "../screens/PlanScreen";
import SavedQuotesScreen from "../screens/SavedQuotesScreen";
import C_SubStackNavigator from "./C_SubStackNavigator";

const Tab = createBottomTabNavigator();

const B_MainTabNavigator = () => {
	const { logOut, loading, user, theme } = useAuth();
	return (
		<Tab.Navigator
			initialRouteName="Goal Screen Tab Container"
			screenOptions={{
				tabBarActiveTintColor: theme === "dark" ? "#928FDB" : "#222F42",
				headerShown: false,
				tabBarActiveBackgroundColor: theme === "dark" ? "#2C2B42" : undefined,
				tabBarInactiveBackgroundColor: theme === "dark" ? "#222133" : undefined,
			}}
		>
			<Tab.Screen
				name="Saved Quotes"
				component={SavedQuotesScreen}
				options={{
					tabBarLabel: "Saved Quotes",
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="md-bookmarks"
							size={size}
							color={color}
							//theme === "dark" ? "" : ""
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Goal Screen Tab Container"
				component={C_SubStackNavigator}
				options={{
					tabBarLabel: "My Goal",
					tabBarIcon: ({ color, size }) => (
						// <Ionicons name="ios-home" size={size} color={color} />
						<Feather name="target" size={size} color={color} />
						// <Foundation name="trees" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Plan Screen"
				component={PlanScreen}
				options={{
					tabBarLabel: "My Plans",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="floor-plan"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Goal Feed"
				component={GoalFeed}
				options={{
					tabBarLabel: "Goal Feed",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="format-list-text"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default B_MainTabNavigator;
