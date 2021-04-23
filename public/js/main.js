window.addEventListener('load', async (e) => {
	let sets = await (await fetch('/api/sets')).json();
	//console.log(sets);


	let setsDiv = document.createElement('div');
	for (let set in sets.content.data) {
		console.log(set.code);
	}

	document.body.appendChild(setsDiv);
});
