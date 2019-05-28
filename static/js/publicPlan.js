const decodeURL = decodeURI(location.search);
const pureURL = decodeURL.split("?")[1];
const planId = pureURL.substring(8);

//跟Google Calendar相關,如果按了匯入,成功後url會加:&insertcalendar=ok
let URL = decodeURL.split("&")[1];
if (URL != undefined) {
    let c = URL.substring(15);
    if (c == "ok") {
        alert("already inserted calendar");
    }
}
//Public plans: Day blocks
function publicDayBlock() {
    var req = new XMLHttpRequest();
    req.open("GET", "https://17runa.com/days?plan_id=" + planId);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let result = JSON.parse(req.responseText);//JSON.parse:將字串轉換成物件
            const { topic, period, goal, status, rules, trigger, punish, time, user_name } = result;
            console.log(user_name);
            document.getElementById("user_plan").innerHTML = user_name + " 的計畫";
            document.getElementById("category").innerHTML = '計畫公開與否: 公開';
            document.getElementById("topic").innerHTML = "主題: " + topic;
            document.getElementById("period").innerHTML = "時長: " + period + " 日";
            document.getElementById("goal").innerHTML = "目標: " + goal;
            document.getElementById("Rules-length").value = rules.length;
            document.getElementById("myPlan").style.display = "none";
            var rulesDiv = "<div>每日事項: ";
            for (let i = 0; i < rules.length; i++) {
                j = i + 1;
                rulesDiv += j + ". " + rules[i] + "  ";
            }
            document.getElementById("rules").innerHTML = rulesDiv;
            var triggerDiv = "<div>定時通知: ";
            for (let i = 0; i < trigger.length; i++) {
                j = i + 1;
                triggerDiv += j + ". " + trigger[i].time + " : ";
                triggerDiv += trigger[i].trig;
            }
            document.getElementById("trigger").innerHTML = triggerDiv;
            var punishDiv = "<div>處罰事項: ";
            for (let i = 0; i < punish.length; i++) {
                j = i + 1;
                punishDiv += j + ". " + punish[i].punishment + "  ";
            }
            document.getElementById("punish").innerHTML = punishDiv;

            let now; 
            for (var i = 0; i < period; i++) {
                let j = i + 1;
                let a = parseInt(time[i]);
                now = new Date(a);
                var date = now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
                var eachDaysDiv = document.getElementById("each-day");
                var newDiv = document.createElement("div");
                var data = "<div class='card' style='width: 50rem; margin:25px;padding:6px;background-color:seashell;border-color:whitesmoke;'><div class='card-body'><h5 class='card-title'style='padding: 0 580px 0 0;float: left;'>Day";
                data += j + "</h5>" + "<h5 class='card-title' >" + date + "</h5><p style='margin-top: 30px;'class='card-text' id='planning" + i + "'></p><p class='card-text' id='comment" + i + "'></p>";

                newDiv.innerHTML = data;
                eachDaysDiv.appendChild(newDiv);
            }
            publicDayNum(period);
        }
    }
    req.send();
}
publicDayBlock();
function publicDayNum(period) {
    for (let i = 0; i < period; i++) {
        let j = i + 1;
        publicDayContent(i, j);
    }
}
function publicDayContent(i, j) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://17runa.com/perDay?DAY=" + j + "&" + "plan_id=" + planId);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result2 = JSON.parse(xhr.responseText);//JSON.parse:將字串轉換成物件
            const { comment, planning } = result2;
            let c = "心情小語：";
            for (let k = 0; k < comment.length; k++) {
                c += comment[k].comment + " , ";
            }
            document.getElementById("comment" + i).innerHTML = c;
            let p = "今日計畫：";
            for (let k = 0; k < planning.length; k++) {
                p += planning[k].plan + " , ";
            }
            document.getElementById("planning" + i).innerHTML = p;
        }
    }
    xhr.send();
}
//Public plans: Day blocks End

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
//My Plan End

function back() {
    var url = "./index";
    window.location.assign(encodeURI(url));
}
function calendar() {
    var url = "../publiccalendar" + "?" + "id=" + planId;
    window.location.assign(encodeURI(url));
}
document.write('<script src="googleLogin.js"></script>');


