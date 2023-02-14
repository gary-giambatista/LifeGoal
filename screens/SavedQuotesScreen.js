import React from "react";
import { Text, View } from "react-native";
import SavedQuoteList from "../components/SavedQuoteList";

const SavedQuotesScreen = () => {
	return (
		<View>
			{/* Quote List > Quote Row Components */}
			<SavedQuoteList />
			<Text>Testing</Text>
		</View>
	);
};

export default SavedQuotesScreen;
