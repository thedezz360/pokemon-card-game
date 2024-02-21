import { Pokemon } from "../types/Pokemon";

const fetchAllPokemons = async () => {
	console.log("fetch");
	const pokemonsNames: string[] = [];
	// 1025
	for (let i = 1; i < 1025; i++) {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
		if (!response.ok) {
			console.error("Error to fetch pokemon");
		}

		const pokemon = await response.json() as Pokemon;

		pokemonsNames.push(`{
				"name":"${pokemon.name}",
				"id":${pokemon.id}
			}`);
	}
		
	return pokemonsNames;
};

export const generarArchivo = () => {
	console.log("generar archivo");
	fetchAllPokemons().then(data => {
		let contenido = data.join(",");
		console.log(contenido);
		contenido = `[${contenido}]`;
			
		// creamos objeto blob con el contenido
		const blob = new Blob([contenido], {type:"text/plain	"});

		// crear enlace link
		const enlaceDescarga = document.createElement("a");
		enlaceDescarga.href = URL.createObjectURL(blob);

		// establecer el nombre del archivo
		enlaceDescarga.download = "pokemonsName";

		// simular un click
		enlaceDescarga.click();

		// liberar recursos
		URL.revokeObjectURL(enlaceDescarga.href);
			
	})
		.catch(e => {
			console.error("Error:", e);
		});

};
