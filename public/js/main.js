let setTemplate = null;
let setList = null;

window.addEventListener('load', async (e) => {
	let setList = (await fetch('/api/sets/allsets')).json();
	let setTemplateFetch = (await (fetch('templates/sets.hbs'))).text();


	let promises = await Promise.all([setTemplateFetch, setList]);



	setTemplate = Handlebars.compile(promises[0]);



	let setsDiv = document.createElement('div');
	setsDiv.innerHTML = setTemplate(promises[1]);
	document.body.appendChild(setsDiv);
});
