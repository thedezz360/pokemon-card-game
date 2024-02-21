import { ChangeEvent, useState } from "react";
import pokemonsNames from "../../pokemonsNames.json";
import "./Settings.css";
import { PokemonName, PokemonNames } from "../../types/Pokemon";



type Props = {
	setPkmCount: (pkmCount: number) => void,
	pkmCount: number,
	setCardsManually : (pokemonNames: PokemonName[])=>void,
	manually: boolean,
	setManually:(manually:boolean)=>void
}

const dataPokemonNames: PokemonNames = pokemonsNames;

export default function Settings({ setPkmCount, pkmCount, setCardsManually, manually, setManually }: Props) {

	
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
		const included = tags.some(tag => tag.name === searchValue.toLowerCase());
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

			const pokemonTag = dataPokemonNames.pokemons.find(pokemon => pokemon.name === searchValue);

			if(pokemonTag === undefined) return[];

			return [...prev, pokemonTag];
		});

		// reset valueSearch
		setSearchValue("");

	};


	const handleCloseClick = (tag:PokemonName)=>{
		setTags(prev => {
			return prev.filter(prevTag => prevTag.name !== tag.name );
		});

	};

	const handleConfirmClick =(e : React.MouseEvent<HTMLButtonElement>)=>{
		e.preventDefault();
		if(pkmCount !== tags.length){
			console.log(`You need to select ${pkmCount} cards`);
			return;
		}
		
		setCardsManually(tags);
	};




	return (
		<div className={showSettings ? "settings show-settings" : "settings"}>

			<span 
				className="show-settings-button" 
				onClick={()=>{setShowSettings(prev => !prev);}}
			> 
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" width="20px">
					<path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>

			</span>
			<div className="settings-container">

				<h1>Settings</h1>
				<form id="pkmsCountForm">
					<div className='input-element'>
						<label htmlFor="pkmsCount">Select number of pairs:</label>
						<input className="pkmCount" type="number" name="pkmsCount" min="3" max="15" onChange={handleChange} value={pkmCount} />
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
												
												<span className="tag-close" onClick={()=>{handleCloseClick(tag);}}>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20px">
														<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
													</svg>

												</span>

												
											</div>
										))
									}
								</div>

								<button onClick={handleConfirmClick}>Confirm cards</button>
							</div>
							
						}

					</div>
				</form>
			</div>



		</div>
	);
}
