export const generateRandomNum = (min:number, max:number, count:number):number[]=>{
	const nums:number[] = [];

	for(let i = 0 ; i < count; i++){
		let num:number = Math.floor(Math.random() * ((max-1 )- min) + min);

		while(nums.includes(num)){
			num = Math.floor(Math.random() * ((max-1 )- min) + min);
		}

		nums.push(num);

	}



	return nums;
};