import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Appearance, Button } from "react-native";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState(null);
	//state for user's color scheme
	const [theme, setTheme] = useState(Appearance.getColorScheme());
	//listener for changes in user's device theme
	Appearance.addChangeListener((colorTheme) => {
		setTheme(colorTheme.colorScheme);
	});

	GoogleSignin.configure({
		webClientId:
			"498741046562-c8ou54s0h35hler3ti2qc6mgk2ju1jcd.apps.googleusercontent.com",
	});

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	async function onGoogleButtonPress() {
		// Check if your device supports Google Play
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		// Get the users ID token
		const { idToken } = await GoogleSignin.signIn();

		// Create a Google credential with the token
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);

		// Sign-in the user with the credential
		return auth().signInWithCredential(googleCredential);
	}

	const logOut = async () => {
		try {
			// console.log(auth().currentUser);
			// console.log(await auth().currentUser.getIdToken());
			// await auth().currentUser.getIdToken(true);
			await GoogleSignin.revokeAccess();
			await auth().signOut();
		} catch (error) {
			console.error(error);
		}
	};

	const memoedValue = useMemo(
		() => ({
			onGoogleButtonPress,
			logOut,
			user,
			initializing,
			theme,
		}),
		[user, initializing, theme]
	);

	return (
		<AuthContext.Provider value={memoedValue}>
			{!initializing && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
