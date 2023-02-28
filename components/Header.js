import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

const Header = ({ title }) => {
	const navigation = useNavigation();
	const { theme, logOut, onGoogleButtonPress } = useAuth();

	//alert for Logout Button pressed
	const toggleLogoutAlert = () =>
		Alert.alert("Logout?", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{ text: "LOGOUT", onPress: () => logOut() },
		]);

	return (
		<View
			style={[
				styles.headerContainer,
				styles.cardShadow,
				theme === "dark" ? styles.darkModeBG : null,
			]}
		>
			<View style={styles.backAndTitleContainer}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{ padding: 5 }}
				>
					<Ionicons
						name="chevron-back-outline"
						size={34}
						color={theme === "dark" ? "#8A86CF" : "#222F42"}
					/>
				</TouchableOpacity>
				<Text
					style={[styles.title, theme === "dark" ? styles.darkModeTitle : null]}
				>
					{title}
				</Text>
			</View>
			<TouchableOpacity
				style={[
					styles.signOutButton,
					styles.cardShadow,
					theme === "dark" ? styles.signOutButtonDarkMode : null,
				]}
				onPress={toggleLogoutAlert}
			>
				<Text
					style={[
						styles.signOutText,
						theme === "dark" ? styles.signOutTextDarkMode : null,
					]}
				>
					Sign Out
				</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	darkModeBG: {
		backgroundColor: "#0E1A28",
	},
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		paddingTop: 25,
		paddingBottom: 3,
		// padding: 3,
	},
	backAndTitleContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		// flexShrink: 1,
		fontFamily: "PhiloBold",
		fontSize: 32,
		color: "#222F42",
		letterSpacing: 1,
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
	signOutButton: {
		backgroundColor: "#222F42",
		borderRadius: 10,
		height: 34,
		width: 80,
		margin: 5,
		marginRight: 15,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	signOutButtonDarkMode: {
		backgroundColor: "#8A86CF",
	},
	signOutText: {
		color: "white",
		paddingBottom: 1,
	},
	signOutTextDarkMode: {},
});

export default Header;
