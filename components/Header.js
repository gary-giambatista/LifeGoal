import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const Header = ({ title }) => {
	const navigation = useNavigation();
	const { theme } = useAuth();

	return (
		<View
			style={[
				styles.headerContainer,
				styles.cardShadow,
				theme === "dark" ? styles.darkModeBG : null,
			]}
		>
			<View style={styles.backAndTitleContainer}>
				{/* <TouchableOpacity
					onPress={
						goBack
							? () => navigation.goBack()
							: () => navigation.navigate("Home")
					}
					style={{ padding: 5 }}
				>
					<Ionicons
						name="chevron-back-outline"
						size={34}
						color={theme === "dark" ? "#6D6B8F" : "black"}
					/>
				</TouchableOpacity> */}
				<Text
					style={[styles.title, theme === "dark" ? styles.darkModeTitle : null]}
				>
					{title}
				</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	darkModeBG: {
		backgroundColor: "#0E1A28",
	},
	headerContainer: {
		padding: 10,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		height: 105,
		paddingTop: 50,
	},
	backAndTitleContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		flexShrink: 1,
		fontSize: 20,
		fontWeight: "bold",
		paddingLeft: 10,
		paddingRight: 10,
	},
	darkModeTitle: {
		color: "#B0B3B8",
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
});

export default Header;
