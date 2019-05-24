
let decodeURL = decodeURI(location.search);//https://17runa.com/indexuser?name=Runa&search=攝影 抓?name=Runa&search=攝影
let URL = decodeURL.split("&")[1];//看有沒有＆來判斷有沒有search
//Search:
if (URL) {
    let pureURL = decodeURL.split("?")[1];//name=Runa
    let userNameAndSearch = pureURL.substring(5);//name= 抓之後的值
    let url = "https://17runa.com/api/userSearch?name=" + userNameAndSearch;
    plansBlock(url);
} else {
//Private plans:    
    var pureURL = decodeURL.split("?")[1];//name=Runa
    if (pureURL != undefined) {
        let userName = pureURL.substring(5);//Runa
        let url = "https://17runa.com/api/private?name=" + userName;
        plansBlock(url);
    }
}
function plansBlock(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let result = JSON.parse(req.responseText);

            let decodeURL = decodeURI(location.search);
            let URL = decodeURL.split("&")[1];
            if (!URL) {//沒有使用search
                let plans = document.getElementById("plans");
                let a = '<div class="card" style="width: 18rem;height: 25em;">';
                a += '<img src="../img/dream.jpg" class="card-img-top" style="height: 17rem; " alt="...">';
                a += '<div class="card-body"><a href="plan" class="btn btn-primary" style=" margin:36px 43px 18px 50px;background:pink;color:white;border-color:pink;">點我新增計畫！</a></div></div></div>';
                plans.innerHTML = a;    
            }else {//有使用search
                 if (!result[0]) {//找不到和searchTopic一樣topic的計畫
                    let plans_container = document.getElementById("plans");
                    plans_container.setAttribute("style", "margin:30px 60px;font-size:20px;");
                    plans_container.innerHTML = "查無搜尋結果！";
                } 
            }
           plans(result);  
        }
    }
    req.send();
}
function plans(result){
    let plans = document.getElementById("plans");
    for (let i = 0; i < result.length; i++) {
        let topic = result[i].topic;
        let goal = result[i].goal;
        let image = result[i].image;
        let name = result[i].user_name;
        let id = result[i].id;//plan_id

        let div_plan = document.createElement("div");
        div_plan.setAttribute("class", "card");
        div_plan.setAttribute("style", "width:18rem;height: 25em;");
        plans.appendChild(div_plan);

        let div_img = document.createElement("img");
        div_img.setAttribute("class", "card-img-top");
        div_img.setAttribute("style", "height: 13rem;");
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
        div_look.setAttribute("class", "btn btn-primary");
        div_look.setAttribute("id", "text" + i);
        div_look.setAttribute("href", "https://17runa.com/day?plan_id=" + id);
        div_cardbody.appendChild(div_look);
        document.getElementById("text" + i).innerHTML = "查看";

        let div_delete = document.createElement("a");
        div_delete.setAttribute("class", "btn btn-primary");
        div_delete.setAttribute("id", "delete" + i);
        div_delete.setAttribute("style", "margin-left:25px;border-color:pink;color:white;background-color:pink;cursor:pointer;");
        div_delete.setAttribute("onclick", "deletePlan(" + id + ")");
        div_cardbody.appendChild(div_delete);
        document.getElementById("delete" + i).innerHTML = "刪除計畫";
    }
}
function deletePlan(id) {
    let data = {
        id: id
    }
    let plan_id = JSON.stringify(data);
    var req = new XMLHttpRequest();
    req.open("POST", "../deletePlan");
    req.setRequestHeader("Content-Type","application/json; charset=UTF-8");
    req.onload = function () {
        var result = JSON.parse(req.responseText);
        console.log(result);
        if (result.error) {
            alert("刪除計畫失敗！");
        } else {
            alert("成功刪除計畫！");
            history.go(0);
        }
    };
    req.send(plan_id);
}
document.write('<script src="googleLogin.js"></script>');


