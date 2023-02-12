import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
	Button,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const GoalHelpModal = () => {
	const navigation = useNavigation();
	const { user, theme } = useAuth();
	const [tips, setTips] = useState(tipData);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#2C2B42" }}>
			{/* Header for "Goal Feed" screen */}
			<View
				style={[
					styles.HeaderContainer,
					styles.cardShadow,
					theme === "dark" ? styles.darkModeBG : null,
				]}
			>
				<TouchableOpacity
					onPress={() => navigation.navigate("Goal Screen")}
					style={styles.refreshIconContainer}
				>
					<AntDesign
						name="back"
						size={24}
						color={theme === "dark" ? "#8A86CF" : "#222F42"}
					/>
				</TouchableOpacity>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.darkModeTitle : null,
					]}
				>
					Goal Tips
				</Text>
				{/* Empty view for flex-space between 33% | 33% | 33% */}
				<View></View>
			</View>
			<View>
				{tips.map((tip) => {
					return (
						<View
							key={tip.id}
							style={[
								styles.tipRowContainer,
								styles.cardShadow,
								theme === "dark" ? styles.tipRowContainerDarkMode : null,
							]}
						>
							<MaterialCommunityIcons
								name="chevron-double-right"
								size={24}
								color={theme === "dark" ? "#222133" : "#658AC2"}
								style={styles.chevron}
							/>
							<Text style={styles.tips}>{tip.tip}</Text>
						</View>
					);
				})}
			</View>
		</SafeAreaView>
	);
};

export default GoalHelpModal;

const tipData = [
	{
		id: 1,
		tip: "Make a specific goal, a goal that is obtainable within the next 30 days.",
	},
	{
		id: 2,
		tip: 'Having a vague goal like, "Talk to my family more." is not a good goal.',
	},
	{
		id: 3,
		tip: 'Instead your goal should be highly specific, for example, "Call my parents every Saturday and ask them about current events in their lives."',
	},
	{
		id: 4,
		tip: "Your goal should be something that will have a significantly positive effect on your life.",
	},
	{
		id: 5,
		tip: "Make a list of your goals, and try to pick the 1 goal which you believe will have the biggest impact on your life.",
	},
];
const styles = StyleSheet.create({
	chatListContainer: {
		height: "89%",
		overflow: "scroll",
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
		backgroundColor: "#222133",
	},
	pageTitle: {
		fontFamily: "PhiloBold",
		fontSize: 32,
		color: "#222F42",
		letterSpacing: 1,
		marginRight: 20,
	},
	darkModeTitle: {
		color: "white",
	},
	refreshIconContainer: {
		// marginLeft: "auto",
	},

	// tipsContainer: {
	// 	display: "flex",
	// 	marginLeft: 10,
	// 	marginRight: 10,
	// 	padding: 5,
	// 	paddingTop: 10,
	// 	paddingBottom: 25,
	// 	backgroundColor: "white",
	// 	borderRadius: 10,
	// },
	tipRowContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: "white",
		borderRadius: 10,
		borderBottomWidth: 7,
		borderBottomColor: "#A7B6CC",
	},
	tipRowContainerDarkMode: {
		backgroundColor: "#5F5D8F",

		borderRadius: 8,
		borderBottomColor: "#8A86CF",
	},
	chevron: {
		paddingLeft: 15,
	},
	tips: {
		// backgroundColor: "grey",
		maxWidth: "90%",
		// marginRight: "auto",
		fontSize: 17,
		lineHeight: 22,
		padding: 15,
		paddingRight: 20,
		textAlign: "justify",
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
