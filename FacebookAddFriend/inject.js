if(!window.contentScriptInjected){
	contentScriptInjected = true; // global scope
	console.log("Injected")
}

window.addEventListener("message", function(event) {
	console.log(event);
})