import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

const ProfileScreen = () => {
	const { user, theme, logOut } = useAuth();
	const navigation = useNavigation();
	const { params } = useRoute();

	//alert for Delete ACCOUNT Button pressed
	const toggleAccountDeleteAlert = () =>
		Alert.alert(
			"Delete Account?",
			"If you delete your account, all data will be deleted.",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "DELETE", onPress: () => logOut() }, //add delete function
			]
		);

	const timeSettings = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24];

	return (
		<View>
			<Header title={"My Profile"} />

			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10,
				}}
			>
				<Text style={{ fontSize: 16 }}>Goal notification every:</Text>
				<SelectDropdown
					defaultValue={params.notificationTimer}
					data={timeSettings}
					onSelect={(selectedItem, index) => {
						console.log(selectedItem, index);
						params.setNotificationTimer(selectedItem);
						params.updateNotification(selectedItem);
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return `${selectedItem} hours`;
					}}
					rowTextForSelection={(item, index) => {
						return `${item} hours`;
					}}
					renderDropdownIcon={(isOpened) => {
						return (
							<Entypo
								name="select-arrows"
								size={24}
								color={theme === "dark" ? "#222133" : "#222F42"}
							/>
						);
					}}
					// buttonStyle={[
					// 	styles.dropdownButton,
					// 	styles.cardShadow,
					// 	theme === "dark" ? styles.dropdownButtonDarkMode : null,
					// ]}
					// buttonTextStyle={[
					// 	styles.dropdownButtonText,
					// 	theme === "dark" ? styles.dropdownButtonTextDarkMode : null,
					// ]}
					dropdownStyle={{
						borderRadius: 10,
						backgroundColor: theme === "dark" ? "#5F5D8F" : "white",
					}}
					rowStyle={styles.dropdownRow}
					rowTextStyle={styles.dropdownRowText}
					buttonStyle={{
						backgroundColor: theme === "dark" ? "#5F5D8F" : "white",
						borderRadius: 10,
						shadowColor: "000",
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.2,
						shadowRadius: 1.41,
						elevation: 2,
						margin: 10,
						width: 135,
						height: 40,
					}}
					buttonTextStyle={{ fontSize: 16 }}
				/>
			</View>

			<View
				style={[
					styles.informationContainer,
					styles.cardShadow,
					theme === "dark" ? styles.informationContainerDarkMode : null,
				]}
			>
				<Text
					style={[
						styles.infoTitleText,
						theme === "dark" ? styles.infoTitleTextDarkMode : null,
					]}
				>
					Email:{" "}
				</Text>
				<Text style={{ fontSize: 15, paddingRight: 10 }}>{user.email}</Text>
			</View>
			<View
				style={[
					styles.informationContainer,
					styles.cardShadow,
					theme === "dark" ? styles.informationContainerDarkMode : null,
				]}
			>
				<Text
					style={[
						styles.infoTitleText,
						theme === "dark" ? styles.infoTitleTextDarkMode : null,
					]}
				>
					Delete Account
				</Text>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={toggleAccountDeleteAlert}
				>
					<Text style={styles.buttonText}>Delete</Text>
					<AntDesign name="warning" size={20} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	informationContainer: {
		height: 80,
		margin: 15,
		marginTop: 15,
		marginBottom: 0,
		borderRadius: 10,
		backgroundColor: "white",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	informationContainerDarkMode: {},
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
	infoTitleText: {
		padding: 15,
		fontSize: 19,
	},
	infoTitleTextDarkMode: {
		color: "white",
	},
	cancelButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
		justifyContent: "center",
		height: 30,
		width: 100,
		backgroundColor: "#993626",
		borderRadius: 6,
		marginRight: 8,
	},
	buttonText: {
		fontSize: 16,
		color: "white",
		paddingRight: 6,
	},
	dropdownButton: {
		backgroundColor: "white",
		borderRadius: 10,
	},
	dropdownButtonDarkMode: {
		backgroundColor: "#5F5D8F",
	},
	dropdownButtonText: {
		fontSize: 16,
	},
	dropdownButtonTextDarkMode: {
		color: "white",
	},
});
