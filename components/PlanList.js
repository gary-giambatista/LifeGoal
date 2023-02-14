import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import PlanRow from "./PlanRow";

const PlanList = () => {
	const { user, theme } = useAuth();
	const [plans, setPlans] = useState([]);
	const [plan, setPlan] = useState("");
	const [editing, setEditing] = useState(false);
	const [infoOn, setInfoOn] = useState(false);

	//FETCH:: FireBase LIVE-LISTENER GET to Plans collection
	// useEffect(() => {
	// 	firestore()
	// 		.collection("Plans")
	// 		.where("userId", "==", user.uid)
	// 		.orderBy("createdAt", "desc")
	// 		.onSnapshot((snapshot) => {
	// 			setPlans(
	// 				snapshot.docs.map((doc) => ({
	// 					id: doc.id,
	// 					...doc.data(),
	// 				}))
	// 			);
	// 		});
	// }, [user]);

	return (
		<View style={styles.chatListContainer}>
			{/* Header for "My Plans" screen */}
			<View
				style={[
					styles.HeaderContainer,
					styles.cardShadow,
					theme === "dark" ? styles.darkModeBG : null,
				]}
			>
				<Octicons
					onPress={() => setInfoOn((prevInfoOn) => !prevInfoOn)}
					name="info"
					size={24}
					color={theme === "dark" ? "#8A86CF" : "#222F42"}
				/>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.pageTitleDarkMode : null,
					]}
				>
					My Plans
				</Text>
				<AntDesign
					onPress={() => setEditing(true)}
					name="plus"
					size={24}
					color={theme === "dark" ? "#8A86CF" : "#222F42"}
				/>
			</View>
			{infoOn ? (
				<TouchableOpacity
					onPress={() => setInfoOn((prevInfoOn) => !prevInfoOn)}
					style={[
						styles.challengeContainer,
						styles.cardShadow,
						theme === "dark" ? styles.challengeContainerDarkMode : null,
					]}
				>
					<Ionicons
						style={styles.xIcon}
						name="ios-close-outline"
						size={24}
						color={theme === "dark" ? "#8A86CF" : "#222F42"}
					/>
					<Text
						style={[
							styles.challengeText,
							theme === "dark" ? styles.challengeTextDarkMode : null,
						]}
					>
						Tips: What is a plan? {"\n"}• A Plan is a strategy to acheive your
						goal.
						{"\n"}• Try to write 20 plans. The 20th plan may hold the secret to
						your success.
					</Text>
				</TouchableOpacity>
			) : null}
			{/* Flatlist for User's Plans */}
			{plans.length > 0 ? (
				<PlanRow />
			) : (
				<View style={styles.noPlanContainer}>
					<Text
						style={[
							styles.noPlanText,
							theme === "dark" ? styles.noPlanTextDarkMode : null,
						]}
					>
						Add your first Plan...
					</Text>
				</View>
			)}
			<TouchableOpacity
				style={[
					styles.addPlanButtonContainer,
					styles.cardShadow,
					theme === "dark" ? styles.addPlanButtonContainerDarkMode : null,
				]}
			>
				<Text
					style={[
						styles.addPlanButtonText,
						theme === "dark" ? styles.addPlanButtonTextDarkMode : null,
					]}
				>
					Add a Plan
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PlanList;

const styles = StyleSheet.create({
	chatListContainer: {
		height: "91%",
		overflow: "scroll",
	},
	darkModeChatListContainer: {
		backgroundColor: "#2C2B42",
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
		justifyContent: "space-between", //space-between
		alignItems: "baseline",
		backgroundColor: "white",
		paddingBottom: 5,
		// borderBottomWidth: 1,
		// borderBottomColor: "#8899A6",
	},
	darkModeBG: {
		backgroundColor: "#222133",
	},
	pageTitle: {
		fontFamily: "PhiloBold",
		fontSize: 32,
		color: "#222F42",
		letterSpacing: 1,
	},
	pageTitleDarkMode: {
		color: "white",
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
	challengeContainer: {
		position: "relative",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		margin: 10,
		borderRadius: 10,
	},
	challengeContainerDarkMode: {
		backgroundColor: "#2C2B42",
	},
	xIcon: {
		position: "absolute",
		right: 3,
	},
	challengeText: {
		fontSize: 17,
		lineHeight: 25,
		padding: 15,
		paddingRight: 20,
	},
	challengeTextDarkMode: {
		color: "white",
	},
	noPlanContainer: {
		display: "flex",
		flexDirection: "row",
		margin: 10,
		padding: 5,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	noPlanText: {
		fontSize: 16,
	},
	noPlanTextDarkMode: {},
	addPlanButtonContainer: {
		margin: 10,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 48,
		backgroundColor: "white",
		borderRadius: 10,
		borderBottomColor: "#658AC2",
		borderBottomWidth: 7,
	},
	addPlanButtonContainerDarkMode: {
		backgroundColor: "#5F5D8F",
		borderBottomColor: "#8A86CF",
		borderBottomWidth: 7,
		borderRadius: 8,
	},
	addPlanButtonText: {
		fontSize: 17,
		padding: 8,
	},
	addPlanButtonTextDarkMode: {},
});
