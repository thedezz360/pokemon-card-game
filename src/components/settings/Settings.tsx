import { ChangeEvent, useState } from "react";
import pokemonsNames from "../../pokemonsNames.json";
import "./Settings.css";
import { PokemonName, PokemonNames } from "../../types/Pokemon";
import Swal from "sweetalert2";



type Props = {
	setPkmCount: (pkmCount: number) => void,
	pkmCount: number,
	setCardsManually: (pokemonNames: PokemonName[]) => void,
	manually: boolean,
	setManually: (manually: boolean) => void,
	setTwoPlayers: (twoPlayers: boolean)=> void
}

const dataPokemonNames: PokemonNames = pokemonsNames;

export default function Settings({ setTwoPlayers, setPkmCount, pkmCount, setCardsManually, manually, setManually }: Props) {


	const [searchValue, setSearchValue] = useState("");
	const [suggestions, setSuggestions] = useState<PokemonName[]>([]);
	const [tags, setTags] = useState<PokemonName[]>([]);
	const [showSettings, setShowSettings] = useState(false);


	/**
	 * get changes of pkmCount, select cards and searchPkm
	 * @param e ChangeEvent
	 */
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		switch (target.name) {

		case "pkmsCount":
			setPkmCount(Number(target.value));
			break;

		case "selectCards":
			if (target.id === "selectCardsManually") {
				setManually(true);
			} else {
				setManually(false);
			}
			break;

		case "select-players":
			if(target.id === "2-players"){
				setTwoPlayers(true);
			}else{
				setTwoPlayers(false);
			}
			console.log("hola");

			break;

		case "searchPkm":
			setSearchValue(target.value);
			handleSearch(target.value);
			break;

		default:
			break;
		}
	};


	/**
	 * set suggestions when write
	 * @param value value to search
	 * @returns void
	 */
	const handleSearch = (value: string) => {

		if (value === "") {
			setSuggestions([]);
			return;
		}

		// filter names that included searchValue
		const suggestions = dataPokemonNames.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(value.toLowerCase()));

		setSuggestions(suggestions);
	};

	/**
	 * get the value of li element and set searchValue and set suggestions
	 * @param suggestion value of li element
	 */
	const handleSuggestionClick = (suggestion: string) => {
		setSearchValue(suggestion);
		setSuggestions([]);
	};


	/**
	 * check if valueSearch is valid
	 * no more pokemons that pkmCount
	 * check if pokemon exist
	 * check no repeat 
	 * @returns boolean
	 */
	const checkValueSearch = (dataPokemonNames: PokemonNames, searchValue: string, pkmCount: number) => {


		if (searchValue === "") return false;

		// no add more pokemons that pkmCount
		if (tags.length >= pkmCount) {
			console.log("don't can't add more pokemons");
			Swal.fire({
				title: "Error",
				text: "No se pueden añadir más Pokemons",
				icon: "error"
			})
				.catch(e => { console.error("Error: ", e); });
			return false;
		}

		// check searchValue is a valid pokemon name
		const some: boolean = dataPokemonNames.pokemons.some((pokemon: PokemonName) => {
			return pokemon.name === searchValue.toLowerCase();
		});

		// if searchValue no valid
		if (!some) {
			Swal.fire({
				title: "Error",
				text: `El Pokemon ${searchValue} no se encuentra`,
				icon: "error"
			})
				.catch(e => { console.error("Error: ", e); });
			console.log("search value no valid");
			return false;
		}

		// check to not repeat tags
		const included = tags.some(tag => tag.name === searchValue.toLowerCase());
		if (included) {
			Swal.fire({
				title: "Error",
				text: `El Pokemon ${searchValue} ya está seleccionado`,
				icon: "error"
			})
				.catch(e => { console.error("Error: ", e); });
			console.log("the pokemon was included");
			return false;
		}



		// all good return true
		return true;
	};

	/**
	 * set tagsState
	 * @param e MouseEvent
	 * @returns void
	 */
	const handleAddTagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();


		// check valueSearch
		const check = checkValueSearch(dataPokemonNames, searchValue, pkmCount);
		if (!check) return;

		// add valueSearch to tags state
		setTags(prev => {

			const pokemonTag = dataPokemonNames.pokemons.find(pokemon => pokemon.name === searchValue);

			if (pokemonTag === undefined) return [];
			setCardsManually([...prev, pokemonTag]);

			return [...prev, pokemonTag];
		});



		// reset valueSearch
		setSearchValue("");

	};


	const handleCloseClick = (tag: PokemonName) => {
		setTags(prev => {
			const pkmFiltered = prev.filter(prevTag => prevTag.name !== tag.name);
			setCardsManually([...pkmFiltered]);
			return pkmFiltered;
		});

	};

	// const handleConfirmClick =(e : React.MouseEvent<HTMLButtonElement>)=>{
	// 	e.preventDefault();
	// 	if(pkmCount !== tags.length){
	// 		console.log(`You need to select ${pkmCount} cards`);
	// 		return;
	// 	}


	// };




	return (
		<div className={showSettings ? "settings show-settings" : "settings"}>

			<span
				className="show-settings-button"
				onClick={() => { setShowSettings(prev => !prev); }}
			>	
				{showSettings ? 
					(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
					</svg>)
					: (
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" width="20px">
							<path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
						</svg>
					)
				}
				

				


			</span>
			<div className="settings-container">

				<h1>Settings</h1>
				<form id="pkmsCountForm">
					<div className='input-element'>
						<label htmlFor="pkmsCount">Select number of pairs:</label>
						<input className="pkmCount" type="number" name="pkmsCount" min="3" max="15" onChange={handleChange} value={pkmCount} />
					</div>

					<div className="players">
						<h3>Select players</h3>
						<label htmlFor="1-player" className="mr-1">
							<input 
								type="radio" 
								name="select-players"
								id="1-player"
								defaultChecked
								onChange={handleChange}
							/>
							1 Player
						</label>
						<label htmlFor="2-players">
							<input 
								type="radio" 
								name="select-players"
								id="2-players"
								onChange={handleChange}
							/>
							2 Players
						</label>
					</div>

					<div className="select-cards">
						<h3>Select cards</h3>

						<div className="mb-1">
							<label htmlFor="selectCardsRandomly" className="mr-1">
								<input
									type="radio"
									name="selectCards"
									id="selectCardsRandomly"
									defaultChecked
									onChange={handleChange}
								/>
								Randomly
							</label>


							<label htmlFor="selectCardsManually">
								<input
									type="radio"
									name="selectCards"
									id="selectCardsManually"
									onChange={handleChange}
								/>
								Manually
							</label>
						</div>

						{
							manually &&

							<div className="min-content">
								<div className="input-element">
									<div className="search-container">
										<input
											type="text"
											id="searchInput"
											placeholder="Search.."
											autoComplete="off"
											name="searchPkm"
											onInput={handleChange}
											value={searchValue}
										/>
										<ul id="suggestionList">
											{
												suggestions.map((suggestion, index) => (
													<li
														key={index}
														onClick={() => { handleSuggestionClick(suggestion.name); }}
													>
														{suggestion.name}
													</li>
												))
											}
										</ul>
									</div>
									<button onClick={handleAddTagClick}>add</button>
								</div>




								<div className="tags-container">
									{

										tags.map((tag) => (
											<div key={tag.id} className="tag" data-id={tag.id}>
												<div>
													{tag.name}
												</div>

												<span className="tag-close" onClick={() => { handleCloseClick(tag); }}>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20px">
														<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
													</svg>

												</span>


											</div>
										))
									}
								</div>


							</div>

						}

					</div>
				</form>
			</div>



		</div>
	);
}
