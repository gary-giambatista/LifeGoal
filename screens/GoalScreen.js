import { Entypo, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
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
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
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
	const [goalCopy, setGoalCopy] = useState("");
	const [editing, setEditing] = useState(false);
	const inputRef = useRef();
	const [isPublic, setIsPublic] = useState(false);
	const [quote, setQuote] = useState("");
	const [quoteAuthor, setQuoteAuthor] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [notification, setNotification] = useState(null); //check to see if notification exists
	const [isLoading, setIsLoading] = useState(false);
	const [notificationTimer, setNotificationTimer] = useState(6);
	const [savingQuote, setSavingQuote] = useState(false);

	console.log("Notification Timer", notificationTimer);

	//GET: fetch user's goal data from Firebase
	useEffect(() => {
		setIsLoading(true);
		async function fetchUserGoal() {
			const data = await firestore()
				.collection("Goals")
				.doc(`${user.uid}`)
				.get();
			// console.log("user data: ", data.data().goal);
			if (data.data().goal) {
				setGoal(data.data().goal);
				setGoalCopy(data.data().goal);
				setIsPublic(data.data().isPublic);
				setNotificationTimer(data.data().timer);
				setGoalCreatedDate(data.data().createdAt.seconds);
				// console.log(data.data().createdAt);
			}
		}
		fetchUserGoal();
	}, []);

	useEffect(() => {
		isLoading ? setIsLoading(false) : console.log("NOT LOADING");
	}, [goal]);

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
		//db call to create new goal
		firestore()
			.collection("Goals")
			.doc(`${user.uid}`)
			.set({
				userId: user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				// lastEdited: firestore.FieldValue.serverTimestamp(),
				isPublic: isPublic,
				goal: goal,
				timer: notificationTimer,
			})
			.then(() => {
				console.log("Goal Updated!");
				setEditing(false);
			});
	}
	//Update goal without replacing created at time
	async function updateGoal() {
		//db call to update existing goal
		firestore()
			.collection("Goals")
			.doc(`${user.uid}`)
			.update({
				goal: goal,
			})
			.then(() => {
				console.log("ONLY Goal Updated!");
				setEditing(false);
			});
	}

	//alert for choosing how to update goal timer
	const checkToUpdateTimer = () =>
		Alert.alert(
			"Restart Goal Timer?",
			"If you select Yes, the timer will start from 30 days again.",
			[
				{
					text: "No",
					onPress: () => updateGoal(),
				},
				{ text: "Yes", onPress: () => saveGoal() },
			]
		);
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
		setSavingQuote(true);
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
				//insert toast
				ToastAndroid.show("Quote Saved successfully!", ToastAndroid.SHORT);
				setTimeout(() => setSavingQuote(false), 1000);
				console.log("Quote Saved!");
			});
	}

	async function clearNotifications() {
		const notificationId =
			await Notifications.getAllScheduledNotificationsAsync();
		console.log(notificationId);
		// Notifications.dismissAllNotificationsAsync();
		Notifications.cancelAllScheduledNotificationsAsync();
		// Notifications.dismissAllNotificationsAsync(); SEEMS LIKE THIS WORKS FOR ONLY THIS APPS notifications ! GOOD
	}

	const timeSettings = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 24];

	// CREATE NOTIFICATION FUNCTION - arguement is NUMBER: x 3600 for seconds in an hour. updateNotification takes notificationTimer not from state but from dropdown SelectDropdown element
	async function createNotification(notificationTimer) {
		const notifications = await Notifications.scheduleNotificationAsync({
			content: {
				title: "Remember to check your goal",
				body: "Don't forget what you are working towards!",
			},
			trigger: {
				seconds: notificationTimer * 3600,
			},
		});
		console.log(
			`3. notification ${notifications} set for ${
				notificationTimer * 3600
			} seconds`
		);
		//${notificationTimer * 3600}
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
			createNotification(notificationTimer);
		} else console.log("2. NEW NOTIFICATION NOT TRIGGERED");
	}, [notification]);

	//**To Update Notification */
	//0. IF cancel all works, and doesn't cancel other apps notifcations use that
	//1. fetch existing notificationID
	//2. clear that notification
	//3. then create new notification createNotification(seconds)
	async function updateNotification(notificationTimer) {
		console.log("Update Notification CALLED");
		try {
			Notifications.cancelAllScheduledNotificationsAsync();
			console.log("Notifications CANCELLED");
			await createNotification(notificationTimer);
			//update goal notification timer here
			await updateNotificationTimer(notificationTimer);
		} catch (error) {
			console.log(error);
		}
	}
	//Update Firebase with new notification time > notificationTimer is a NUMBER from the SelectDropdown data={timeSettings}
	async function updateNotificationTimer(notificationTimer) {
		firestore()
			.collection("Goals")
			.doc(`${user.uid}`)
			.update({
				timer: notificationTimer,
			})
			.then(() => {
				console.log("DB Timer updated!");
			});
	}

	//**TODO: Setting a goalCreatedDate in days */
	//HANDLING UPDATING USER GOAL WITHOUT CHANGING COUNTDOWN
	//change goal setter function to include update function => alert
	//"do you want to update your goal countdown timer?"
	//yes => set(), no => update goal.goal text
	//^^ add a userHasGoal state, set true after fetch with result.length > 0

	// set a default state for goalCreatedDate
	// get createdAt.seconds set as new goalCreatedDate
	// use function in useEffect when goalCreatedDate changes to set a new state for the numberOfDaysLeft

	//below being set by goal.createdAt date from fetch
	const [goalCreatedDate, setGoalCreatedDate] = useState(null);
	console.log(goalCreatedDate);

	//HOW TO HANDLE NO GOAL SET OR GOAL TIME ENDED
	//0. add a userHasGoal state, set true after fetch with result.length > 0
	//1. use userHasGoal to conditionally render daysLeft
	//2. if daysLeft = 0 render a message button to update(restart) goal
	const [daysLeft, setDaysLeft] = useState(30);

	//TODO: Implement 30 day countdown since goal set time
	//set goal day countdown timer
	useEffect(() => {
		function calculateDaysLeft(seconds) {
			console.log(`Use EFFECT RAN with ${seconds} seconds`);

			let createdTimeinMiliseconds = seconds * 1000;
			console.log(`Miliseconds ${createdTimeinMiliseconds}`);
			let now = Date.now(); //miliseconds
			console.log(`NOW ${now}`);
			// prettier-ignore
			let timeLeft = (now - createdTimeinMiliseconds);
			console.log(`TimeLeft ${timeLeft}`);

			//timeLeft is greater than 30 days in miliseconds
			if (timeLeft > 2592000000) {
				setDaysLeft(0);
			} else {
				//timeLeft less than 30 days
				setDaysLeft(Math.floor((2592000000 - timeLeft) / 86400000)); // divide timeLeft / miliseconds in a day
			}
		}
		return () => calculateDaysLeft(goalCreatedDate);
	}, [goalCreatedDate]);
	//TODO: Search how to properly cleanup a useEffect

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
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("Profile", {
							notificationTimer,
							setNotificationTimer,
							updateNotification,
						})
					}
				>
					<Image style={styles.profilePic} source={{ uri: user.photoURL }} />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				onPress={() => navigation.navigate("Goal Help Modal")}
				style={{
					display: "flex",
					flexDirection: "row",
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
				<Octicons
					name="info"
					size={15}
					color={theme === "dark" ? "#8A86CF" : "#222F42"}
					style={{ paddingLeft: 5 }}
				/>
			</TouchableOpacity>
			{/* Double Ternary: Show goal timer if there is a goal and daysLeft is not 0, otherwise if timeLeft is 0, show message to update goal */}
			{goal && daysLeft !== 0 ? (
				<View
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontFamily: "PhiloBold",
							textAlign: "center",
							color: theme === "dark" ? "white" : null,
						}}
					>
						{daysLeft} days left
					</Text>
				</View>
			) : daysLeft === 0 ? (
				<View
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontFamily: "PhiloBold",
							textAlign: "center",
							color: theme === "dark" ? "white" : null,
						}}
					>
						Times up! {"\n"} Update your goal to start again!
					</Text>
				</View>
			) : null}
			{/* <View style={[styles.CtaContainer, styles.cardShadow]}>
				<Text style={styles.callToAction}>
					Plant this Goal in your mind,{"\n"} and water it with attention
				</Text>
			</View> */}
			{/* Goal Card Section */}
			<KeyboardAvoidingView style={{ flex: 1 }}>
				{/* TERNARY: PlaceHolder Goal or user's Goal if they have one and not editing */}
				{goal.length === 0 || editing ? (
					<View
						style={[
							styles.placeholderContainer,
							styles.cardShadow,
							theme === "dark" ? styles.placeholderContainerDarkMode : null,
						]}
					>
						{/* NESTED Ternary: if loading put activity indicator instead of placeholder */}
						{isLoading ? (
							<ActivityIndicator
								style={{ paddingTop: 100, paddingBottom: 100 }}
							/>
						) : (
							<Text style={styles.placeholderText}>
								Describe the one goal that you can accomplish in the next 30
								days, which will have the biggest positive impact on your life!
							</Text>
						)}
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
						onPress={
							editing ? (goal ? checkToUpdateTimer : saveGoal) : editGoal
						}
					>
						<Text style={styles.editButtonText}>
							{editing ? "Save Goal" : "Edit Goal"}{" "}
						</Text>
					</TouchableOpacity>
					{/* ONLY SHOW: CANCEL BUTTON when editing */}
					{editing ? (
						<TouchableOpacity
							style={[
								styles.cancelButton,
								theme === "dark" ? styles.cancelButtonDarkMode : null,
							]}
							onPress={() => {
								setGoal(goalCopy);
								setEditing(false);
							}}
						>
							<Text style={styles.editButtonText}>Cancel</Text>
						</TouchableOpacity>
					) : null}
					{/* ONLY SHOW: Public switch when not editing */}
					{!editing ? (
						<Text
							style={[
								styles.switchText,
								theme === "dark" ? styles.switchTextDarkMode : null,
							]}
						>
							Share your goal anonymously...{" "}
						</Text>
					) : null}
					{/* NESTED TERNARY: 
					ONLY SHOW: Public switch when not editing &&
					changes Which switch is shown. isPublic state issue required 2 Switches instead of a conditional for onValueChange/Value */}
					{!editing ? (
						isPublic ? (
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
						)
					) : null}
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
							disabled={isFetching || savingQuote}
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
			{/* <View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ fontSize: 16 }}>Goal notification every:</Text>
				<SelectDropdown
					defaultValue={notificationTimer}
					data={timeSettings}
					onSelect={(selectedItem, index) => {
						console.log(selectedItem, index);
						setNotificationTimer(selectedItem);
						updateNotification(selectedItem);
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return `${selectedItem} hours`;
					}}
					rowTextForSelection={(item, index) => {
						return `${item} hours`;
					}}
					renderDropdownIcon={(isOpened) => {
						return (
							<Entypo
								name="select-arrows"
								size={24}
								color={theme === "dark" ? "#222133" : "#222F42"}
							/>
						);
					}}
					// buttonStyle={[
					// 	styles.dropdownButton,
					// 	styles.cardShadow,
					// 	theme === "dark" ? styles.dropdownButtonDarkMode : null,
					// ]}
					// buttonTextStyle={[
					// 	styles.dropdownButtonText,
					// 	theme === "dark" ? styles.dropdownButtonTextDarkMode : null,
					// ]}
					dropdownStyle={{
						borderRadius: 10,
						backgroundColor: theme === "dark" ? "#5F5D8F" : "white",
					}}
					rowStyle={styles.dropdownRow}
					rowTextStyle={styles.dropdownRowText}
					buttonStyle={{
						backgroundColor: theme === "dark" ? "#5F5D8F" : "white",
						borderRadius: 10,
						shadowColor: "000",
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.2,
						shadowRadius: 1.41,
						elevation: 2,
						margin: 10,
						width: 135,
						height: 40,
					}}
					buttonTextStyle={{ fontSize: 16 }}
				/>
			</View> */}
		</ScrollView>
	);
};

export default GoalScreen;

const styles = StyleSheet.create({
	// dropdownButton: {
	// 	backgroundColor: "white",
	// 	borderRadius: 10,
	// },
	// dropdownButtonDarkMode: {
	// 	backgroundColor: "#5F5D8F",
	// },
	// dropdownButtonText: {
	// 	fontSize: 16,
	// },
	// dropdownButtonTextDarkMode: {
	// 	color: "white",
	// },
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
	cancelButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "black",
		height: 35,
		width: 100,
		backgroundColor: "#993626",
		borderRadius: 6,
		marginRight: "auto",
		marginLeft: 10,
	},
	cancelButtonDarkMode: {},
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
