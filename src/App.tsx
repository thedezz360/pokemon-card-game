import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardGame  from "@/pages/BoardGame.tsx";

import "./App.css";


function App() {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<BoardGame />} />

			</Routes>
		</BrowserRouter>
	);
}

export default App;
