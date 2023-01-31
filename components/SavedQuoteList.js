import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import SavedQuoteRow from "./SavedQuoteRow";

const SavedQuoteList = () => {
	//fetch user's Saved quotes
	const { user, theme } = useAuth();
	const [quotes, setQuotes] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// setIsLoading(true);
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
		// setIsLoading(false);
	}, [user]);
	// **Setting the Quote order to be descending in order by createdAt date
	//nanoseconds/seconds
	//quotes[i].createdAt
	// console.log(quotes[1].createdAt);
	// const newQuotes = quotes.sort((a, b) => {
	// 	b.createdAt - a.createdAt;
	// });

	// console.log(quotes);

	return quotes.length > 0 ? (
		<View>
			{/* {isLoading ? <ActivityIndicator /> : null} */}
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
		height: "89%",
		overflow: "scroll",
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
	darkModeTitle: {
		color: "#8899A6",
	},
	pageTitle: {
		fontFamily: "FuzzyBubblesBold",
		fontSize: 30,
		color: "#222F42",
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
	darkModeQuoteText: {
		color: "#8899A6",
	},
	darkModeText: {
		color: "#4C5F75",
	},
});
