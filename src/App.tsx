import { useState, useEffect } from "react";
import { Pokemon, PokemonMin, PokemonName } from "./types/Pokemon";
import { generateRandomNum } from "./utils/generateRandom";

import JSConfetti from "js-confetti";
import Swal from "sweetalert2";

import "./App.css";
import CardPokemon from "./components/cardPokemon/CardPokemon";
import Loading from "./components/loading/Loading";
import Settings from "./components/settings/Settings";
import Marcador from "./components/marcador/Marcador";


function App() {
	const url = "https://pokeapi.co/api/v2/pokemon";

	// array to store pokemons data
	const [pokemons, setPokemons] = useState<PokemonMin[] | null>(null);
	//game turns
	const [turns, setTurns] = useState(0);
	// states to store the cards choices
	const [choiceOne, setChoiceOne] = useState<PokemonMin | null>(null);
	const [choiceTwo, setChoiceTwo] = useState<PokemonMin | null>(null);
	// to disabled clicked card 
	const [disabled, setDisabled] = useState(false);
	// to know when the game is finished
	const [gameEnd, setGameEnd] = useState(false);
	// state to loading
	const [loading, setLoading] = useState(false);
	// state to know how many pokemons we want
	const [pkmCount, setPkmCount] = useState<number>(3);
	// state to know selected card manually
	const [cardsManually, setCardsManually] = useState<PokemonName[]>([]);
	// to know if fetch is randomly or manually
	const [manually, setManually] = useState(false);
	// to set the width of cards container
	const [width, setWidth] = useState("");
	// player points
	const [player1Points, setPlayer1Points] = useState(0);
	const [player2Points, setPlayer2Points] = useState(0);
	// to know player turn
	const [player1, setPlayer1] = useState(false);
	const [player2, setPlayer2] = useState(false);
	// to know if are two players
	const [twoPlayers, setTwoPlayers] = useState(false);

	// create confetti instance
	const jsConfetti = new JSConfetti();




	/**
	 * fetch, to get randomly pokemon from pokeapi
	 * @param pkmsCount number of pokemons thats we want
	 * @returns Array with the number of Pokemon that have been specified
	 */
	const fetchPokemonRandomly = async (pkmsCount: number) => {
		try {
			let pokemonData: Pokemon[] = [];
			// function to generate as many random numbers as specified
			const randomNums = generateRandomNum(1, 1025, pkmsCount);

			for (let i = 0; i < randomNums.length; i++) {
				const response = await fetch(`${url}/${randomNums[i]}`);

				if (!response.ok) {
					throw new Error("No se pudo obtener la información");
				}

				const data = await response.json() as Pokemon;

				pokemonData = [...pokemonData, data];
			}

			// return pokemons
			return pokemonData;


		} catch (error) {
			console.error("Error al obtener datos:", error);
		}
	};

	/**
	 * fetch, to get manually pokemon from pokeapi
	 * @param cards array of cards that we will find
	 * @returns Array with the number of Pokemon that have been specified
	 */
	const fetchPokemonManually = async (cards: PokemonName[]) => {
		try {
			let pokemonData: Pokemon[] = [];


			for (let i = 0; i < cards.length; i++) {
				const cardSelected = cards[i];

				const response = await fetch(`${url}/${cardSelected.id}`);

				if (!response.ok) {
					throw new Error("No se pudo obtener la información");
				}

				const data = await response.json() as Pokemon;

				pokemonData = [...pokemonData, data];
			}

			// return pokemons
			return pokemonData;


		} catch (error) {
			console.error("Error al obtener datos:", error);
		}
	};

	/**
	 * function to duplicate the pokemons and sort it randomly
	 * @param data Array with pokemons
	 */
	// shuffle cards
	const shuffleCards = (data: Pokemon[]) => {

		const dataMin: PokemonMin[] = data.map((item) => {
			return {
				id: item.id,
				img: item.sprites.other?.["official-artwork"].front_default,
				name: item.name,
				matched: false,

			};
		});

		/**
		 * sort randomly element 
		 * @param array data to sort randomly
		 */
		const shuffleArray = (array: PokemonMin[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		};

		// duplicate cards
		const shuffleCards = [...dataMin, ...dataMin]
			.map((pokemon, index) => ({ ...pokemon, index: index }));

		// sort randomly
		shuffleArray(shuffleCards);
		// set pokemons state
		setPokemons(shuffleCards);
		// set choices to null
		setChoiceOne(null);
		setChoiceTwo(null);
		// resets turns
		setTurns(0);
	};

	/**
	 * set width of board
	 * @param pkmNumber numbers of pkms
	 * @returns 
	 */
	const setWidthClass = (pkmNumber: number) => {
		// set the width of board
		if (pkmNumber === 3) {
			setWidth("width-3-cards");
			return;
		}

		if (pkmNumber === 4) {
			setWidth("width-4-cards");
			return;
		}
		if (pkmNumber === 5) {
			setWidth("width-5-cards");
			return;
		}
		if (pkmNumber === 6) {
			setWidth("width-6-cards");
			return;
		}
		if (pkmNumber === 7) {
			setWidth("width-7-cards");
			return;
		}
		if (pkmNumber >= 8) {
			setWidth("width-8-cards");
			return;
		}
	};

	/**
	 * Get the numbers of pokemons and set pkmsCount
	 * call fetchData to get pokemons
	 * call shuffleCard to duplicate and sort randomly 
	 * @param e event of click
	 */
	const newGame = () => {



		// if manually
		if (manually) {

			// check how many tags are 
			if (cardsManually.length !== pkmCount) {
				console.log("Debe seleccionar al menos " + pkmCount + " pokemons");

				Swal.fire({
					title: "Error!",
					text: `Debe seleccionar al menos: ${pkmCount} pokemons`,
					icon: "error"
				})
					.catch(e => { console.error("Error: ", e); });
				return;
			}

			//set player1 to first
			setPlayer1(true);
			// set player2 to second
			setPlayer2(false);
			// reset players points
			setPlayer1Points(0);
			setPlayer2Points(0);
			// set game end to false
			setGameEnd(false);

			// reset pokemons data
			setPokemons(null);
			// set loading
			setLoading(true);
			// set width 
			setWidthClass(pkmCount);

			fetchPokemonManually(cardsManually)
				.then(data => {
					//if fetch ok
					if (data !== undefined) {
						// shuffle cards
						shuffleCards(data);
						// set loading false
						setLoading(false);
					}
				})
				.catch(e => { console.error("Error:", e); });
		} else {

			//set player1 to first
			setPlayer1(true);
			// set player2 to second
			setPlayer2(false);
			// reset players points
			setPlayer1Points(0);
			setPlayer2Points(0);
			// set game end to false
			setGameEnd(false);

			// reset pokemons data
			setPokemons(null);
			// set loading
			setLoading(true);
			// set width 
			setWidthClass(pkmCount);

			// call fetch to get pokemons
			fetchPokemonRandomly(pkmCount)
				.then((data) => {
					// if fetch ok
					if (data !== undefined) {
						// shuffle cards
						shuffleCards(data);
						// set loading false
						setLoading(false);
					}
				})
				.catch(e => { console.error(e); });
		}

	};

	/**
		 * get the cards when click over there 
		 * @param card data pokemon
		 */
	const handleChoice = (card: PokemonMin) => {
		if (choiceOne) {
			if (choiceOne === card) {
				setChoiceTwo(null);
			} else {
				setChoiceTwo(card);
			}
		} else {
			setChoiceOne(card);
		}

		// choiceOne ?
		// 	choiceOne === card ? 
		// 		setChoiceTwo(null) : 
		// 		setChoiceTwo(card) :
		// 	setChoiceOne(card);
	};

	/**
		 * reset choices and add one turn
		 */
	const resetTurn = () => {
		setChoiceOne(null);
		setChoiceTwo(null);
		setTurns(prevTurns => prevTurns + 1);
		setDisabled(false);
	};

	/**
	 * add point
	 */
	const addPoint = () => {

		if (player1) {
			setPlayer1Points(prev => prev + 1);
		} else {

			setPlayer2Points(prev => prev + 1);
		}

	};

	/**
		 * compare 2 selected pokemons
		 */
	useEffect(() => {
		console.log("first");

		// if choiceOne and choiceTwo have a value
		if (choiceOne && choiceTwo) {
			console.log("second");
			//disabled
			setDisabled(true);
			// if there are equal
			if (choiceOne.id === choiceTwo.id) {

				// update the state
				setPokemons(prevPokemons => {
					if (!prevPokemons) {
						return null;
					} else {
						return prevPokemons.map(pokemon => {
							if (pokemon.id === choiceOne.id) {
								// update propertied matched to true
								return { ...pokemon, matched: true };
							} else {
								return pokemon;
							}
						});
					}
				});

				// add point to player in turn
				addPoint();

			} else {
				// change turn
				console.log("cambiamos el turno");
				setPlayer1(prev => !prev);
				setPlayer2(prev => !prev);
			}

			setTimeout(() => {
				resetTurn();

			}, 1500);
		}
	}, [choiceOne, choiceTwo]);

	/**
		 * to check if all cards are matched
		 */
	useEffect(() => {

		if (pokemons === null) return;
		// check if all pokemons are matched and setGameEnd
		setGameEnd(pokemons.every(pokemon => pokemon.matched));

	}, [pokemons]);

	/**
	 * to check if game is end
	 */
	useEffect(() => {



		const f = () => {
			console.log({ player1Points, player2Points });
			setTimeout(async () => {

				// confetti
				jsConfetti.addConfetti({ 
					emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🧟‍♂️", "🧟‍♀️"],
					
				})
					.catch(e => { console.error("Error: ", e); });

				const winner = player1Points > player2Points ?
					"player1"
					: player2Points > player1Points ?
						"player2"
						: "empate"; 

				if (winner === "empate") {
					await Swal.fire({
						title: "Empate",
						text: `player1 points: ${player1Points}, player2 points: ${player2Points}
						gana: ${winner}`,
						icon: "success"
					});
				} else {
					await Swal.fire({
						title: `${winner} 🏆`,
						text: "Win",
						icon: "success"
					});
				}


			}, 1000);

		};

		// solo se ejecuta si gameEnd
		if (gameEnd) {

			
			
			// execute function
			f();
		}

	}, [gameEnd, player1Points, player2Points]);



	return (
		<div className='app'>
			<h1>Pokemon Match</h1>

			<Marcador
				player1={player1}
				player2={player2}
				player1Points={player1Points}
				player2Points={player2Points}
				turns={turns}
				twoPlayers={twoPlayers}
			/>

			<button onClick={newGame}>New Game</button>

			{
				// if loading set true show loading, if set false show pokemons
				loading
					? <Loading />

					// if don't have pokemons , don't show nothing
					: pokemons &&
					<div className={`card-container ${width}`}>
						{
							pokemons.map((pokemon, index) => {
								return (
									<CardPokemon
										key={index}
										pokemon={pokemon}
										handleChoice={handleChoice}
										flipped={
											pokemon === choiceOne ||
											pokemon === choiceTwo ||
											pokemon.matched
										}
										disabled={disabled}
									/>
								);
							})
						}
					</div>
			}

			<Settings
				setPkmCount={setPkmCount}
				pkmCount={pkmCount}
				setCardsManually={setCardsManually}
				manually={manually}
				setManually={setManually}
				setTwoPlayers={setTwoPlayers}
			/>


		</div>
	);
}

export default App;
