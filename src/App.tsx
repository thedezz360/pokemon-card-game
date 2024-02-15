import { useState, useEffect } from "react";
import { Pokemon, PokemonMin } from "./types/Pokemon";
import { generateRandomNum } from "./utils/generateRandom";

import "./App.css";
import CardPokemon from "./components/CardPokemon";

function App() {
	const url = "https://pokeapi.co/api/v2/pokemon";

	// array to store pokemons data
	const [pokemons, setPokemons] = useState<PokemonMin[] | null>([]);
	//game turns
	const [turns, setTurns] = useState(0);
	// states to store the cards choices
	const [choiceOne, setChoiceOne] = useState<PokemonMin | null>(null);
	const [choiceTwo, setChoiceTwo] = useState<PokemonMin | null>(null);
	//
	const [disabled, setDisabled] = useState(false);

	/**
	 * fetch, to get data from pokeapi
	 * @param pkmsCount number of pokemons thats we want
	 * @returns Array with the number of Pokemon that have been specified
	 */
	const fetchData = async (pkmsCount: number) => {
		try {
			let pokemonData: Pokemon[] = [];
			// function to generate as many random numbers as specified
			const randomNums = generateRandomNum(1, 500, pkmsCount);

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

		const shuffleArray = (array: PokemonMin[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		};

		// duplicate cards
		const shuffleCards = [...dataMin, ...dataMin]
			.map((pokemon, index) => ({ ...pokemon, index: index }));

		shuffleArray(shuffleCards);
		// set pokemons state
		setPokemons(shuffleCards);
		// set choices to null
		setChoiceOne(null);
		setChoiceTwo(null);
		setTurns(0);
	};

	/**
	 * Get the numbers of pokemons and set pkmsCount
	 * call fetchData to get pokemons
	 * call shuffleCard to duplicate and sort randomly 
	 * @param e event of click
	 */
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = document.getElementById("pkmsCountForm") as HTMLFormElement;

		const formData = new FormData(form);

		//get the value of formData
		const data = formData.get("pkmsCount");

		if (!data) {
			console.error("No se encontro la entrada en el formData");
		} else {
			// convert value to number
			const n = Number(data);
			// if is not at number
			if (isNaN(n)) {
				console.error("No se pudo convertir el valor númerico");
			} else {

				// call fetch to get pokemons
				fetchData(n)
					.then((data) => {
						// if fetch ok
						if (data !== undefined) {
							// shuffle cards
							shuffleCards(data);
						}
					})
					.catch(e => { console.error(e); });
			}
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
	 * reset chices and add one turn
	 */
	const resetTurn = () => {
		setChoiceOne(null);
		setChoiceTwo(null);
		setTurns(prevTurns => prevTurns + 1);
		setDisabled(false);
	};

	/**
	 * compare 2 selected pokemons
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
								// update propertie matched to true
								return { ...pokemon, matched: true };
							} else {
								return pokemon;
							}
						});
					}
				});


			} else {
				console.log("don't matched");
			}

			setTimeout(() => {
				resetTurn();

			}, 1500);
		}
	}, [choiceOne, choiceTwo]);

	// start a new game automatically


	return (
		<div className='app'>
			<h1>Pokemon Match</h1>


			<form id="pkmsCountForm" onSubmit={handleSubmit} >
				<div className='input-element'>
					<label htmlFor="pkmsCount">Seleccione la cantidad de parejas:</label>
					<input type="number" name="pkmsCount" min="3" max="15" />
				</div>
				<button>New Game</button>
			</form>

			<h3>Turns: {turns}</h3>

			<div className='card-container'>
				{
					pokemons && pokemons.map((pokemon, index) => {
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

		</div>
	);
}

export default App;
