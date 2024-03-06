import { useState } from "react";

export default function usePlayer() {

	const [player1, setPlayer1] = useState(false);
	const [player2, setPlayer2] = useState(false);

	const [player1Points, setPlayer1Points] = useState(0);
	const [player2Points, setPlayer2Points] = useState(0);

	const whoWin = ()=>{
		if(player1Points > player2Points){
			console.log("player1 win");
			return "player1 win";
		}
		if(player1Points < player2Points){
			console.log("player2 win");
			return "player2 win";
		}
		if(player1Points === player2Points){
			console.log("Empate");
			return "Empate";
		}

		
	};

	

	const changeTurn = ()=>{
		setPlayer1(prev => !prev);
		setPlayer2(prev => !prev);
	};



	return { 
		changeTurn, 
		whoWin, 
		setPlayer1Points, 
		setPlayer2Points ,
		player1,
		player2,
		setPlayer1,
		setPlayer2,
		player1Points, 
		player2Points
	};
}
