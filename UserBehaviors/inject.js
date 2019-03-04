if(!window.contentScriptInjected){
	contentScriptInjected = true; // global scope
	var isKeyPress = false;
	var isMouseClick = false;
	var isMouseMove = false;
	var isMouseWheel = false;
	var title = document.title;

	// console.log("I am here 3");

	document.addEventListener("keypress", function(event) {
	    // console.log("keypress");
	    isKeyPress = true;
	    sendMsg();
	})
	document.addEventListener("click", function(){
		// console.log("mouseclick");
		isMouseClick = true;
		sendMsg();
	});
	document.addEventListener("mousemove", function(){
		// console.log("mousemove");
		isMouseMove = true;
		sendMsg();
	});
	document.addEventListener("wheel", function(){
		// console.log("mousewheel");
		isMouseWheel = true;
		sendMsg();
	});

	function sendMsg() {
		// console.log("sendMsg");
		chrome.runtime.sendMessage({type: "data", options: { 
			isKeyPress : isKeyPress,
			isMouseClick : isMouseClick,
			isMouseMove : isMouseMove,
			isMouseWheel : isMouseWheel,
			title : title
		}});
	}
}