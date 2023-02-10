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
	const [currentGoals, setCurrentGoals] = useState(0);
	const [isLastGoal, setIsLastGoal] = useState(false);

	//fetching goals IMPORTANT CONSTRAINTS
	//Sort by: != user.uid && isPublic == true
	//orderBy: createdAt descending
	//handle Flatlist lazy loading >> call the function to fetch more?

	async function getGoals() {
		try {
			const snapshot = await firestore()
				.collection("Goals")
				.where("isPublic", "==", true)
				// .where("userId", "!=", user.uid)**
				.orderBy("createdAt", "desc")
				.limit(10)
				.get();
			setCurrentGoals(10);
			if (isLastGoal === true) {
				setIsLastGoal(false);
			}
			const goals = snapshot.docs.map((doc) => doc.data());
			//insert SORT function here to remove user's own quote**
			return setGoals(goals);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	}
	useEffect(() => {
		getGoals();
	}, []);

	async function getMoreGoals() {
		// console.log("More goals triggered");
		try {
			//fetch 10 more goals
			const snapshot = await firestore()
				.collection("Goals")
				.where("isPublic", "==", true)
				// .where("userId", "!=", user.uid)**
				.orderBy("createdAt", "desc")
				.startAfter(currentGoals)
				.limit(10)
				.get();
			if (!isLastGoal) {
				setCurrentGoals((prevGoals) => prevGoals + 10); // increment goals by 10
				const tempGoals = snapshot.docs.map((doc) => doc.data());
				//insert SORT function here to remove user's own quote**
				tempGoals.length === 0 ? setIsLastGoal(true) : null; // if query is empty, setIsLastGoal = true
				return setGoals([...goals, ...tempGoals]); //combine the new query with existing quer in state
			}
		} catch (error) {
			console.error(error);
		}
	}

	//TODO: Possible problems:
	// 1. NEED to use setLastVisibleGoal .property or remove .data()
	// 2. Spread Operator [..., ...] into array
	// 3. Check parameter lastVisibleGoal is being updated correctly

	// console.log("current goals", currentGoals);
	// console.log("is last goal", isLastGoal);

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
	// console.log(goals);
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

			{/* Map out the Quote's using a <SavedQuoteRow component */}
			<FlatList
				style={[
					styles.chatListContainer,
					theme === "dark" ? styles.darkModeChatListContainer : null,
				]}
				data={goals}
				keyExtractor={(item) => item.userId}
				renderItem={({ item }) => <GoalFeedRow goal={item} />}
				onEndReached={getMoreGoals}
				onEndReachedThreshold={0.01}
				scrollEventThrottle={500}
				ListFooterComponent={() =>
					isLastGoal ? (
						<Text style={styles.noMoreGoalsText}>
							Sorry! There are no more goals.{" "}
						</Text>
					) : (
						<ActivityIndicator />
					)
				}
			/>
		</View>
	);
};

export default GoalFeedList;

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
	noMoreGoalsText: {
		fontSize: 15,
		textAlign: "center",
		padding: 8,
	},
});
