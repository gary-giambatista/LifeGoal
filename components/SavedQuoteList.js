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
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import SavedQuoteRow from "./SavedQuoteRow";
import UserCreatedQuoteList from "./UserCreatedQuoteList";

const SavedQuoteList = () => {
	const { user, theme } = useAuth();
	const [quotes, setQuotes] = useState([]);
	const [editing, setEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// FETCH: db listener for SAVED QUOTES
	useEffect(() => {
		setIsLoading(true);
		firestore()
			.collection("Quotes")
			.where("userId", "==", user.uid)
			.orderBy("createdAt", "desc") // test
			.onSnapshot((snapshot) => {
				setQuotes(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});
	}, [user]);

	useEffect(() => {
		isLoading ? setIsLoading(false) : console.log("NOT LOADING");
	}, [quotes]);

	// console.log(isLoading);

	return (
		<ScrollView
			style={[
				styles.userMadeQuotesContainer,
				theme === "dark" ? styles.userMadeQuotesContainerDarkMode : null,
			]}
		>
			{/* Header for "Saved Quotes" screen */}
			<View
				style={[
					styles.HeaderContainer,
					styles.cardShadow,
					theme === "dark" ? styles.darkModeBG : null,
				]}
			>
				{/* Empty view for flex-space between 33% | 33% | 33% */}
				<View></View>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.darkModeTitle : null,
					]}
				>
					Saved Quotes
				</Text>
				<AntDesign
					onPress={() => setEditing(true)}
					name="plus"
					size={24}
					color={theme === "dark" ? "#8A86CF" : "#222F42"}
				/>
			</View>

			{/* USER CREATED QUOTES section */}
			<UserCreatedQuoteList editing={editing} setEditing={setEditing} />

			{/* SAVED QUOTES Section */}
			{isLoading ? <ActivityIndicator style={{ padding: 8 }} /> : null}

			{/* IF quotes & not loading map them out */}
			{quotes.length > 0 && !isLoading ? (
				<FlatList
					style={[
						styles.chatListContainer,
						theme === "dark" ? styles.darkModeChatListContainer : null,
					]}
					data={quotes}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <SavedQuoteRow quote={item} />}
				/>
			) : // NESTED TERNARY: if no quotes && if loading
			// don't show the "no saved quotes yet" msg
			isLoading ? null : (
				<View
					style={[
						styles.noMatchContainer,
						theme === "dark" ? styles.noMatchContainerDarkMode : null,
					]}
				>
					<Text
						style={[
							styles.noMatchText,
							theme === "dark" ? styles.noMatchTextDarkMode : null,
						]}
					>
						You have no saved quotes yet.
					</Text>
				</View>
			)}
		</ScrollView>
	);
};

export default SavedQuoteList;

const styles = StyleSheet.create({
	userMadeQuotesContainer: {
		height: "100%", // TOOK WHOLE SCREEN
	},
	userMadeQuotesContainerDarkMode: {
		backgroundColor: "#2C2B42",
	},
	chatListContainer: {
		// height: "100%",
		// height: "89%",
		// overflow: "scroll",
	},
	darkModeChatListContainer: {
		backgroundColor: "#2C2B42",
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
		backgroundColor: "#222133",
	},
	darkModeTitle: {
		color: "white",
	},
	pageTitle: {
		paddingLeft: 26,
		fontFamily: "PhiloBold",
		fontSize: 32,
		color: "#222F42",
		letterSpacing: 1,
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
	noMatchContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		// height: "100%",
	},
	noMatchContainerDarkMode: {},
	noMatchText: {
		fontFamily: "PhiloBold",
		fontSize: 19,
		paddingTop: 15,
		padding: 10,
	},
	noMatchTextDarkMode: {
		color: "white",
	},
	// endBlock: {
	// 	backgroundColor: "black",
	// },
	// endBlockDarkMode: {
	// 	backgroundColor: "#2C2B42",
	// },
});
