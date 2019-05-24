const decodeURL = decodeURI(location.search);//https://17runa.com/day?plan_id=2 如：?plan_id=2
const pureURL = decodeURL.split("?")[1];//如：plan_id=2
const planId = pureURL.substring(8);//如：plan_id= 之後的值

//跟Google Calendar相關,如果按了匯入,成功後url會加:&insertcalendar=ok
let URL = decodeURL.split("&")[1];
if (URL != undefined) {
	let c = URL.substring(15);//insertcalendar=之後
	if (c == "ok") {
		alert("already inserted calendar");
	}
}
//Day blocks
function dayBlock() {
	var req = new XMLHttpRequest();
	req.open("GET", "https://17runa.com/days?plan_id=" + planId);
	req.onreadystatechange = function () {
		if (req.readyState === 4 && req.status === 200) {
			let result = JSON.parse(req.responseText);//JSON.parse:將字串轉換成物件
			const { topic, period, goal, status, rules, trigger, punish, time } = result;
			//My Plan
			if (status == 1) {
				//console.log("公開");
				document.getElementById("category").innerHTML = '<select name="category" id="status" >' + '<option class="form-control" value="1">公開</option>' + '<option class="form-control" value="0">私密</option>' + '</select>';
			} else {
				//console.log("私密");
				document.getElementById("category").innerHTML = '<select name="category" id="status">' + '<option class="form-control" value="0">私密</option>' + '<option class="form-control" value="1">公開</option>' + '</select>';
			}
			document.getElementById("topic").innerHTML = '<input type="text"  class="input" style=" border-radius: 10px;" name="topic" id=topictext value=' + topic + '>';
			document.getElementById("period").innerHTML = '<input type="text" class="input"  style=" border-radius: 10px;" name="period" id=periodtext value=' + period + '>';
			document.getElementById("goal").innerHTML = '<input type="text" class="input"  style=" border-radius: 10px;" name="goal" id=goaltext value=' + goal + '>';
			document.getElementById("Rules-length").value = rules.length;
			document.getElementById("myPlan").style.display = "none";

			document.getElementById("addrules").innerHTML = "每日事項 Rules: " + '<i class="fas fa-plus-circle" style="color:#007bff; padding: 0 0 0 12px;" class="myMOUSE" onclick=addplanRule("planRule","rulestext")></i>';
			var rulesDiv = "<div>";
			rulesDiv += '<table id="planOldRule">';
			for (let i = 0; i < rules.length; i++) {
				rulesDiv += '<tr><td><input type="text" class="input" style="border-radius: 10px;width:600px;" name="rulestext" value=' + rules[i] + '>';
				rulesDiv += ' <i class="fas fa-times-circle" style="color:#007bff;" onClick="removeOldRule(this)"></i></div>'
			}
			rulesDiv += '<table id="planRule"></table>';
			document.getElementById("rules").innerHTML = rulesDiv;

			document.getElementById("addtrigger").innerHTML = "定時通知 Trigger: " + '<i class="fas fa-plus-circle" style="color:#007bff; padding: 0 0 0 10px;" class="myMOUSE" onclick=addplanTrigger("planTrigger","triggertext","trigtime")></i>';
			var triggerDiv = "<div>";
			triggerDiv += '<table id="planOldTrigger">';
			for (let i = 0; i < trigger.length; i++) {
				triggerDiv += '<tr><td>To do :<input type="text" class="input" style=" border-radius: 10px;width:600px;" name="triggertext"  value=' + trigger[i].trig + '>';
				triggerDiv += ' <i class="fas fa-times-circle" style="color:#007bff;" onClick="removeOldtrigger(this)"></i></div>';
				triggerDiv += "<div>Time  : ";
				triggerDiv += '<input type="text" class="input" name="trigtime"  style=" border-radius: 10px;width:600px;" value=' + trigger[i].time + '></div><br></td></tr>';
			}
			triggerDiv += '</table><table id="planTrigger"></table>';
			triggerDiv += '<div id="hiddenPlanTrigger" ></div>';
			document.getElementById("trigger").innerHTML = triggerDiv;

			document.getElementById("addpunish").innerHTML = "處罰事項 Punishment: " + '<i class="fas fa-plus-circle" style="color:#007bff; padding: 0 0 0 10px;" class="myMOUSE" onclick=addplanRule("planPunish","punishtext")></i>';
			var punishDiv = "<div>";
			punishDiv += '<table id="planOldPunish">';
			for (let i = 0; i < punish.length; i++) {
				punishDiv += '<tr><td><input type="text" class="input" name="punishtext"  style=" border-radius: 10px;width:600px;"  value=' + punish[i].punishment + '>';
				punishDiv += ' <i class="fas fa-times-circle" style="color:#007bff;" onClick="remove(this)"></i></div></td></tr>';
			}
			punishDiv += '<table id="planPunish"></table>';
			document.getElementById("punish").innerHTML = punishDiv;
			//My Plan End

			//Day blocks:time
			let now;
			for (let i = 0; i < period; i++) {
				let j = i + 1;
				let a = parseInt(time[i]);
				now = new Date(a);// Fri Apr 19 2019 11:27:00 GMT+0800 (台北標準時間)
				var date = now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
				var eachDaysDiv = document.getElementById("each-day-day");
				var newDiv = document.createElement("div");
				var data = "<div class='card' style='width: 48rem; margin:25px 0 0 70px;float:left;'><div class='card-body'><h5 class='card-title' style='padding: 0 550px 0 0;float: left;'>Day";
				data += j + "</h5>" + "<h5 class='card-title' >" + date + "</h5><p class='card-text' id='planning" + i + "'></p>";
				data += "<button type='button' id='editbutton" + i + "' style ='border-radius: 10px;background-color:#ff8080;border-color:#ff8080;color:#f5f5f5;' onclick=\"perDayButton('" + j + "')\"></button></div></div>";
				newDiv.innerHTML = data;
				eachDaysDiv.appendChild(newDiv);
			}
			//Day blocks:number 
			dayNum(period);
		}
	}
	req.send();
}
dayBlock();
function dayNum(period) {
	for (let i = 0; i < period; i++) {
		let j = i + 1;
		dayContent(i, j);//Day blocks:content
	}
}
function dayContent(i, j) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://17runa.com/perDay?DAY=" + j + "&" + "plan_id=" + planId);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			let result2 = JSON.parse(xhr.responseText);//JSON.parse:將字串轉換成物件
			const { planning } = result2;
			if (planning.length == 0) {
				let p = "快來新增計畫吧！";
				document.getElementById("planning" + i).innerHTML = p;
				document.getElementById("editbutton" + i).innerText = "新增計畫";
			} else {
				let p = "今日計畫：";
				p += planning[0].plan;
				document.getElementById("planning" + i).innerHTML = p;
				document.getElementById("editbutton" + i).innerText = "編輯計畫";
			}
		}
	}
	xhr.send();
}

