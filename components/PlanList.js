import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import PlanRow from "./PlanRow";

const PlanList = () => {
	const { user, theme } = useAuth();
	const [plans, setPlans] = useState([]);
	const [tEST, setTEST] = useState([]);
	const [plan, setPlan] = useState("");
	const [editing, setEditing] = useState(false);
	const [infoOn, setInfoOn] = useState(false);

	//FETCH:: FireBase LIVE-LISTENER GET to Plans collection
	useEffect(() => {
		firestore()
			.collection("Plans")
			.where("userId", "==", user.uid)
			// .orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				setPlans(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});
	}, [user]);

	//ADD: FireBase ADD a plan to Plans collection
	async function createUserPlan() {
		firestore()
			.collection("Plans")
			.add({
				userId: user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				plan: plan,
			})
			.then(() => {
				setEditing(false);
				setPlan("");
				console.log("Plan Saved!");
			});
	}
	// console.log(tEST.length) 0 = falsy
	return (
		<KeyboardAvoidingView
			style={[
				styles.chatListContainer,
				theme === "dark" ? styles.darkModeChatListContainer : null,
			]}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
			</TouchableWithoutFeedback>

			{/* INFO section */}
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
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							// paddingTop: 20,
						}}
					>
						<Text
							style={[
								styles.challengeTitle,
								theme === "dark" ? styles.challengeTitleDarkMode : null,
							]}
						>
							Tips: What is a plan?
						</Text>
						<Text
							style={[
								styles.challengeText,
								theme === "dark" ? styles.challengeTextDarkMode : null,
							]}
						>
							• A Plan is a strategy to acheive your goal.
							{"\n"}
							{"\n"}• Try to write 20 plans. The 20th plan may hold the secret
							to your success.{"\n"}
							{"\n"}• Start simple, then keep thinking of more and more plans.
							Use your creativity to create new plans.
						</Text>
					</View>
				</TouchableOpacity>
			) : null}

			{/* Input for writing a new Plan */}
			{editing ? (
				<View
					style={[
						styles.sectionContainer,
						styles.cardShadow,
						theme === "dark" ? styles.sectionContainerDarkMode : null,
					]}
				>
					<Text style={{ fontSize: 16 }}>Write Your Plan!</Text>
					<TextInput
						multiline={true}
						numberOfLines={5}
						style={styles.input}
						placeholder="Write your plan here..."
						onChangeText={setPlan}
						value={plan}
						editable={editing}
					/>
					{plan && plan.length < 5 ? (
						<Text
							style={[
								styles.planRequirementsText,
								theme === "dark" ? styles.planRequirementsTextDarkMode : null,
							]}
						>
							Plan must be at least 5 characters
						</Text>
					) : null}
					<View style={{ display: "flex", flexDirection: "row" }}>
						<TouchableOpacity
							onPress={() => {
								createUserPlan();
							}}
							disabled={!editing || plan.length < 5}
							style={styles.saveButton}
						>
							<Text style={styles.buttonText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setPlan("");
								setEditing(false);
							}}
							style={styles.cancelButton}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : null}
			{/* Flatlist for User's Plans */}
			{plans.length > 0 || (plan && !editing) ? (
				<FlatList
					data={plans}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <PlanRow plan={item} />}
					// ListFooterComponent={() => {
					// 	plans.length ? null : <ActivityIndicator style={{ padding: 8 }} />;
					// }}
				/>
			) : (
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View onPress={Keyboard.dismiss} style={styles.noPlanContainer}>
						<Text
							style={[
								styles.noPlanText,
								theme === "dark" ? styles.noPlanTextDarkMode : null,
							]}
						>
							Add your first Plan...
						</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
			<TouchableOpacity
				onPress={() => setEditing(true)}
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
		</KeyboardAvoidingView>
	);
};

export default PlanList;

const styles = StyleSheet.create({
	chatListContainer: {
		// height: "91%",
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
		backgroundColor: "#222133",
	},
	xIcon: {
		position: "absolute",
		right: 5,
	},
	challengeTitle: {
		fontFamily: "PhiloBold",
		fontSize: 20,
		paddingTop: 20,
	},
	challengeTitleDarkMode: {
		color: "white",
	},
	challengeText: {
		fontSize: 17,
		lineHeight: 20,
		padding: 15,
		paddingRight: 25,
		textAlign: "justify",
	},
	challengeTextDarkMode: {
		color: "white",
	},
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
	planRequirementsText: {
		paddingBottom: 5,
	},
	planRequirementsTextDarkMode: {},
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
