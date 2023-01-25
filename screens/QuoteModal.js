import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

const QuoteModal = () => {
	const navigation = useNavigation();
	return (
		<View style={{ flex: 1, backgroundColor: "orange" }}>
			<Text>QuoteModal</Text>
			<Button
				onPress={() => navigation.navigate("Goal Screen")}
				title="Goal Screen"
			></Button>
		</View>
	);
};

export default QuoteModal;
