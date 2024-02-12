import { useEffect, useState } from "react";

import Card from "@/components/card/Card";

import { Pokemon } from "@/types/Pokemon";
import { generateRandomNum } from "@/utils/utils";

export default function BoardGame() {

	const url = "https://pokeapi.co/api/v2/pokemon";
	
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [pkmsCount , setPkmsCount] = useState<number | null>(null);
	

	useEffect(() => {
		//si no se ha elegido una cantidad, return
		if(pkmsCount === null) return;

		// limpiamos el array
		setPokemons([]);

		const fetchData = async () => {
			try {
				
				let updatedPokemons:Pokemon[] = [];
				
				const randomNums = generateRandomNum(1, 100, pkmsCount);
				
				for (let i = 0; i < randomNums.length; i++) {

					const response = await fetch(`${url}/${randomNums[i]}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (!response.ok) {
						throw new Error("No se pudo obtener la información");
					}

					const data = await response.json() as Pokemon;

					updatedPokemons = [...updatedPokemons, data];
				}

				setPokemons(prevPokemons => [...prevPokemons, ...updatedPokemons, ...updatedPokemons]);
			
			} catch (error) {
				console.error("Error al obtener datos:", error);
			}
		};

		fetchData()
			.catch(error => {console.error(error);});
	}, [pkmsCount]);


	const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
		e.preventDefault();
		const form = document.getElementById("pkmsCountForm") as HTMLFormElement;

		const formData = new FormData(form);

		//obtenenemos el valor del formData
		const data = formData.get("pkmsCount");
		
		if(data){
			// convertimos el valor a numero
			const n = Number(data);
			if(!isNaN(n)){
				// establecemos el valor de pkmsCount
				setPkmsCount(n);
			}else{
				console.error("No se pudo convertir el valor númerico");
			}
		}else{
			console.error("No se encontro la entrada en el formData");
		}

	

	};

	return (
		<div className="container">
			<div>Pokemon card game</div>

			<form id="pkmsCountForm" onSubmit={handleSubmit} >
				<label htmlFor="pkmsCount">Seleccione la cantidad de parejas:</label>
				<input type="number" name="pkmsCount" min="3" max="15" />
				<button>Ok</button>
			</form>
			<div className="board">
				{pokemons.map((pokemon, index) => {
					return (
			
						<Card key={index} pokemon={pokemon} />
					);
				})}

			</div>
		</div>
	);
}
