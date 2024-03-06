import { PokemonMin } from "../../types/Pokemon";
import "./CardPokemon.css";

type props = {
	pokemon : 			PokemonMin,
	handleChoice : 	(card: PokemonMin)=> void,
	flipped: 				boolean | undefined,
	disabled:				boolean
}

export default function CardPokemon({
	pokemon, 
	handleChoice, 
	flipped,
	disabled
} : props) {

	const handleClick = ()=>{
		// while disabled false, we can call handleChoice
		if(!disabled){
			handleChoice(pokemon);
		}
	};

	

	return (
		<div
			className='card'
		>
			
			<div className={flipped ? "flipped card-content" : "card-content"}>
				<div className={pokemon.matched ? "flash front" : "front"}>
					<img
						src={pokemon.img}
						alt={pokemon.name + " img"}
					/>
					<p>{pokemon.name}</p>
				</div>
				<img
					src="pokemon_card_backside.webp"
					alt="card back"
					className='back'
					onClick={handleClick}
				/>
			</div>
		</div>
	);
}