import React from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const HomeScreen = () => {
	const { logOut, loading, user, theme } = useAuth();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Text>HomeScreen</Text>
			<Button onPress={logOut} title="Logout"></Button>
		</SafeAreaView>
	);
};

export default HomeScreen;
