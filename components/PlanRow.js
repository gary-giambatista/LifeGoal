import firestore from "@react-native-firebase/firestore";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const PlanRow = ({ plan }) => {
	const { user, theme } = useAuth();

	//CREATE:: FireBase SET function

	//DELETE:: FireBase DELETE function
	async function deleteQuote(planId) {
		firestore()
			.collection("Plans")
			.doc(`${planId}`)
			.delete()
			.then(() => {
				console.log("User quote deleted!");
			});
	}

	//onPress function to alert, if yes, calls deleteQuote
	const touchToDeleteAlert = () =>
		Alert.alert(
			"DELETE Plan?",
			"If you press DELETE, your plan will be removed for your plan list!",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "DELETE", onPress: () => deleteQuote(plan.id) },
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
				<Text style={styles.planText}>{plan.plan}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PlanRow;

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
	planText: {
		fontSize: 19,
		fontFamily: "PhiloItalic",
		padding: 13,
		// fontFamily: "FuzzyBubblesRegular",
	},
});