function perDayButton(j) {
	var url = "./eachDay" + "?" + "DAY=" + j + "&" + "plan_id=" + planId;
	window.location.assign(encodeURI(url));
}
//Day blocks End

//My Plan
function myPlan() {
	let a = document.getElementById("myPlan");
	if (a.style.display == "none") {
		a.style.display = "block";
		document.getElementById("my_plan").style.color = "pink";
	}
	else {
		a.style.display = "none"
		document.getElementById("my_plan").style.color = "white";
		document.getElementById("my_plan").style.borderColor = "#0066cc";
	}
}
function editMyPlan() {
	var category = document.getElementById("status").value;
	var topic = document.getElementById("topictext").value;
	var period = document.getElementById("periodtext").value;
	var goal = document.getElementById("goaltext").value;
	var trigger = document.getElementsByName("triggertext");
	var trigtime = document.getElementsByName("trigtime");
	var rules = document.getElementsByName("rulestext");
	// var hiddenplanRulenum = document.getElementById("hiddenplanRulenum").value;
	var punish = document.getElementsByName("punishtext");
	//console.log(plan_image);
	var user = {
		//"image":image.name,
		"category": category,
		"plan_id": plan_id,
		"topic": topic,
		"period": period,
		"goal": goal
	};
	var o = {};
	var a = [];
	var c = [];
	for (let i = 0; i < trigger.length; i++) {
		var t = "trigger" + i;
		a.push(trigger[i].value);
		c.push(trigtime[i].value);
	}
	o.trigger = a;
	o.time = c;
	user.trigger = o;

	let b = [];
	for (let i = 0; i < parseInt(rules.length); i++) {
		b.push(rules[i].value);
	}
	user.rules = b;
	let d = [];
	for (let i = 0; i < parseInt(punish.length); i++) {
		d.push(punish[i].value);
	}
	user.punish = d;
	var data = JSON.stringify(user);
	console.log(data);
	var req = new XMLHttpRequest();
	req.open("POST", "../editPlan");
	req.setRequestHeader("Content-Type", "application/json; charset=UTF-8", "form-data");
	req.onload = function () {
		var result = JSON.parse(req.responseText);
		console.log(result);
		if (result.error) {
			alert("更新失敗！");
		} else {
			alert("更新成功！");
			history.go(0);
		}

	};

	req.send(data);
}
function addplanTrigger(id, trigger, time) {
	let count;
	var table = document.getElementById(id);
	var rownum = table.rows.length;
	var row = table.insertRow(rownum);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = '<div>To do: <input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + trigger + '">' + '<i class="fas fa-times-circle" style="color:pink;" onClick="removetrigger(this)"></i></div>' + '<div>Time: <input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + time + '"></div><br>';
	count = rownum + 1; //代表table #row;
	count = rownum + 1; //代表table #row
	var hiddens = document.getElementById("hiddenPlanTrigger");
	hiddens.innerHTML = "<input type=hidden name='hiddenPlanTriggernum' value= " + count + ">";
}
function addplanRule(id, name) {
	var table = document.getElementById(id);
	var rownum = table.rows.length;
	var row = table.insertRow(rownum);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = '<div><input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + name + '">' + '<i class="fas fa-times-circle" class="myMOUSE" style="color:pink;" onClick="remove(this)"></i>';;
	count = rownum + 1; //代表table #row
	// var hiddens = document.getElementById("hiddenplanRule");
	// hiddens.innerHTML = "<input type=hidden id='hiddenplanRulenum' value= " + count + ">";
}
function removetrigger(button) {
	button.closest('tr').remove();
	document.querySelector("#hiddenPlanTrigger input").value = parseInt(document.querySelector("#hiddenPlanTrigger input").value) - 1;
}
function removeOldtrigger(button) {
	button.closest('tr').remove();
	//  document.querySelector("#hiddenPlanOldTrigger input").value = parseInt(document.querySelector("#hiddenPlanTrigger input").value) - 1;
}
function remove(button) {
	button.closest('tr').remove();
}
function editImage() {
	var image = $('#i')[0].files[0];
	var formdata = new FormData();
	formdata.append('image', image);
	formdata.append('plan_id', plan_id);
	$.ajax({
		url: '/editImage',
		data: formdata,
		contentType: false,
		processData: false,
		type: 'POST',
		'success': function (data) {
			if (data.error) {
				alert("更新失敗！");
			} else {
				alert(data.success);
			}
		}
	});
}
//My Plan End

