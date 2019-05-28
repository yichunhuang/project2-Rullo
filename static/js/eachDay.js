const decodeURL = decodeURI(location.search);//https://17runa.com/eachDay?DAY=1&plan_id=2 如：?DAY=1&plan_id=2
const pureURL = decodeURL.split("?")[1];//如：DAY=1&plan_id=2
const valuesArray = pureURL.split("&");// 如：["DAY=1", "plan_id=2"]
const urlObject = new Object();
for (let i = 0; i < valuesArray.length; i++) {
    let key_value = valuesArray[i].split("=");// 如：["DAY", "1"] 如：["plan_id", "2"]
    urlObject[key_value[0]] = key_value[1];// urlObject.DAY = 1  如：urlObject.plan_id = 2
}
//console.log(urlObject);//如： {DAY: "1", plan_id: "2"}
const day = urlObject.DAY;
const planId = urlObject.plan_id;

function eachDayBlock() {
    let req = new XMLHttpRequest();
    req.open("GET", "https://17runa.com/days?plan_id=" + planId);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let result = JSON.parse(req.responseText);//JSON.parse:將字串轉換成物件
            const { topic, period, goal, rules, trigger, punish, status } = result;
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
                triggerDiv += '<tr><td>To do :<input type="text" class="input" style=" border-radius: 10px;width:600px;" name="triggertext"  value="' + trigger[i].trig + '">';
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

            //Each Day Block
            let eachDaysDiv = document.getElementById("each-day");
            let newDiv = document.createElement("div");

            let data = "<div class='card' id='DAY'" + day + " style='width: 55rem;'><div class='card-body'><h5 class='card-title' style='margin-bottom:25px;font-weight: 500;'>Day" + day;
            data += "</h5><h6 class='card-subtitle mb-2 '>每日事項:</h6>";
            for (let k = 0; k < rules.length; k++) {
                data += '<input type="checkbox" value="1" name="rule" id="checkboxrule' + k + '"><p class="text-muted" style="display:inline-block;padding:0 10px; ">' + rules[k] + '</p><br>';
            }

            data += "<h6 class='card-subtitle mb-2' style='margin-top:5px;'>今日計畫:</h6>";
            data += '<i class="fas fa-plus-circle" style="color:pink;" class="myMOUSE" onclick=addPlanning("DAY' + day + 'plan")></i>';
            data += '<table id="DAY' + day + 'plan"></table>';
            data += '<div id="hiddenplanning" ></div>';

            data += "<br><h6 class='card-subtitle mb-2 '>心情小語:</h6>";
            data += '<i class="fas fa-plus-circle" style="color:pink;" class="myMOUSE" onclick=addComment("DAY' + day + 'comment")></i>';
            data += '<table id="DAY' + day + 'comment"></table>';
            data += '<div id="hiddencomment"></div>';

            newDiv.innerHTML = data;
            eachDaysDiv.appendChild(newDiv);
            getOldEachDayData();
        }
    }
    req.send();
}
eachDayBlock();
function getOldEachDayData() {
    let req = new XMLHttpRequest();
    req.open("GET", "https://17runa.com/perDay?DAY=" + day + "&" + "plan_id=" + planId);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let result = JSON.parse(req.responseText);//JSON.parse:將字串轉換成物件
            const { comment, planning, ruleStatus } = result;
            if (comment.length == 0 && planning.length == 0 && ruleStatus.length == 0) {
                console.log("first insert");
            } else {
                //comment
                for (let i = 0; i < comment.length; i++) {
                    addComment("DAY" + day + "comment");
                    document.getElementById("comment" + i).value = comment[i].comment;
                }
                for (let i = 0; i < planning.length; i++) {
                    addPlanning("DAY" + day + "plan");
                    document.getElementById("planning" + i).value = planning[i].plan;
                    if (planning[i].status == 1) {
                        var a = document.getElementById("checkboxplanning" + i);
                        a.setAttribute("checked", "checked");
                    }
                }
                //ruleStatus
                console.log(ruleStatus);
                for (let i = 0; i < ruleStatus.length; i++) {
                    if (ruleStatus[i].status == 1) {
                        var a = document.getElementById("checkboxrule" + i);
                        a.setAttribute("checked", "checked");
                    }
                }
            }
        }
    }
    req.send();
}
//Each Day Block End
function myPlan() {
    let a = document.getElementById("myPlan");
    if (a.style.display == "none") {
        a.style.display = "block";
        document.getElementById("my_plan").style.color = "pink";
        // document.getElementById("my_plan").style.borderColor ="red";
        //  document.getElementById("my_plan").style.boxShadow = rgba(0,123,255,.5);
    }
    else {
        a.style.display = "none"
        document.getElementById("my_plan").style.color = "white";
        document.getElementById("my_plan").style.borderColor = "#0066cc";
        //  document.getElementById("my_plan").style.boxShadow = "none";

    }
}
function editMyPlan() {
    let category = document.getElementById("status").value;
    let topic = document.getElementById("topictext").value;
    let period = document.getElementById("periodtext").value;
    let goal = document.getElementById("goaltext").value;
    let trigger = document.getElementsByName("triggertext");
    let trigtime = document.getElementsByName("trigtime");
    let rules = document.getElementsByName("rulestext");
    let punish = document.getElementsByName("punishtext");
    let plan = {
        "category": category,
        "plan_id": planId,
        "topic": topic,
        "period": period,
        "goal": goal
    };
    //trigger
    let triggerObject = {};
    let triggerArray = [];
    let timeArray = [];
    for (let i = 0; i < trigger.length; i++) {
        triggerArray.push(trigger[i].value);
        timeArray.push(trigtime[i].value);
    }
    console.log(triggerArray);
    triggerObject.trigger = triggerArray;
    triggerObject.time = timeArray;
    plan.trigger = triggerObject;

    //rule
    let ruleArray = [];
    for (let i = 0; i < parseInt(rules.length); i++) {
        ruleArray.push(rules[i].value);
    }
    plan.rules = ruleArray;

    //punish
    let punishArray = [];
    for (let i = 0; i < punish.length; i++) {
        punishArray.push(punish[i].value);
    }
    plan.punish = punishArray;

    let data = JSON.stringify(plan);
    let req = new XMLHttpRequest();
    req.open("POST", "../editPlan");
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8", "form-data");
    req.onload = function () {
        let result = JSON.parse(req.responseText);
        if (result.error) {
            alert("更新失敗！");
        } else {
            alert("更新成功！");
            history.go(0);
        }
    };
    req.send(data);
}
function editPlanning() {//delete old planning data 
    const form = document.querySelector('#each-day');
    let formData = new FormData(form);
    let hiddencomment = formData.getAll("hiddenComment");
    let hiddenplanning = formData.getAll('hiddenPlanning');
    let comment = formData.getAll('comment');
    let plantext = formData.getAll('plantext');
    let plan = {
        "plan_id": planId,
        "day": day,
        "hiddenPlanning": hiddenplanning[0],
        "plantext": plantext,
        "hiddenComment": hiddencomment[0],
        "comment": comment
    };
    let checkboxPlan = document.getElementsByName('checkboxPlan');
    for (let i = 0; i < parseInt(hiddenplanning[0]); i++) {
        if (checkboxPlan[i].checked) {
            let a = "checkboxPlan" + i;
            plan[a] = "1";
        }
    }
    let rulesNum = document.getElementById("Rules-length").value;
    let rule = document.getElementsByName('rule');
    for (let i = 0; i < rulesNum; i++) {
        if (rule[i].checked) {
            let c = "rule" + i;
            plan[c] = "1";
        }
    }
    let data = JSON.stringify(plan);
    let req = new XMLHttpRequest();
    req.open("DELETE", "../perDay");
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8", "form-data");
    req.onload = function () {
        savePlanning();//insert new planning data
    };
    req.send(data);
}
function savePlanning() {
    const form = document.querySelector('#each-day');
    let formData = new FormData(form);
    let req = new XMLHttpRequest();
    let hiddencomment = formData.getAll("hiddenComment");
    let hiddenplanning = formData.getAll('hiddenPlanning');
    let comment = formData.getAll('comment');
    let plantext = formData.getAll('plantext');
    let plan = {
        "plan_id": planId,
        "day": day,
        "hiddenPlanning": hiddenplanning[0],
        "plantext": plantext,
        "hiddenComment": hiddencomment[0],
        "comment": comment
    };
    let checkboxPlan = document.getElementsByName('checkboxPlan');
    for (let i = 0; i < parseInt(hiddenplanning[0]); i++) {
        if (checkboxPlan[i].checked) {
            let a = "checkboxPlan" + i;
            plan[a] = "1";
        }
    }
    let rulesNum = document.getElementById("Rules-length").value;
    let rule = document.getElementsByName('rule');
    for (let i = 0; i < rulesNum; i++) {
        if (rule[i].checked) {
            let c = "rule" + i;
            plan[c] = "1";
        }
    }
    let data = JSON.stringify(plan);
    req.open("POST", "../perDay");
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8", "form-data");
    req.onload = function () {
        let result = JSON.parse(req.responseText);
        if (result.error) {
            alert("儲存失敗！");
        } else {
            alert("儲存成功！");
            history.go(-1);//0當前頁面 -1 回前頁
        }
    };
    req.send(data);
}

