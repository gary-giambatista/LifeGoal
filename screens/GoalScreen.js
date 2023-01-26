import { useNavigation, useRoute } from "@react-navigation/native";
import {
	default as React,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Alert,
	Button,
	Image,
	KeyboardAvoidingView,
	Modal,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const GoalScreen = () => {
	const navigation = useNavigation();
	const { logOut, loading, user, theme } = useAuth();

	const [goal, setGoal] = useState("");
	const [editing, setEditing] = useState(false);
	const inputRef = useRef();
	const [isPublic, setIsPublic] = useState(false);

	function editGoal() {
		setEditing(true);
		setTimeout(setFocus, 50);
		// inputRef.current.focus();
		// setEditing(true);
	}
	//helper function bc setTimeout required
	function setFocus() {
		inputRef.current.focus();
	}
	function saveGoal() {
		//db call to update goal
		setEditing(false);
	}

	//alert for setting goal to public
	const togglePublicOnAlert = () =>
		Alert.alert("Are you sure?", "Why share? Help give others inspiration!", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{ text: "SHARE", onPress: () => setGoalPublicOrPrivate() },
		]);
	const togglePublicOffAlert = () =>
		Alert.alert(
			"Are you sure?",
			"Selecting HIDE will remove your goal from public view.",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "HIDE", onPress: () => setGoalPublicOrPrivate() },
			]
		);

	function setGoalPublicOrPrivate() {
		setIsPublic((prevPublicState) => !prevPublicState);
		//db function to update public status
	}
	console.log(isPublic);
	return (
		<ScrollView style={{ flex: 1 }}>
			<View
				style={[
					styles.HeaderContainer,
					styles.cardShadow,
					theme === "dark" ? styles.darkModeBG : null,
				]}
			>
				<TouchableOpacity>
					<Image
						style={styles.logo}
						source={require("../assets/TreeLogo.png")}
					/>
				</TouchableOpacity>
				<Text
					style={[
						styles.pageTitle,
						theme === "dark" ? styles.darkModeTitle : null,
					]}
				>
					My Goal
				</Text>
				<TouchableOpacity onPress={logOut}>
					<Image style={styles.profilePic} source={{ uri: user.photoURL }} />
				</TouchableOpacity>
			</View>
			<Text style={styles.callToAction}>
				Plant this Goal in your mind,{"\n"} and water it with attention
			</Text>

			<KeyboardAvoidingView style={{ flex: 1 }}>
				{goal.length === 0 || editing ? (
					<Text style={styles.placeholderText}>
						Describe your goal, your dream, the ideal world you are striving to
						create and live in. It is something that you can always strive for,
						no matter where you are in your life...
					</Text>
				) : null}
				{editing ? (
					<TextInput
						ref={inputRef}
						multiline={true}
						numberOfLines={5}
						style={styles.input}
						placeholder="Write your goal here..."
						onChangeText={setGoal}
						value={goal}
						editable={editing}
					/>
				) : (
					<Text style={styles.goalText}>{goal}</Text>
				)}
				<View style={styles.switchContainer}>
					<Text style={styles.switchText}>Share your goal anonymously</Text>
					{isPublic ? (
						<Switch
							style={styles.switchSwitch}
							value={isPublic}
							onValueChange={togglePublicOffAlert}
						/>
					) : (
						<Switch
							style={styles.switchSwitch}
							value={isPublic}
							onValueChange={togglePublicOnAlert}
						/>
					)}
				</View>
				<Button
					onPress={editing ? saveGoal : editGoal}
					title={editing ? "Save Goal" : "Edit Goal"}
				></Button>
				<Button
					onPress={() => navigation.navigate("Quote Modal")}
					title=" Feeling down? View a Quote"
				></Button>
			</KeyboardAvoidingView>
		</ScrollView>
	);
};

export default GoalScreen;

const styles = StyleSheet.create({
	profilePic: {
		height: 40,
		width: 40,
		borderRadius: 9999,
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
		marginBottom: 3,
		paddingBottom: 3,
		// borderBottomWidth: 1,
		// borderBottomColor: "#8899A6",
	},
	darkModeBG: {
		backgroundColor: "#0E1A28",
	},
	logo: {
		height: 40,
		width: 40,
		//#6acdf4
	},
	pageTitleContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#8899A6",
	},
	pageTitle: {
		fontFamily: "quicksand-semi",
		fontSize: 30,
	},
	darkModeTitle: {
		// color: "#8899A6",
		color: "#B0B3B8",
		// color: "#4C5F75",
		// color: "#447FC2",
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
	callToAction: {
		fontSize: 18,
		textAlign: "center",
		padding: 8,
	},
	placeholderText: {
		fontSize: 18,
		textAlign: "center",
		padding: 8,
	},
	goalText: {
		fontSize: 18,
		textAlign: "center",
		padding: 8,
	},
	input: {
		textAlignVertical: "top",
		padding: 10,
		paddingTop: 10,
		marginBottom: 10,
		marginTop: 10,
		flexDirection: "row",
		height: 100,
		fontSize: 14,
		borderColor: "#BFBFBF",
		borderWidth: 1,
		borderRadius: 6,
		marginRight: 10,
		marginLeft: 10,
	},
});
