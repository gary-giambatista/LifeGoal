import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import UserCreatedQuoteRow from "./UserCreatedQuoteRow";

const UserCreatedQuoteList = ({ editing, setEditing }) => {
	const [userQuotes, setUserQuotes] = useState([]);
	const [userQuote, setUserQuote] = useState("");

	//TODO: Create 3 db functions
	//fetch(liveListener > save in userQuotes[]), add, and delete DB functions
	//pass delete down to row

	return (
		<View style={styles.componentContainer}>
			{editing ? (
				<View style={[styles.sectionContainer, styles.cardShadow]}>
					<Text>Write Your Own Quote!</Text>
					<TextInput
						multiline={true}
						numberOfLines={5}
						style={styles.input}
						placeholder="Write your quote here..."
						onChangeText={setUserQuote}
						value={userQuote}
						editable={editing}
					/>
					<TouchableOpacity
						onPress={() => setEditing((prevEditing) => !prevEditing)}
						style={styles.editButtonContainer}
					>
						<Text style={styles.editButtonText}>Save</Text>
					</TouchableOpacity>
				</View>
			) : null}
			{userQuote && !editing ? (
				<View>
					{/* <Text style={styles.sectionTitle}>Your quotes</Text> */}
					<UserCreatedQuoteRow userQuote={userQuote} />
				</View>
			) : null}
		</View>
	);
};

export default UserCreatedQuoteList;

const styles = StyleSheet.create({
	componentContainer: {},
	sectionContainer: {
		backgroundColor: "white",
		// flexDirection: "row",
		margin: 10,
		padding: 10,
		borderRadius: 10,
		borderLeftWidth: 7,
		borderColor: "#B4C4DB",
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
	editButtonContainer: {
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
	},
	editButtonText: {
		fontSize: 16,
		color: "white",
	},
	sectionTitle: {
		marginLeft: 12,
		marginRight: 10,
		fontSize: 20,
	},
	quoteText: {
		fontSize: 14,
	},
});
