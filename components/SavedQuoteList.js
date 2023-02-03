import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	SectionList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import SavedQuoteRow from "./SavedQuoteRow";
import UserCreatedQuoteList from "./UserCreatedQuoteList";

const SavedQuoteList = () => {
	//fetch user's Saved quotes
	const { user, theme } = useAuth();
	const [quotes, setQuotes] = useState([]);
	const [editing, setEditing] = useState(false);

	// FETCH: db listener for SAVED QUOTES
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

	//TODO: sort quotes by createdAt: {nanoseconds: , seconds:} Unix time format
	// **Setting the Quote order to be descending in order by createdAt date
	//nanoseconds/seconds
	//quotes[i].createdAt
	// console.log(quotes[0].createdAt);
	// const newQuotes = quotes.sort((a, b) => {
	// 	console.log(b.createdAt.seconds);
	// 	b.createdAt.seconds - a.createdAt.seconds;
	// });
	// console.log(newQuotes);

	//TODO Add delete function
	//SEPARATE add a function to delete quotes and pass to SavedQuoteRow(use id: doc.id to reference correct quote to delete )

	//ADDING User made quotes
	//DO in UserCreated Quotes?
	// fetch user's quotes
	// create a user quote

	console.log(editing);
	return (
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
				<View></View>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.darkModeTitle : null,
					]}
				>
					Saved Quotes
				</Text>
				{!editing ? (
					<AntDesign
						onPress={() => setEditing((prevEditing) => !prevEditing)}
						name="plus"
						size={24}
						color="#222F42"
					/>
				) : (
					<AntDesign
						onPress={() => setEditing((prevEditing) => !prevEditing)}
						name="check"
						size={24}
						color="#222F42"
					/>
				)}
			</View>
			{/* USER CREATED QUOTES section */}
			<UserCreatedQuoteList editing={editing} setEditing={setEditing} />
			{/* SAVED QUOTES Section 
			Map out the Quote's using a <SavedQuoteRow component IF quotes exist*/}
			{quotes.length > 0 ? (
				<FlatList
					style={[
						styles.chatListContainer,
						theme === "dark" ? styles.darkModeChatListContainer : null,
					]}
					data={quotes}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <SavedQuoteRow quote={item} />}
				/>
			) : (
				<Text style={styles.noMatchText}>You have no saved quotes yet.</Text>
			)}
		</View>
	);
};

export default SavedQuoteList;

const styles = StyleSheet.create({
	chatListContainer: {
		// height: "89%",
		height: "100%",
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
		justifyContent: "space-between",
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
		paddingLeft: 28,
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
