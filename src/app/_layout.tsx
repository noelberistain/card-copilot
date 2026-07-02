import { Stack } from 'expo-router';
import '../global.css';


import { initDb } from "@/db/initDb";

initDb();


export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}
