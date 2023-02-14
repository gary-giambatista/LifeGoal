import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import {
	default as React,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	ActivityIndicator,
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
import GoalHelpModal from "./GoalHelpModal";

// Initialize Notifications Handler
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const GoalScreen = () => {
	//hooks
	const navigation = useNavigation();
	const { logOut, user, theme } = useAuth();
	//state
	const [goal, setGoal] = useState("");
	const [editing, setEditing] = useState(false);
	const inputRef = useRef();
	const [isPublic, setIsPublic] = useState(false);
	const [quote, setQuote] = useState("");
	const [quoteAuthor, setQuoteAuthor] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [notification, setNotification] = useState(null);

	function editGoal() {
		setEditing(true);
		setTimeout(setFocus, 50);
	}
	//helper function bc setTimeout required
	function setFocus() {
		inputRef.current.focus();
	}
	//Update or add a goal function
	async function saveGoal() {
		//db call to update goal
		firestore()
			.collection("Goals")
			.doc(`${user.uid}`)
			.set({
				userId: user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				// lastEdited: firestore.FieldValue.serverTimestamp(),
				isPublic: isPublic,
				goal: goal,
				// timer: 4, 6, 8,
			})
			.then(() => {
				console.log("Goal Updated!");
			});
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
	//function to change isPublic state in DB / local state. NEED to update db !state first then change state locally, bc state syncing issue
	async function setGoalPublicOrPrivate() {
		firestore()
			.collection("Goals")
			.doc(`${user.uid}`)
			.update({
				isPublic: !isPublic,
			})
			.then(() => {
				console.log(`isPublic Updated!: ${!isPublic}`);
			});

		setIsPublic((prevPublicState) => !prevPublicState);
	}
	useEffect(() => {
		async function fetchUserData() {
			const data = await firestore()
				.collection("Goals")
				.doc(`${user.uid}`)
				.get();
			// console.log("user data: ", data.data().goal);
			if (data.data().goal) {
				setGoal(data.data().goal);
				setIsPublic(data.data().isPublic);
			}
		}
		fetchUserData();
	}, []);

	async function fetchQuote() {
		setIsFetching(true);
		try {
			const response = await fetch("https://zenquotes.io/api/random");
			// console.log("Response: ", response);

			const data = await response.json();
			// console.log("Data: ", data[0].a);
			setQuote(data[0].q);
			setQuoteAuthor(data[0].a);
		} catch (error) {
			console.log(error);
		}
		setIsFetching(false);
	}

	async function saveQuote() {
		firestore()
			.collection("Quotes")
			// .doc(`${user.uid}`)
			.add({
				userId: user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				quote: quote,
				quoteAuthor: quoteAuthor,
			})
			.then(() => {
				console.log("Quote Saved!");
			});
	}
	//Jonathan's consultation
	//write in user created quotes
	//Make user created quotes shareable
	//add a screen for viewing user created quotes
	async function clearNotifications() {
		const notificationId =
			await Notifications.getAllScheduledNotificationsAsync();
		console.log(notificationId);
		// Notifications.dismissAllNotificationsAsync();
	}

	// CREATE NOTIFICATION FUNCTION
	async function createNotification() {
		const notifications = await Notifications.scheduleNotificationAsync({
			content: {
				title: "Remember to check your goal",
				body: "Don't forget what you are working towards!",
			},
			trigger: {
				seconds: 15,
				// repeats: true,
			},
		});
		console.log(`3. notification ${notifications} set for 15 seconds`);
		//can save notifications in state if need access to the notification ID
	}
	// CHECKING NOTIFICATIONS Step 0
	// console.log("0. NOTIFICATION STATE: ", notification);

	//CHECK IF NOTIFICATION EXISTS - only ON initial APP START
	useEffect(() => {
		const isScheduledNotification = async () => {
			try {
				await Notifications.getAllScheduledNotificationsAsync().then(
					(result) => {
						// console.log("1. RESULT: ", result, result.length);
						result.length === 0
							? setNotification(false)
							: setNotification(true);
					}
				);
			} catch (error) {
				console.log(error);
			}
		};
		isScheduledNotification();
	}, []);

	//CREATE or DON'T CREATE Notification
	useEffect(() => {
		if (notification === false) {
			// console.log("2. NEW NOTIFICATION TRIGGERED");
			createNotification();
		} else console.log("2. NEW NOTIFICATION NOT TRIGGERED");
	}, [notification]);

	//**To Update Notification */
	//0. IF cancel all works, and doesn't cancel other apps notifcations use that
	//1. fetch existing notificationID
	//2. clear that notification
	//3. then create new notification createNotification(seconds)

	// console.log("Global isPublic: ", isPublic);
	// console.log("Quote: ", quote);

	return (
		<ScrollView
			style={[styles.screenBG, theme === "dark" ? styles.screenBGDark : null]}
		>
			{/* My Goal - Header Section */}
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
			<TouchableOpacity
				onPress={() => navigation.navigate("Goal Help Modal")}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					paddingTop: 1,
					paddingBottom: 6,
				}}
			>
				<Text
					style={[
						styles.helpText,
						theme === "dark" ? styles.helpTextDarkMode : null,
					]}
				>
					Need Help? Learn how to Write a good goal
				</Text>
			</TouchableOpacity>
			{/* <View style={[styles.CtaContainer, styles.cardShadow]}>
				<Text style={styles.callToAction}>
					Plant this Goal in your mind,{"\n"} and water it with attention
				</Text>
			</View> */}
			{/* Goal Card Section */}
			<KeyboardAvoidingView style={{ flex: 1 }}>
				{/* PlaceHolder Goal or user's Goal if they have one and not editing */}
				{goal.length === 0 || editing ? (
					<View
						style={[
							styles.placeholderContainer,
							styles.cardShadow,
							theme === "dark" ? styles.placeholderContainerDarkMode : null,
						]}
					>
						<Text style={styles.placeholderText}>
							Describe your goal here, your dream, the ideal world you are
							striving to create and live in. It is something that you can
							always strive for, no matter where you are in your life...
						</Text>
					</View>
				) : (
					<View
						style={[
							styles.goalContainer,
							styles.cardShadow,
							theme === "dark" ? styles.goalContainerDarkMode : null,
						]}
					>
						<Text style={styles.goalText}>{goal}</Text>
					</View>
				)}
				{/* Show inputbox to update goal while editing is true */}
				{editing ? (
					<TextInput
						ref={inputRef}
						multiline={true}
						numberOfLines={5}
						style={[
							styles.input,
							theme === "dark" ? styles.inputDarkMode : null,
						]}
						placeholder="Write your goal here..."
						placeholderTextColor="grey"
						onChangeText={setGoal}
						value={goal}
						editable={editing}
					/>
				) : null}
				<View style={styles.switchContainer}>
					<TouchableOpacity
						style={[
							styles.editButton,
							editing ? styles.editingNow : null,
							theme === "dark" ? styles.darkButton : null,
							editing && theme === "dark" ? styles.editingDarkMode : null,
						]}
						onPress={editing ? saveGoal : editGoal}
					>
						<Text style={styles.editButtonText}>
							{editing ? "Save Goal" : "Edit Goal"}{" "}
						</Text>
					</TouchableOpacity>
					<Text
						style={[
							styles.switchText,
							theme === "dark" ? styles.switchTextDarkMode : null,
						]}
					>
						Share your goal anonymously...{" "}
					</Text>
					{/* changes Which switch is shown. isPublic state issue required 2 Switches instead of a conditional for onValueChange/Value */}
					{isPublic ? (
						<Switch
							disabled={editing}
							style={styles.switchSwitch}
							value={isPublic}
							onValueChange={togglePublicOffAlert}
						/>
					) : (
						<Switch
							disabled={editing}
							style={styles.switchSwitch}
							value={isPublic}
							onValueChange={togglePublicOnAlert}
						/>
					)}
				</View>
				{/* Quote section */}
				{isFetching ? <ActivityIndicator /> : null}
				{quote ? (
					<View
						style={[
							styles.quoteContainer,
							styles.cardShadow,
							theme === "dark" ? styles.quoteContainerDarkMode : null,
						]}
					>
						<Text style={styles.quoteText}> "{quote}" </Text>
						<Text style={styles.quoteAuthor}> - {quoteAuthor} </Text>
					</View>
				) : null}
				<View style={[styles.quoteButtonContainer, styles.cardShadow]}>
					{quote ? (
						<TouchableOpacity
							// onPress={() => navigation.navigate("Quote Modal")}
							onPress={saveQuote}
							style={[
								styles.quoteButton,
								styles.cardShadow,
								quote ? styles.quoteButtonSplit : null,
								theme === "dark" ? styles.quoteButtonDarkMode : null,
							]}
						>
							<Text style={styles.quoteButtonText}>Save Quote</Text>
							<Ionicons
								name="md-bookmarks"
								size={22}
								color={theme === "dark" ? "#222133" : "#222F42"}
							/>
						</TouchableOpacity>
					) : null}
					<TouchableOpacity
						// onPress={() => navigation.navigate("Quote Modal")}
						// put DB function to call Zen quotes here
						// onPress={() => setQuote((prevQuote) => !prevQuote)}
						onPress={fetchQuote}
						style={[
							styles.quoteButton,
							styles.cardShadow,
							quote ? styles.quoteButtonSplit : null,
							theme === "dark" ? styles.quoteButtonDarkMode : null,
						]}
					>
						<Text style={styles.quoteButtonText}>
							{quote ? "View another" : "Feeling unmotivated? Touch here"}
						</Text>
						<MaterialIcons
							name="touch-app"
							size={24}
							color={theme === "dark" ? "#222133" : "#222F42"}
						/>
					</TouchableOpacity>
				</View>
				{/* <Button
					onPress={() => navigation.navigate("Quote Modal")}
					title=" Feeling down? View a Quote"
				></Button> */}
			</KeyboardAvoidingView>
			{/* <Button title="Check Notifications" onPress={clearNotifications}></Button>
			<Button
				title="Schedule Notifications"
				onPress={createNotification}
			></Button> */}
		</ScrollView>
	);
};

