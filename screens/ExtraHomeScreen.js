import React from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const ExtraHomeScreen = () => {
	const { logOut, loading, user, theme } = useAuth();
	return (
		<View style={{ flex: 1 }}>
			<Text>HomeScreen</Text>
			<Button onPress={logOut} title="Logout"></Button>
		</View>
	);
};

export default ExtraHomeScreen;
