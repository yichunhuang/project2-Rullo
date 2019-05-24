
function onSuccess(googleUser) {
	console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
	let profile = googleUser.getBasicProfile();
	document.getElementById("nav_login").style.display = "none";
	document.getElementById("nav_logined").innerHTML = "Hello, " + googleUser.getBasicProfile().ig;
	document.getElementById("signout").innerHTML = "Signout";
	document.getElementById("myplan_nav").innerHTML = "My Plans";
	let id_token = googleUser.getAuthResponse().id_token;
	let email = profile.getEmail();
	let user = {
		"email": email,
		"id_token": id_token
	};
	let data = JSON.stringify(user);
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '../member/signin');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function () {
		let resultp = xhr.responseText;
		let result = JSON.parse(resultp);
		$("#emailg").text(result.email);
		$("#nav_pic").attr('src', result.image);
		$('#toast_login').toast('hide')
		document.getElementById("idtoken").innerHTML = "<input type=hidden id='idToken' value='" + result.name + "'>";
	};
	xhr.send(data);
}

function onFailure(error) {
	console.log(error);
}
function renderButton() {
	gapi.signin2.render('my-signin2', {
		'scope': 'profile email',
		'width': 240,
		'height': 50,
		'longtitle': true,
		'theme': 'dark',
		'onsuccess': onSuccess,
		'onfailure': onFailure
	});
}
function login() {
	$('#toast_login').toast('show')
}
function signOut() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '../member/signout');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function () {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			// $(".g-signin2").css("display", "block");
			// $(".data").css("display", "none");
			//document.getElementById("idtoken").style.display = "none";
			// document.getElementById("byeuser").style.display = "block";
			var url = "./index";
			window.location.assign(encodeURI(url));
		});
	};
	xhr.send();
}
function private() {
	var req = new XMLHttpRequest();
	req.open("POST", "../member/accesstoken");//post到signin.js 
	let cookie_accessToken = document.cookie.replace('access_token=', '');//document.cookie存的access token
	req.setRequestHeader("Authentication", 'Bearer ' + cookie_accessToken);//前端設定，後端接收的到:req.get('Authentication');
	req.onload = function () {
		var resultp = req.responseText;//responseText抓signin.js檔中res.send的值
		var result = JSON.parse(resultp);
		if (result.error) {
			alert("Please login in first!");
		} else {
			console.log("signin");
			let b = document.getElementById("idToken").value;//登入時寫下的 user name
			var url = "./indexuser" + "?" + "name=" + b;
			window.location.assign(encodeURI(url));
		}
	};
	req.send();
}