function calendar() {
	var url = "../calendar" + "?" + "id=" + plan_id;
	window.location.assign(encodeURI(url));
}

function back() {
	history.go(-1);
	//home page 的＋ 要變成topic
	// var url = "./index.html";
	// window.location.assign(encodeURI(url));
}

function reptile(key) {
	var req = new XMLHttpRequest();
	req.open("GET", "https://17runa.com/bug?a=" + key);
	req.onreadystatechange = function () {
		if (req.readyState === 4 && req.status === 200) {
			let result = JSON.parse(req.responseText);//JSON.parse:將字串轉換成物件
			const { title, image, href } = result;
			let show = "";
			for (var i = 0; i < 5; i++) {
				show += "<div class='card' style='width: 12rem;'><img src='" + image[i] + "' class='card-img-top' style='margin-top:20px;' ><div class='card-body'><a href='" + href[i] + "' target='_blank'>" + title[i] + "</a></div></div><br>";
			}
			document.getElementById("left-ad").innerHTML = show;
		}
	}
	req.send();
}
let key = ['python', 'Java', '機器學習', '人工智慧', 'MySQL', 'NoSQL', '演算法', '廚藝'];
let a = Math.floor(Math.random() * 8); //0-7
reptile(key[a]);
document.write('<script src="googleLogin.js" ></script>');



