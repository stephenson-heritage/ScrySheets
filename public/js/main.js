let setTemplate = null;
let setList = null;

window.addEventListener('load', async (e) => {
	let setsResponse = (await fetch('/api/sets')).json();
	let setTemplateFetch = (await (fetch('templates/sets.hbs'))).text();


	let promises = await Promise.all([setTemplateFetch, setsResponse]);

	let sets = promises[1];

	setTemplate = Handlebars.compile(promises[0]);

	setList = sets.content.data.filter(set => set.set_type == "expansion" || set.set_type == "core");


	for (let set in setList) {
		//console.log(setList[set].code);

		let setCards = await (await fetch('/api/sets/' + setList[set].code)).json();
		if (setCards.content === null) {
			setList[set].new_cards = 0;
		} else {
			setList[set].new_cards = setCards.content.total_cards;
		}


	}

	let setsDiv = document.createElement('div');
	setsDiv.innerHTML = setTemplate(setList);
	document.body.appendChild(setsDiv);
});