function addPlanning(id) {
    let count;
    let table = document.getElementById(id);
    let rownum = table.rows.length;
    let row = table.insertRow(rownum);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = '<input type="checkbox" value="1" name="checkboxPlan"  id="checkboxplanning' + rownum + '">' + '<input type="text" class="input" name="plantext" style=" border-radius: 10px;width:730px" id="planning' + rownum + '">' + '<i class="fas fa-times-circle" style="color:pink;" onClick="removeplanning(this)"></i>';
    count = rownum + 1; //代表table #row
    let hiddens = document.getElementById("hiddenplanning");
    hiddens.innerHTML = "<input type=hidden name='hiddenPlanning' value= " + count + ">";

}
function addComment(id) {
    let count;
    let table = document.getElementById(id);
    let rownum = table.rows.length;
    let row = table.insertRow(rownum);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = '<input type="text" name="comment" class="input" style=" border-radius: 10px;width:745px" id=comment' + rownum + '>' + '<i class="fas fa-times-circle" class="myMOUSE" style="color:pink;" onClick="removecomment(this)"></i>';
    count = rownum + 1; //代表table #row;
    count = rownum + 1; //代表table #row
    let hiddens = document.getElementById("hiddencomment");
    hiddens.innerHTML = "<input type=hidden name='hiddenComment' value= " + count + ">";
}
function addplanTrigger(id, trigger, time) {
    let count;
    let table = document.getElementById(id);
    let rownum = table.rows.length;
    let row = table.insertRow(rownum);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = '<div>To do: <input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + trigger + '">' + '<i class="fas fa-times-circle" style="color:pink;" onClick="removetrigger(this)"></i></div>' + '<div>Time: <input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + time + '"></div><br>';
    count = rownum + 1; //代表table #row;
    count = rownum + 1; //代表table #row
    let hiddens = document.getElementById("hiddenPlanTrigger");
    hiddens.innerHTML = "<input type=hidden name='hiddenPlanTriggernum' value= " + count + ">";
}
function addplanRule(id, name) {
    let table = document.getElementById(id);
    let rownum = table.rows.length;
    let row = table.insertRow(rownum);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = '<div><input type="text" class="input" style=" border-radius: 10px;width:600px;" name="' + name + '">' + '<i class="fas fa-times-circle" class="myMOUSE" style="color:pink;" onClick="remove(this)"></i>';;
    count = rownum + 1; //代表table #row
}

function removeplanning(button) {
    button.closest('tr').remove();
    document.querySelector("#hiddenplanning input").value = parseInt(document.querySelector("#hiddenplanning input").value) - 1;
}
function removetrigger(button) {
    button.closest('tr').remove();
    document.querySelector("#hiddenPlanTrigger input").value = parseInt(document.querySelector("#hiddenPlanTrigger input").value) - 1;
}
function removeOldtrigger(button) {
    button.closest('tr').remove();
}
function removecomment(button) {
    button.closest('tr').remove();
    document.querySelector("#hiddencomment input").value = parseInt(document.querySelector("#hiddencomment input").value) - 1;
}
function remove(button) {
    button.closest('tr').remove();
}
function removeOldRule(button) {
    button.closest('tr').remove();
}
function back() {
    window.location.assign("https://17runa.com/day?plan_id=" + planId);
}
document.write('<script src="googleLogin.js" ></script>');






