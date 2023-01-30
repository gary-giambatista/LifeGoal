import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import SavedQuoteRow from "./SavedQuoteRow";

const SavedQuoteList = () => {
	//fetch user's Saved quotes
	const { user, theme } = useAuth();
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		firestore()
			.collection("Quotes")
			.where("userId", "==", user.uid)
			// .orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				setQuotes(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});
	}, [user]);
	// console.log(quotes);

	return quotes.length > 0 ? (
		<View>
			{/* Header for "Saved Quotes" screen */}
			<View
				style={[
					styles.HeaderContainer,
					styles.cardShadow,
					theme === "dark" ? styles.darkModeBG : null,
				]}
			>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.darkModeTitle : null,
					]}
				>
					Saved Quotes
				</Text>
			</View>
			{/* Map out the Quote's using a <SavedQuoteRow component */}
			<FlatList
				style={[
					styles.chatListContainer,
					theme === "dark" ? styles.darkModeChatListContainer : null,
				]}
				data={quotes}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SavedQuoteRow quote={item} />}
			/>
		</View>
	) : (
		<View>
			<Text style={styles.noMatchText}>No saved quotes yet</Text>
		</View>
	);
};

export default SavedQuoteList;

const styles = StyleSheet.create({
	chatListContainer: {
		height: "100%",
	},
	darkModeChatListContainer: {
		backgroundColor: "#2B3642",
	},
	noMatchText: {
		padding: 20,
		textAlign: "center",
		lineHeight: 28,
		fontSize: 18,
		fontWeight: "bold",
	},
	HeaderContainer: {
		paddingTop: 22,
		paddingLeft: 15,
		paddingRight: 15,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "baseline",
		backgroundColor: "white",
		marginBottom: 10,
		paddingBottom: 5,
		// borderBottomWidth: 1,
		// borderBottomColor: "#8899A6",
	},
	darkModeBG: {
		backgroundColor: "#0E1A28",
	},
	pageTitle: {
		fontFamily: "FuzzyBubblesBold",
		fontSize: 30,
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
