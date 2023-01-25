import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

const GoalScreen = () => {
	const navigation = useNavigation();

	return (
		<View>
			<Text>GoalScreen</Text>
			<Button
				onPress={() => navigation.navigate("Quote Modal")}
				title="MODAL"
			></Button>
		</View>
	);
};

export default GoalScreen;
