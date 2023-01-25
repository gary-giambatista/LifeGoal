import FontAwesome from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
	Button,
	Image,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const LoginScreen = () => {
	const { onGoogleButtonPress, loading } = useAuth();

	return (
		<View style={{ flex: 1, backgroundColor: "#0e1a28" }}>
			<ImageBackground
				resizeMode="contain"
				style={{ flex: 1 }}
				source={{
					uri: "https://media.licdn.com/dms/image/D4E12AQFLftbj95B1Ew/article-cover_image-shrink_720_1280/0/1657604726873?e=2147483647&v=beta&t=kG4IuiRELgeOUYa3UYZV8_PZFOhcvV_VgKoYOwL_6-Y",
				}}
			>
				<View style={styles.loginContainer}>
					<View style={styles.logoContainer}>
						{/* <Image
							style={styles.logo}
							source={require("../assets/EsteemLogo.png")}
						/> */}
						<Text style={styles.logoText}>Lifegoal</Text>
					</View>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={onGoogleButtonPress}
					>
						<FontAwesome
							// style={{ paddingLeft: 5 }}
							name="google"
							size={20}
							color="#0e1a28"
						/>

						<Text
							style={{
								textAlign: "center",
								color: "#0e1a28",
								letterSpacing: 1,
							}}
						>
							{" "}
							Sign In with Google{" "}
						</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	loginContainer: {
		display: "flex",
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 100,
		// backgroundColor: "black",
		// position: "absolute",
		// top: 200,
		// marginHorizontal: "18%",
	},
	logoContainer: {
		display: "flex",
		width: "100%",
		flexDirection: "row",
		// backgroundColor: "black",
		alignItems: "center",
		justifyContent: "center",
		paddingRight: 10,
	},
	logo: {
		height: 55,
		width: 55,
		// marginBottom: 50, // positioning the logo
		// marginTop: 300, // positioning the logo
	},
	logoText: {
		fontSize: 46,
		marginLeft: 10,
		color: "white",
	},
	loginButton: {
		display: "flex",
		flexDirection: "row",
		marginTop: 30, // position the logo and text above
		padding: 13,
		width: 208,
		borderRadius: 8,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "space-between",
		// position: "absolute",
		// bottom: 200,
		// marginHorizontal: "25%",
	},
});
