import { Pokemon } from "@/types/Pokemon";

type props = {
	pokemon: Pokemon
}

export default function Card({pokemon}:props) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="card-front">
					<img src={pokemon.sprites.other?.["official-artwork"].front_default} alt="" />
				</div>
				<div className="card-back">
					{/* <img  src="./pokemon_card_backside.jpg" alt={pokemon.name} /> */}
				</div>
			</div>
			
		</div>
	);
}

