import { useState, useEffect, useMemo } from "react";
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
	const jsConfetti = useMemo(() => new JSConfetti(), []);




	/**
	 * fetch, to get randomly Pokémon from pokeapi
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
	 * fetch, to get manually Pokémon from pokeapi
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
	 * function to duplicate the Pokémon and sort it randomly
	 * @param data Array with Pokémon
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
	 * Get the numbers of Pokémon and set pkmsCount
	 * call fetchData to get Pokémon
	 * call shuffleCard to duplicate and sort randomly 
	 * @param e event of click
	 */
	const newGame = () => {



		// if manually
		if (manually) {

			// check how many tags are 
			if (cardsManually.length !== pkmCount) {
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
		 * @param card data Pokémon
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
		* compare 2 selected Pokémon
		*/
	useEffect(() => {
		

		// if choiceOne and choiceTwo have a value
		if (choiceOne && choiceTwo) {

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
				if (player1) {
					setPlayer1Points(prev => prev + 1);
				} else {

					setPlayer2Points(prev => prev + 1);
				}

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

				// if two players
				if (twoPlayers) {
					if (winner === "empate") {
						await Swal.fire({
							title: "Empate",
							text: `player1 points: ${player1Points}, player2 points: ${player2Points}`,
							icon: "warning",
							iconHtml: `<svg width="80px" height="80px" viewBox="0 0 1024 1024" class="icon" version="1.1"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M454.5 675.5l-32.4 107.9h181.8L574.5 678" fill="#FBBA22" />
								<path d="M510.1 682.3c215.1 0 215.1-165.2 215.1-165.2V197.4H300.9v319.7s0 165.2 215.1 165.2h-5.9z" fill="#FBBA22" />
								<path d="M515.4 783.4h91.1s89.5 2.3 89.5 80.8H332.4c0-78.6 89.5-80.8 89.5-80.8H513" fill="#C04931" />
								<path d="M816.5 383.8V259.3c0-11.2-9-20.2-20.2-20.2h-50.9v-41.7c0-11.2-9-20.2-20.2-20.2H300.9c-11.2 0-20.2 9-20.2 20.2v41.7h-50.9c-11.2 0-20.2 9-20.2 20.2v124.5c0 1.2-0.7 42.2 27.2 70.9 11.7 12 26.5 19.9 43.9 23.8v38.6c0 1.6 2.1 135.7 147.8 174.7l-21.8 72.7c-39 5.7-94.5 31.2-94.5 99.7 0 11.2 9 20.2 20.2 20.2H696c11.2 0 20.2-9 20.2-20.2 0-69.6-57.2-94.7-96.6-99.9l-20.4-72.9c144.1-39.6 146.2-172.7 146.2-174.3v-38.6c17.4-3.9 32.1-11.8 43.9-23.8 27.9-28.7 27.2-69.7 27.2-70.9z m-550.8 42.7c-16-16.4-15.8-41.9-15.8-42.1V279.6h30.7v156.7c-5.7-2.4-10.8-5.6-14.9-9.8z m338.2 377.1c0.1 0 0.1 0 0 0h2c6.2 0.2 54 3 66.8 40.4h-317c12.8-37.4 60.5-40.2 66.2-40.4h182z m-154.6-40.4l19.1-63.6c12.5 1.6 25.9 2.5 40.1 2.8 0.5 0 1.1 0.1 1.6 0.1h5.9c0.5 0 1.1 0 1.6-0.1 14.9-0.3 28.8-1.3 41.9-3l17.9 63.9H449.3zM705 517c-0.1 5.9-3.5 143.6-191.9 145-17.6-0.1-33.6-1.4-48.1-3.7-1.5-0.9-3-1.7-4.7-2.2-3.2-0.9-6.3-1-9.4-0.4-127.1-27.3-129.7-133.5-129.8-138.6V217.6H705V517z m55.3-90.5c-4.1 4.2-9.1 7.4-15 9.8V279.5H776v104.8c0.1 0.3 0.3 25.8-15.7 42.2z" fill="#211F1E" />
								<path d="M446.7 449.5l-11.2 65.2c-1 5.7 1.4 11.4 6 14.8 4.7 3.4 10.8 3.8 16 1.1l58.5-30.8 58.5 30.8c2.2 1.2 4.6 1.7 7.1 1.7 3.1 0 6.3-1 8.9-2.9 4.7-3.4 7-9.1 6-14.8l-11.2-65.2 47.4-46.2c4.1-4 5.6-10.1 3.8-15.5-1.8-5.5-6.5-9.5-12.2-10.3L559 368l-29.3-59.3c-2.6-5.2-7.8-8.4-13.6-8.4s-11 3.3-13.6 8.4L473.2 368l-65.5 9.5c-5.7 0.8-10.4 4.8-12.2 10.3-1.8 5.5-0.3 11.5 3.8 15.5l47.4 46.2z m38.8-52.6c4.9-0.7 9.2-3.8 11.4-8.3l19.2-38.9 19.2 38.9c2.2 4.5 6.5 7.6 11.4 8.3l43 6.2-31.1 30.3c-3.6 3.5-5.2 8.5-4.4 13.4l7.3 42.8-38.4-20.2c-4.4-2.3-9.7-2.3-14.1 0l-38.4 20.2 7.3-42.8c0.8-4.9-0.8-9.9-4.4-13.4l-31.1-30.3 43.1-6.2z" fill="#211F1E" />
							</svg>`
						}); 
					} else {
						await Swal.fire({
							title: winner,
							text: "Win",
							icon: "warning",
							iconHtml: `<svg width="80px" height="80px" viewBox="0 0 1024 1024" class="icon" version="1.1"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M454.5 675.5l-32.4 107.9h181.8L574.5 678" fill="#FBBA22" />
								<path d="M510.1 682.3c215.1 0 215.1-165.2 215.1-165.2V197.4H300.9v319.7s0 165.2 215.1 165.2h-5.9z" fill="#FBBA22" />
								<path d="M515.4 783.4h91.1s89.5 2.3 89.5 80.8H332.4c0-78.6 89.5-80.8 89.5-80.8H513" fill="#C04931" />
								<path d="M816.5 383.8V259.3c0-11.2-9-20.2-20.2-20.2h-50.9v-41.7c0-11.2-9-20.2-20.2-20.2H300.9c-11.2 0-20.2 9-20.2 20.2v41.7h-50.9c-11.2 0-20.2 9-20.2 20.2v124.5c0 1.2-0.7 42.2 27.2 70.9 11.7 12 26.5 19.9 43.9 23.8v38.6c0 1.6 2.1 135.7 147.8 174.7l-21.8 72.7c-39 5.7-94.5 31.2-94.5 99.7 0 11.2 9 20.2 20.2 20.2H696c11.2 0 20.2-9 20.2-20.2 0-69.6-57.2-94.7-96.6-99.9l-20.4-72.9c144.1-39.6 146.2-172.7 146.2-174.3v-38.6c17.4-3.9 32.1-11.8 43.9-23.8 27.9-28.7 27.2-69.7 27.2-70.9z m-550.8 42.7c-16-16.4-15.8-41.9-15.8-42.1V279.6h30.7v156.7c-5.7-2.4-10.8-5.6-14.9-9.8z m338.2 377.1c0.1 0 0.1 0 0 0h2c6.2 0.2 54 3 66.8 40.4h-317c12.8-37.4 60.5-40.2 66.2-40.4h182z m-154.6-40.4l19.1-63.6c12.5 1.6 25.9 2.5 40.1 2.8 0.5 0 1.1 0.1 1.6 0.1h5.9c0.5 0 1.1 0 1.6-0.1 14.9-0.3 28.8-1.3 41.9-3l17.9 63.9H449.3zM705 517c-0.1 5.9-3.5 143.6-191.9 145-17.6-0.1-33.6-1.4-48.1-3.7-1.5-0.9-3-1.7-4.7-2.2-3.2-0.9-6.3-1-9.4-0.4-127.1-27.3-129.7-133.5-129.8-138.6V217.6H705V517z m55.3-90.5c-4.1 4.2-9.1 7.4-15 9.8V279.5H776v104.8c0.1 0.3 0.3 25.8-15.7 42.2z" fill="#211F1E" />
								<path d="M446.7 449.5l-11.2 65.2c-1 5.7 1.4 11.4 6 14.8 4.7 3.4 10.8 3.8 16 1.1l58.5-30.8 58.5 30.8c2.2 1.2 4.6 1.7 7.1 1.7 3.1 0 6.3-1 8.9-2.9 4.7-3.4 7-9.1 6-14.8l-11.2-65.2 47.4-46.2c4.1-4 5.6-10.1 3.8-15.5-1.8-5.5-6.5-9.5-12.2-10.3L559 368l-29.3-59.3c-2.6-5.2-7.8-8.4-13.6-8.4s-11 3.3-13.6 8.4L473.2 368l-65.5 9.5c-5.7 0.8-10.4 4.8-12.2 10.3-1.8 5.5-0.3 11.5 3.8 15.5l47.4 46.2z m38.8-52.6c4.9-0.7 9.2-3.8 11.4-8.3l19.2-38.9 19.2 38.9c2.2 4.5 6.5 7.6 11.4 8.3l43 6.2-31.1 30.3c-3.6 3.5-5.2 8.5-4.4 13.4l7.3 42.8-38.4-20.2c-4.4-2.3-9.7-2.3-14.1 0l-38.4 20.2 7.3-42.8c0.8-4.9-0.8-9.9-4.4-13.4l-31.1-30.3 43.1-6.2z" fill="#211F1E" />
							</svg>`
						});
					}

				// if one player
				} else {
					await Swal.fire({
						title: "Juego Terminado",
						icon: "success",
						iconHtml: `<svg width="80px" height="80px" viewBox="0 0 1024 1024" class="icon" version="1.1"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M454.5 675.5l-32.4 107.9h181.8L574.5 678" fill="#FBBA22" />
								<path d="M510.1 682.3c215.1 0 215.1-165.2 215.1-165.2V197.4H300.9v319.7s0 165.2 215.1 165.2h-5.9z" fill="#FBBA22" />
								<path d="M515.4 783.4h91.1s89.5 2.3 89.5 80.8H332.4c0-78.6 89.5-80.8 89.5-80.8H513" fill="#C04931" />
								<path d="M816.5 383.8V259.3c0-11.2-9-20.2-20.2-20.2h-50.9v-41.7c0-11.2-9-20.2-20.2-20.2H300.9c-11.2 0-20.2 9-20.2 20.2v41.7h-50.9c-11.2 0-20.2 9-20.2 20.2v124.5c0 1.2-0.7 42.2 27.2 70.9 11.7 12 26.5 19.9 43.9 23.8v38.6c0 1.6 2.1 135.7 147.8 174.7l-21.8 72.7c-39 5.7-94.5 31.2-94.5 99.7 0 11.2 9 20.2 20.2 20.2H696c11.2 0 20.2-9 20.2-20.2 0-69.6-57.2-94.7-96.6-99.9l-20.4-72.9c144.1-39.6 146.2-172.7 146.2-174.3v-38.6c17.4-3.9 32.1-11.8 43.9-23.8 27.9-28.7 27.2-69.7 27.2-70.9z m-550.8 42.7c-16-16.4-15.8-41.9-15.8-42.1V279.6h30.7v156.7c-5.7-2.4-10.8-5.6-14.9-9.8z m338.2 377.1c0.1 0 0.1 0 0 0h2c6.2 0.2 54 3 66.8 40.4h-317c12.8-37.4 60.5-40.2 66.2-40.4h182z m-154.6-40.4l19.1-63.6c12.5 1.6 25.9 2.5 40.1 2.8 0.5 0 1.1 0.1 1.6 0.1h5.9c0.5 0 1.1 0 1.6-0.1 14.9-0.3 28.8-1.3 41.9-3l17.9 63.9H449.3zM705 517c-0.1 5.9-3.5 143.6-191.9 145-17.6-0.1-33.6-1.4-48.1-3.7-1.5-0.9-3-1.7-4.7-2.2-3.2-0.9-6.3-1-9.4-0.4-127.1-27.3-129.7-133.5-129.8-138.6V217.6H705V517z m55.3-90.5c-4.1 4.2-9.1 7.4-15 9.8V279.5H776v104.8c0.1 0.3 0.3 25.8-15.7 42.2z" fill="#211F1E" />
								<path d="M446.7 449.5l-11.2 65.2c-1 5.7 1.4 11.4 6 14.8 4.7 3.4 10.8 3.8 16 1.1l58.5-30.8 58.5 30.8c2.2 1.2 4.6 1.7 7.1 1.7 3.1 0 6.3-1 8.9-2.9 4.7-3.4 7-9.1 6-14.8l-11.2-65.2 47.4-46.2c4.1-4 5.6-10.1 3.8-15.5-1.8-5.5-6.5-9.5-12.2-10.3L559 368l-29.3-59.3c-2.6-5.2-7.8-8.4-13.6-8.4s-11 3.3-13.6 8.4L473.2 368l-65.5 9.5c-5.7 0.8-10.4 4.8-12.2 10.3-1.8 5.5-0.3 11.5 3.8 15.5l47.4 46.2z m38.8-52.6c4.9-0.7 9.2-3.8 11.4-8.3l19.2-38.9 19.2 38.9c2.2 4.5 6.5 7.6 11.4 8.3l43 6.2-31.1 30.3c-3.6 3.5-5.2 8.5-4.4 13.4l7.3 42.8-38.4-20.2c-4.4-2.3-9.7-2.3-14.1 0l-38.4 20.2 7.3-42.8c0.8-4.9-0.8-9.9-4.4-13.4l-31.1-30.3 43.1-6.2z" fill="#211F1E" />
							</svg>`
					});
				}



			}, 1000);

		};

		// solo se ejecuta si gameEnd
		if (gameEnd) {
			setGameEnd(false);

			// execute function
			f();
		}

	}, [gameEnd, player1Points, player2Points, jsConfetti, twoPlayers]);


	return (
		<div className='app'>

			<h1>Pokemon Memory Game</h1>

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
