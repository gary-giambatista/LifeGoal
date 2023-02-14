import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const GoalFeedRow = ({ goal }) => {
	const { user, theme } = useAuth();

	return (
		<View
			style={[
				styles.rowContainer,
				styles.cardShadow,
				theme === "dark" ? styles.darkModeRowContainer : null,
			]}
		>
			<Text
				style={[
					styles.goalText,
					theme === "dark" ? styles.darkmodeGoalText : null,
				]}
			>
				"{goal.goal}"
			</Text>
		</View>
	);
};

export default GoalFeedRow;

const styles = StyleSheet.create({
	rowContainer: {
		margin: 10,
		marginBottom: 5,
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		borderLeftWidth: 7,
		borderColor: "#658AC2",
	},
	darkModeRowContainer: {
		backgroundColor: "#5F5D8F",
		borderColor: "#8A86CF",
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
	goalText: {
		fontSize: 19,
		fontFamily: "PhiloItalic",
	},
	darkmodeGoalText: {
		color: "black",
	},
});
