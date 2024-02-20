import { ChangeEvent, useState } from "react";
import pokemonsNames from "../../pokemonsNames.json";
import "./Settings.css";
// import { Pokemon } from "../../types/Pokemon";

type PokemonName = {
	name: string
}
type PokemonNames = {
	pokemons: PokemonName[]
}

type Props = {
	setPkmCount: (pkmCount: number) => void,
	pkmCount: number
}

const dataPokemonNames: PokemonNames = pokemonsNames;

export default function Settings({ setPkmCount, pkmCount }: Props) {

	const [manually, setManually] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [suggestions, setSuggestions] = useState<PokemonName[]>([]);
	const [tags, setTags] = useState<string[]>([]);


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
	 * @returns boolean
	 */
	const checkValueSearch = () => {

		// check searchValue is a valid pokemon name
		const some = dataPokemonNames.pokemons.some(pokemon => {
			return pokemon.name === searchValue.toLowerCase();
		});

		// if searchValue no valid
		if (!some) {
			console.log("search value no valid");
			return false;
		}

		// check to not repeat tags
		const included = tags.includes(searchValue.toLowerCase());
		if(included){
			console.log("the pokemon was included");
			return false;
		}

		// no add more pokemons that pkmCount
		if(tags.length >= pkmCount){
			console.log("don't can't add more pokemons");
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
		const check = checkValueSearch();
		if (!check) return;

		// add valueSearch to tags state
		setTags(prev => {
			return [...prev, searchValue];
		});

	};




	return (
		<div className="settings">
			<div className="settings-container">

				<h1>Settings</h1>
				<form id="pkmsCountForm">
					<div className='input-element'>
						<label htmlFor="pkmsCount">Select number of pairs:</label>
						<input type="number" name="pkmsCount" min="3" max="15" onChange={handleChange} value={pkmCount} />
					</div>

					<div className="select-cards">
						<h3>Select cards</h3>

						<label htmlFor="selectCardsRandomly">
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

						{
							manually &&

							<div className="search-container">
								<div className="input-element">
									<input
										type="text"
										id="searchInput"
										placeholder="Search.."
										autoComplete="off"
										name="searchPkm"
										onInput={handleChange}
										value={searchValue}
									/>
									<button onClick={handleAddTagClick}>add</button>
								</div>
								


								<div className="tags-container">
									{

										tags.map((tag, index) => (
											<div key={index} className="tag"> 
												<span>{tag}</span>
												<span>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20px">
														<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
													</svg>

												</span>
											</div>
										))
									}
								</div>

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
						}

					</div>
				</form>
			</div>



		</div>
	);
}
