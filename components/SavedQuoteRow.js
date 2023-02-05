import firestore from "@react-native-firebase/firestore";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const SavedQuoteRow = ({ quote }) => {
	const { user, theme } = useAuth();

	//Also can move function 1 component up to <SavedQuoteList /> and pass down here
	// Firebase delete function, with document id as quoteID from props < event listener is <SavedQuoteList /> useEffect
	async function deleteQuote(quoteId) {
		firestore()
			.collection("Quotes")
			.doc(`${quoteId}`)
			.delete()
			.then(() => {
				console.log("Quote deleted!");
			});
	}

	//onPress function to alert, if yes, calls deleteQuote
	const touchToDeleteAlert = () =>
		Alert.alert(
			"DELETE Quote?",
			"If you press DELETE, this quote will be removed for your saved list!",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "DELETE", onPress: () => deleteQuote(quote.id) },
			]
		);

	return (
		<TouchableOpacity
			// onPress={() => navigation.navigate("Message", { matchDetails })}
			//test quote below
			onPress={() => {
				touchToDeleteAlert();
			}}
			style={[
				styles.rowContainer,
				styles.cardShadow,
				theme === "dark" ? styles.darkModeRowContainer : null,
			]}
		>
			<Text
				style={[
					styles.quoteText,
					theme === "dark" ? styles.darkModeQuoteText : null,
				]}
			>
				"{quote.quote}"
			</Text>
			<Text
				style={[
					styles.authorText,
					theme === "dark" ? styles.darkModeText : null,
				]}
			>
				- {quote.quoteAuthor}
			</Text>
		</TouchableOpacity>
	);
};

export default SavedQuoteRow;

const styles = StyleSheet.create({
	rowContainer: {
		overflow: "hidden",
		// padding: 20,
		margin: 10,
		marginTop: 5,
		// flexDirection: "col",
		backgroundColor: "white",
		borderRadius: 10,
		borderLeftWidth: 7,
		borderColor: "#658AC2",
	},
	darkModeRowContainer: {
		backgroundColor: "#0E1A28",
		borderRadius: 10,
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
		// lineHeight: 28,
		// fontWeight: "bold",
		fontSize: 18,
		fontStyle: "italic",
		paddingTop: 25,
		paddingRight: 20,
		paddingLeft: 25,
		paddingBottom: 0,
	},
	darkModeQuoteText: {
		color: "#8899A6",
	},
	darkModeText: {
		color: "#4C5F75",
	},
	authorText: {
		fontSize: 14,
		fontStyle: "italic",
		textAlign: "right",
		padding: 10,
	},
});
