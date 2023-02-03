import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UserCreatedQuoteRow = ({ userQuote }) => {
	return (
		<View>
			<TouchableOpacity
				// onPress={deteleUserQuote}
				style={[styles.sectionContainer, styles.cardShadow]}
			>
				<Text style={styles.quoteText}>{userQuote}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default UserCreatedQuoteRow;

const styles = StyleSheet.create({
	sectionContainer: {
		backgroundColor: "white",
		margin: 10,
		padding: 10,
		borderRadius: 10,
		borderLeftWidth: 7,
		borderColor: "#B4C4DB",
	},
	cardShadow: {
		shadowColor: "000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	},
	sectionTitle: {
		marginLeft: 12,
		marginRight: 10,
		fontSize: 20,
	},
	quoteText: {
		fontSize: 18,
		fontStyle: "italic",
		padding: 5,
	},
});
