import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import React, { useRef, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const UserCreatedQuoteRow = ({ userQuote }) => {
	const { user, theme } = useAuth();
	const [editing, setEditing] = useState(false);
	const [editingText, setEditingText] = useState(userQuote.userQuote); // duplicate state helps when needing to cancel and restore previous quote state
	// const inputRef = useRef(); add auto focus here when editing

	//alert to go into editing
	const editQuoteAlert = () =>
		Alert.alert(
			"EDIT Quote?",
			"While editing, you can change or delete your quote.",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "EDIT", onPress: () => setEditing(true) },
			]
		);

	//userQuote.id (DOCUMENT ID)
	async function updateUserQuote() {
		firestore()
			.collection("UserQuotes")
			.doc(`${userQuote.id}`)
			.update({
				userQuote: editingText,
			})
			.then(() => {
				setEditing(false);
				console.log("User Quote updated!");
			});
	}

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
		<KeyboardAvoidingView>
			<TouchableOpacity
				onPress={() => {
					editQuoteAlert(); // could remove this alert and directly go to editing
				}}
				style={[
					styles.sectionContainer,
					styles.cardShadow,
					theme === "dark" ? styles.sectionContainerDarkMode : null,
				]}
			>
				{editing ? (
					<View style={{ display: "flex" }}>
						<TextInput
							// ref={inputRef}
							multiline={true}
							numberOfLines={5}
							style={[
								styles.input,
								theme === "dark" ? styles.inputDarkMode : null,
							]}
							placeholder="Write your quote here..."
							placeholderTextColor="grey"
							onChangeText={setEditingText}
							value={editingText}
							editable={editing}
						/>
						<View style={styles.editingButtonContainer}>
							<TouchableOpacity
								onPress={() => {
									updateUserQuote();
								}}
								style={[
									styles.saveButton,
									theme === "dark" ? styles.saveButtonDarkMode : null,
								]}
							>
								<Text style={{ color: "white" }}>Save</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setEditing(false);
									setEditingText(userQuote.userQuote);
								}}
								style={[
									styles.cancelButton,
									theme === "dark" ? styles.cancelButtonDarkMode : null,
								]}
							>
								<Text style={{ color: "white" }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									touchToDeleteAlert();
								}}
								style={[
									styles.deleteButton,
									theme === "dark" ? styles.deleteButtonDarkMode : null,
								]}
							>
								{/* <Text style={{ color: "white" }}>Delete</Text> */}
								<AntDesign name="delete" size={19} color="white" />
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<Text style={styles.quoteText}>{userQuote.userQuote}</Text>
				)}
			</TouchableOpacity>
		</KeyboardAvoidingView>
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
	input: {
		textAlignVertical: "top",
		padding: 10,
		paddingTop: 10,
		marginBottom: 10,
		marginTop: 10,
		flexDirection: "row",
		height: 100,
		fontSize: 14,
		borderColor: "#BFBFBF",
		borderWidth: 1,
		borderRadius: 6,
		marginRight: 10,
		marginLeft: 10,
	},
	inputDarkMode: {
		color: "white",
	},
	editingButtonContainer: {
		display: "flex",
		flexDirection: "row",
		padding: 5,
	},
	saveButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
		justifyContent: "center",
		height: 30,
		width: 80,
		backgroundColor: "#222F42",
		borderRadius: 6,
		marginRight: 8,
	},
	cancelButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
		justifyContent: "center",
		height: 30,
		width: 80,
		backgroundColor: "#993626",
		borderRadius: 6,
		marginRight: 8,
	},
	deleteButton: {
		marginLeft: "auto",
		padding: 3,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
		justifyContent: "center",
		height: 30,
		width: 40,
		backgroundColor: "#993626",
		borderRadius: 6,
		marginRight: 8,
	},
	saveButtonDarkMode: {
		backgroundColor: "#222F42",
	},
	cancelButtonDarkMode: {
		backgroundColor: "#993626",
	},
	deleteButtonDarkMode: {
		backgroundColor: "#8A86CF",
	},
});
