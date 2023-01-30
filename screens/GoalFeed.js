import React from "react";
import { Text, View } from "react-native";
import GoalFeedList from "../components/GoalFeedList";

const GoalFeed = () => {
	return (
		<View>
			{/* Goal List > Goal Row Components */}
			<GoalFeedList />
		</View>
	);
};

export default GoalFeed;
