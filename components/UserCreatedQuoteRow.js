import firestore from "@react-native-firebase/firestore";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const UserCreatedQuoteRow = ({ userQuote }) => {
	const { user, theme } = useAuth();

	// Firebase delete function, with document id as quoteID from props < event listener is <SavedQuoteList /> useEffect
	async function deleteQuote(userQuoteId) {
		firestore()
			.collection("UserQuotes")
			.doc(`${userQuoteId}`)
			.delete()
			.then(() => {
				console.log("User quote deleted!");
			});
	}

	//onPress function to alert, if yes, calls deleteQuote
	const touchToDeleteAlert = () =>
		Alert.alert(
			"DELETE Quote?",
			"If you press DELETE, your quote will be removed for your saved list!",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "DELETE", onPress: () => deleteQuote(userQuote.id) },
			]
		);

	return (
		<View>
			<TouchableOpacity
				onPress={() => {
					touchToDeleteAlert();
				}}
				style={[
					styles.sectionContainer,
					styles.cardShadow,
					theme === "dark" ? styles.sectionContainerDarkMode : null,
				]}
			>
				<Text style={styles.quoteText}>{userQuote.userQuote}</Text>
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
	sectionContainerDarkMode: {
		backgroundColor: "#5F5D8F",
		borderColor: "#C2BFFF",
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
	quoteText: {
		fontSize: 19,
		fontFamily: "PhiloItalic",
		padding: 13,
		// fontFamily: "FuzzyBubblesRegular",
	},
});
