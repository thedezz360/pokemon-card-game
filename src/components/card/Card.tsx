import { Pokemon } from "@/types/Pokemon";
import { useState } from "react";

type props = {
	pokemon: Pokemon
}

export default function Card({pokemon}:props) {

	const [girar, setGirar] = useState(false);

	const handleClick= () =>{
		setGirar(true);
	};

	return (
		<div 
			className="card" 
			onClick={handleClick}
		>
			<div className={girar ? "card-content girar" : "card-content"}>
				<div className="card-front">
					<img  src={pokemon.sprites.other?.["official-artwork"].front_default} alt={pokemon.name} />
					<p>{pokemon.name}</p>
				</div>
				<div className="card-back">
					<img  src="./pokemon_card_backside.jpg" alt={pokemon.name} />
				</div>
			</div>
			
		</div>
	);
}

