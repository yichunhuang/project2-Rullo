
let decodeURL = decodeURI(location.search); //抓https://17runa.com/index後面的值,如：?search=攝影
let pureURL = decodeURL.split("?")[1];//如：search=攝影
//Search:
if (pureURL != undefined) {
	let searchTopic = pureURL.substring(7); //search= 共7個字，抓其後面的值
	let url = "https://17runa.com/api/search?topic=" + searchTopic;
	plansBlock(url);
} else {
	//Public plans:	
	plansBlock("https://17runa.com/api/public");
}
function plansBlock(url) {//放置計畫的區塊（網頁右下）
	let req = new XMLHttpRequest();
	req.open("GET", url);
	req.onreadystatechange = function () {
		if (req.readyState === 4 && req.status === 200) {
			let result = JSON.parse(req.responseText);
			if (!result[0]) { //找不到search的計畫或是沒有任何公開計畫
				let plans_container = document.getElementById("plans");
				plans_container.setAttribute("style", "margin:30px 60px;font-size:20px;");
				plans_container.innerHTML = "無計畫！";
			} else {
				plans(result);
			}
		}
	}
	req.send();
}
function plans(result) {//生成一個個計畫
	let plans_container = document.getElementById("plans");
	for (let i = 0; i < result.length; i++) {
		let topic = result[i].topic;
		let goal = result[i].goal;
		let image = result[i].image;
		let name = result[i].user_name;
		let id = result[i].id;//plan_id

		let div_plan = document.createElement("div");
		div_plan.setAttribute("class", "card");
		div_plan.setAttribute("style", "width:14rem;height: 23em;border-color:#e6e6e6;");
		plans_container.appendChild(div_plan);

		let div_img = document.createElement("img");
		div_img.setAttribute("class", "card-img-top");
		div_img.setAttribute("style", "height: 10rem;");
		div_img.setAttribute("src", "../" + image);
		div_plan.appendChild(div_img);

		let div_cardbody = document.createElement("div");
		div_cardbody.setAttribute("class", "card-body");
		div_plan.appendChild(div_cardbody);

		let div_topic = document.createElement("h5");
		div_topic.setAttribute("class", "card-title");
		div_topic.setAttribute("id", "topic" + i);
		div_cardbody.appendChild(div_topic);
		document.getElementById("topic" + i).innerHTML = "主題： " + topic;

		let div_goal = document.createElement("p");
		div_goal.setAttribute("class", "card-text");
		div_goal.setAttribute("id", "goal" + i);
		div_cardbody.appendChild(div_goal);
		document.getElementById("goal" + i).innerHTML = "目標： " + goal;

		let div_name = document.createElement("p");
		div_name.setAttribute("class", "card-text");
		div_name.setAttribute("id", "name" + i);
		div_cardbody.appendChild(div_name);
		document.getElementById("name" + i).innerHTML = "計畫者： " + name;

		let div_look = document.createElement("a");
		div_look.setAttribute("class", "btn btn-warning");
		div_look.setAttribute("style", "background-color:#0066cc;border-color:#0066cc;color:#f5f5f5;");

		div_look.setAttribute("id", "text" + i);
		div_look.setAttribute("href", "https://17runa.com/publicPlan?plan_id=" + id);
		div_cardbody.appendChild(div_look);
		document.getElementById("text" + i).innerHTML = "查看";
	}
}
document.write('<script src="googleLogin.js"></script>');



