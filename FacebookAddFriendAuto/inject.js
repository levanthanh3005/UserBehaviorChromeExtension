// this is the code which will be injected into a given page...

(function() {

	console.log("inject here");
	
	var maxRequest = 100;

	window.scrollTo(0,0);

	function runAddFriend(index) {
		lsClass = document.getElementsByClassName("FriendRequestAdd");
		// lsClass = document.getElementsByClassName("friendBrowserNameTitle");

		if (index >= maxRequest) {
			console.log("Thats enough");
			return;
		}

		// if ($("button").hasClass("layerConfirm")) {
		// 	console.log("Stoppppppp");
		// 	$("layerConfirm").click();
		// 	return;
		// }

		var layerConfirm = document.getElementsByClassName("layerConfirm");

		//If it isn't "undefined" and it isn't "null", then it exists.
		if(layerConfirm.length > 0){
			console.log("Stoppppppp");
			console.log(layerConfirm);
		    return;
		}

		setTimeout(function(){
			console.log("click:"+index);
			lsClass[index].focus();
			var cName = lsClass[index].className;
			console.log(cName + " "+ cName.includes("hidden"))
			if (!cName.includes("hidden")) {
				console.log(lsClass[index].className);
				var name = lsClass[index].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[0].textContent;
				console.log(name);
				var test = name.toLowerCase().replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '');
				if (name.toLowerCase() == test) {
					console.log("test done: "+test);
					lsClass[index].click();
					// lsClass[index].hover();
				}
			}
			runAddFriend(index+1);
		},1000);
	}

	// var numOfScroll = 0;

	// function scrollToButtom(index){
	// 	if (index >= numOfScroll) {
	// 		window.scrollTo(0,0);
	// 		runAddFriend(0);
	// 		return;
	// 	}
	// 	setTimeout(function(){
	// 		console.log("scroll:"+index);
	// 		window.scrollTo(0,document.body.scrollHeight);
	// 		scrollToButtom(index+1);
	// 	},2000);

	// }
	// scrollToButtom(0);
	runAddFriend(0);
	// console.log(lsClass)
})();