import { SimpleLineIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Button,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import GoalFeedRow from "./GoalFeedRow";

const GoalFeedList = () => {
	const { user, theme } = useAuth();
	const [goals, setGoals] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	//fetching goals KEYS
	//Sort by: != user.uid && isPublic == true
	//orderBy: createdAt descending
	//handle Flatlist lazy loading >> call the function to fetch more?

	async function getGoals() {
		try {
			setIsLoading(true);
			const snapshot = await firestore()
				.collection("Goals")
				.where("isPublic", "==", true)
				// .where("userId", "!=", user.uid)
				.orderBy("createdAt", "desc")
				.get();
			const goals = snapshot.docs.map((doc) => doc.data());
			//insert SORT function here to remove user's own quote
			setIsLoading(false);
			return setGoals(goals);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	}
	useEffect(() => {
		getGoals();
	}, []);

	//Fetch Goals live event listener
	// useEffect(() => {
	// 	firestore()
	// 		.collection("Goals")
	// 		.where("isPublic", "==", true)
	// 		.where("userId", "==", user.uid)
	// 		// .orderBy("createdAt", "desc")
	// 		.onSnapshot((snapshot) => {
	// 			setGoals(
	// 				snapshot.docs.map((doc) => ({
	// 					id: doc.id,
	// 					...doc.data(),
	// 				}))
	// 			);
	// 		});
	// }, [user]);
	console.log(goals);
	return (
		<View>
			{/* Header for "Goal Feed" screen */}
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
					Goal Feed
				</Text>
				<TouchableOpacity
					onPress={getGoals}
					style={styles.refreshIconContainer}
				>
					<SimpleLineIcons name="refresh" size={24} color="#222F42" />
				</TouchableOpacity>
			</View>
			{isLoading ? <ActivityIndicator /> : null}
			{/* Map out the Quote's using a <SavedQuoteRow component */}
			<FlatList
				style={[
					styles.chatListContainer,
					theme === "dark" ? styles.darkModeChatListContainer : null,
				]}
				data={goals}
				keyExtractor={(item) => item.userId}
				renderItem={({ item }) => <GoalFeedRow goal={item} />}
			/>
		</View>
	);
};

export default GoalFeedList;

//Concerns > lazy loading and handling limits for quotes. Also scroll view, will it work from the Flatlist

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
		justifyContent: "space-between",
		alignItems: "baseline",
		backgroundColor: "white",
		marginBottom: 5,
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
		color: "#222F42",
	},
	refreshIconContainer: {
		// marginLeft: "auto",
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
