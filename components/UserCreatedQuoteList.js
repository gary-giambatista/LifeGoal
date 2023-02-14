import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	SectionList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import UserCreatedQuoteRow from "./UserCreatedQuoteRow";

const UserCreatedQuoteList = ({ editing, setEditing }) => {
	const [userQuotes, setUserQuotes] = useState([]);
	const [userQuote, setUserQuote] = useState("");
	const { user, theme } = useAuth();

	// FETCH: live listener for "UserQuotes" collection
	useEffect(() => {
		firestore()
			.collection("UserQuotes")
			.where("userId", "==", user.uid)
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				setUserQuotes(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});
	}, [user]);

	//use userQuote from TextInput to write to DB and create UserQuotes collection
	// WRITE FUNCTION: onPress of "Save" button > create UserQuote using userQuote state
	async function createUserQuote() {
		firestore()
			.collection("UserQuotes")
			// .doc(`${user.uid}`)
			.add({
				userId: user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				userQuote: userQuote,
				//FUTURE isPublic: false,
			})
			.then(() => {
				setEditing(false);
				console.log("Quote Saved!");
			});
	}
	//notes on create: cannot pass userQuote up to SavedQuoteList for fancy header icon swap (cannot properly update DB)

	return (
		<View style={styles.componentContainer}>
			{editing ? (
				<View
					style={[
						styles.sectionContainer,
						styles.cardShadow,
						theme === "dark" ? styles.sectionContainerDarkMode : null,
					]}
				>
					<Text style={{ fontSize: 16 }}>Write Your Own Quote!</Text>
					<TextInput
						multiline={true}
						numberOfLines={5}
						style={styles.input}
						placeholder="Write your quote here..."
						onChangeText={setUserQuote}
						value={userQuote}
						editable={editing}
					/>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<TouchableOpacity
							onPress={() => {
								createUserQuote();
							}}
							disabled={!editing}
							style={styles.saveButton}
						>
							<Text style={styles.buttonText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setUserQuote("");
								setEditing(false);
							}}
							style={styles.cancelButton}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : null}
			{userQuotes || (userQuote && !editing) ? (
				<View>
					{/* <Text style={styles.sectionTitle}>Your quotes</Text> */}
					{/* try sectionlist here */}
					{/* <UserCreatedQuoteRow userQuote={userQuote} /> */}
					<FlatList
						data={userQuotes}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <UserCreatedQuoteRow userQuote={item} />}
						// ListFooterComponent={() => {
						// 	userQuotes.length === 0 ? null : (
						// 		<ActivityIndicator style={{ padding: 8 }} />
						// 	);
						// }}
					/>
				</View>
			) : (
				<ActivityIndicator style={{ padding: 8 }} />
			)}
		</View>
	);
};

export default UserCreatedQuoteList;

const styles = StyleSheet.create({
	componentContainer: {},
	sectionContainer: {
		backgroundColor: "white",
		// flexDirection: "row",
		margin: 10,
		padding: 10,
		borderRadius: 10,
		borderLeftWidth: 7,
		borderColor: "#B4C4DB",
	},
	sectionContainerDarkMode: {
		backgroundColor: "#5F5D8F",
		borderColor: "#8A86CF",
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
	saveButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
		justifyContent: "center",
		backgroundColor: "black",
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
		backgroundColor: "black",
		height: 30,
		width: 80,
		backgroundColor: "#993626",
		borderRadius: 6,
		marginRight: 8,
	},
	buttonText: {
		fontSize: 16,
		color: "white",
	},
	// sectionTitle: {
	// 	marginLeft: 12,
	// 	marginRight: 10,
	// 	fontSize: 20,
	// },
	// quoteText: {
	// 	fontSize: 14,

	// },
});