export default GoalScreen;

const styles = StyleSheet.create({
	screenBG: {
		flex: 1,
	},
	screenBGDark: {
		// backgroundColor: "#3C3B4F", L c1
		// backgroundColor: "#2C2B42", C2
		backgroundColor: "#2C2B42", //#35334F Body color
	},
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
		marginBottom: 10,
		paddingBottom: 5,
		// borderBottomWidth: 1,
		// borderBottomColor: "#8899A6",
	},
	darkModeBG: {
		//base #6D6B8F
		// backgroundColor: "#2C2B42", D
		// backgroundColor: "#3C3B4F", L
		//base
		// backgroundColor: "#181824", dark
		// backgroundColor: "#1d1d2b", still pretty dark C1
		// backgroundColor: "#2A2033", wow - D
		// backgroundColor: "#2A243B", sleek - L
		// backgroundColor: "#181824", Nice dark
		// backgroundColor: "#222233", very balanced nice d/L
		// backgroundColor: "#2A243B", C2
		// borderBottomColor: "#3C3B4F",
		// borderBottomWidth: 1,
		backgroundColor: "#222133", //Header color
		// backgroundColor: "#5F5D8F",
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
		fontFamily: "PhiloBold",
		fontSize: 32,
		color: "#222F42",
		letterSpacing: 1,
	},
	darkModeTitle: {
		color: "white",
	},
	helpText: {
		fontSize: 14,
		textDecorationLine: "underline",
	},
	helpTextDarkMode: {
		color: "grey",
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
	CtaContainer: {
		// borderBottomWidth: 7,
		// borderLeftWidth: 10,
		borderTopWidth: 7,
		borderColor: "#658AC2",
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: "white",
	},
	callToAction: {
		fontFamily: "PhiloReg",
		fontSize: 18,
		textAlign: "center",
		padding: 8,
	},
	placeholderContainer: {
		borderBottomWidth: 7,
		// borderLeftWidth: 10,
		borderBottomColor: "#658AC2",
		borderTopWidth: 7,
		borderTopColor: "#B4C4DB",
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: "white",
	},
	placeholderContainerDarkMode: {
		borderBottomWidth: 0,
		borderTopWidth: 0,
		backgroundColor: "#5F5D8F",
	},
	placeholderText: {
		fontFamily: "PhiloReg",
		fontSize: 22, //was 20
		lineHeight: 26,
		padding: 25,
		textAlign: "justify",
	},
	goalContainer: {
		borderBottomWidth: 7,
		// borderLeftWidth: 10,
		borderBottomColor: "#658AC2",
		borderTopWidth: 7,
		borderTopColor: "#B4C4DB",
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: "white",
	},
	goalContainerDarkMode: {
		backgroundColor: "#5F5D8F",
		borderRadius: 8,
		borderTopColor: "#8A86CF",
		borderBottomColor: "#8A86CF",
		borderTopWidth: 0,
		borderBottomWidth: 0,
	},
	goalText: {
		fontFamily: "PhiloReg",
		fontSize: 22, //was 20
		lineHeight: 26,
		padding: 25,
		textAlign: "justify",
		// fontFamily: "FuzzyBubblesRegular",
		// textAlign: "center",
		// fontFamily: "IndieFlower",
		// fontSize: 24,
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
	inputDarkMode: {
		color: "white",
	},
	switchContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 8,
		paddingBottom: 8,
		marginRight: 5,
		marginLeft: 15,
	},
	editButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "black",
		height: 35,
		width: 100,
		backgroundColor: "#222F42",

		borderRadius: 6,
		// marginRight: 10,
	},
	darkButton: {
		backgroundColor: "#222133",
	},
	editingNow: {
		backgroundColor: "#C29C51",
	},
	editingDarkMode: {
		backgroundColor: "#524BD7",
	},
	editButtonText: {
		// fontFamily: "PhiloReg",
		// fontSize: 15,
		// letterSpacing: 1,
		color: "white",
	},
	switchText: {
		fontSize: 14,
	},
	switchTextDarkMode: {
		color: "white",
	},
	quoteButtonContainer: {
		marginTop: 20, //adjust space between goal section
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
		marginLeft: 10,
	},
	quoteButton: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		width: "100%",
		alignItems: "center",
		height: 48,
		backgroundColor: "white",
		borderRadius: 10,
		borderBottomColor: "#658AC2",
		borderBottomWidth: 7,
	},
	quoteButtonDarkMode: {
		backgroundColor: "#5F5D8F",
		borderBottomColor: "#8A86CF",
		borderBottomWidth: 7,
		borderRadius: 8,
	},
	quoteButtonSplit: {
		width: "48%",
		// marginTop: 0,
		marginLeft: 5,
		marginRight: 5,
	},
	quoteButtonText: {
		fontSize: 17,
		padding: 8,
	},
	quoteContainer: {
		// borderBottomWidth: 7,
		// borderLeftWidth: 10,
		// borderBottomColor: "#658AC2",
		// borderTopWidth: 7,
		// borderTopColor: "#B4C4DB",
		marginTop: 20, //adjust space between goal section
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: "white",
	},
	quoteContainerDarkMode: {
		backgroundColor: "#5F5D8F",
	},
	quoteText: {
		fontSize: 18,
		fontFamily: "PhiloItalic",
		// fontStyle: "italic",
		// textAlign: "center",
		paddingTop: 25,
		paddingRight: 25,
		paddingLeft: 25,
		paddingBottom: 0,
	},
	quoteAuthor: {
		fontSize: 14,
		fontStyle: "italic",
		textAlign: "right",
		padding: 10,
	},
});
