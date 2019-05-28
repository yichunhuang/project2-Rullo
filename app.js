var express = require("express");
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Router = require('./routes/signin');
app.use('/member', Router);
const api = require('./routes/api');
app.use('/api', api);
const bug = require('./routes/bug');
app.use('/bug', bug);

const crontab = require('./routes/cron');
app.use('/crontab', crontab);
const calendar = require('./routes/calendar');
app.use('/calendar', calendar);
const p_calendar = require('./routes/publiccalendar');
app.use('/publiccalendar', p_calendar);
// Database Access Object
const dao = {
    plan: require("./dao/plan.js"),
};
app.get("/", function (req, res) {
    res.send("Local project2");
});
app.use("/api/", function(req, res, next){
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Credentials", "true");
    next();
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/');    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })
// var upload = multer({ dest: 'uploads/'})
//plan.html  會導到/day.html?plan_id=
app.post("/plan", upload.single('planImage'), function (req, res) {
    let data = req.body;
    if (!data.topic || !data.period || !data.goal) {
        res.send("Please enter topic, period and goal.");
    }
    else if (!data.user_id || !data.user_name) {
        res.send("Please login first.");
    } else {
        if (req.file== undefined ) {
           // console.log("has no photo");
            data.image = "uploads/planImage-1556507089763";//預設照片
            dao.plan.insertUserPlan(data).then(function (plan_id) {
                res.redirect('./day?plan_id=' + plan_id);
            }).catch(function (error) {
                if(error) throw error
                let url = "./plan?addplanproblem=true";
                res.redirect(url);
            });
        } else {
          //  console.log("has photo");
            data.image = "uploads/" + req.file.filename;
            dao.plan.insertUserPlan(data).then(function (plan_id) {
                res.redirect('./day?plan_id=' + plan_id);
            }).catch(function (error) {
                if(error) throw error
                let url = "./plan?addplanproblem=true";
                res.redirect(url);
            });
        }
    }
});
app.post("/search", function (req, res) {
    let data = req.body; //searched topic
    //console.log("app.js",data.whichPage);
    if(data.whichPage==='index'|| data.whichPage==='index?'){
        let url = "https://17runa.com/index?search=" + data.search;
    res.redirect(url);
    }else if(data.whichPage==='indexu'){
        let url = "https://17runa.com/indexuser?name=Runa%20Wang&search=" + data.search;
        res.redirect(url);
    }else{
       
        res.redirect("https://17runa.com/index");
    }

});
app.post("/usersearch", function (req, res) {
    let data = req.body;
    
    let url = "https://17runa.com/indexuser?&search=" + data.search;
    res.redirect(url);

});


//day.html有用到  
app.get("/days", function (req, res) {
    let { plan_id } = req.query;
    if (!plan_id || plan_id === undefined) { res.send("Please enter plan_id value.") }
    dao.plan.selectUserPlan(plan_id).then(function (plan) {
        res.send(plan);
    }).catch(function (error) {
        res.send({ error: error });
    });
});
//day.html會導到perDay.html＋...
app.post("/perDay", function (req, res) {
    let data = req.body;
    dao.plan.insertPerDay(data).then(function (result) {
        res.send({ success: result });
    }).catch(function (error) {
        res.send({ error: error });
    });
});
//perDay2.html (day.html不確定要不要用)
app.get("/perDay", function (req, res) {
    // http://localhost:3000/perDay?DAY="+ j + "&;" + "plan_id=" + plan_id
    let { DAY } = req.query;
    let { plan_id } = req.query;
    if (!plan_id || plan_id === undefined) { res.send("Please enter plan_id value.") }
    if (!DAY || DAY === undefined) { res.send("Please enter DAY value.") }
    dao.plan.selectUserPerDay(plan_id, DAY).then(function (UserPerDay) {
        res.send(UserPerDay);
    }).catch(function (error) {
        res.send({ error: error });
    });
});
app.delete("/perDay", function (req, res) {
    let data = req.body;
    dao.plan.deletePerDay(data).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send({ error: error });
    });
});
var uploading = multer({ dest: 'static/uploads/' })
app.post("/editImage", uploading.single('image'), function (req, res) {
    let data = {};
    data.plan_id = req.body.plan_id;
    if (req.file == undefined) {
        
        dao.plan.updateUserImage(data).then(function (result) {
            res.send({ success: result });
        }).catch(function (error) {
            res.send({ error: error });
        });
    } else {
        data.image = "uploads/" + req.file.filename;
        dao.plan.updateUserImage(data).then(function (result) {
            res.send({ success: result });
        }).catch(function (error) {
            res.send({ error: error });
        });
    }
});
app.post("/editPlan", function (req, res) {
    let data = req.body;
    dao.plan.updateUserPlan(data).then(function (result) {
        res.send({ success: result });
    }).catch(function (error) {
        res.send({ error: error });
    });
});
app.post("/deletePlan", function (req, res) {
    let plan_id = req.body.id;
    dao.plan.deleteUserPlan(plan_id).then(function (result) {
        res.send({ success: result });
    }).catch(function (error) {
        res.send({ error: error });
    });
});
//ejs
app.get('/index', function(req, res){
    // /views/idex.ejs
    res.render('index.ejs', {title:"熱門計畫",script_src:"index.js"});
  });
  app.get('/indexuser', function(req, res){
    // /views/idex.ejs   
       res.render('index.ejs',{title:"我的計畫",script_src:"indexuser.js"});
  });
  app.get('/plan', function(req, res){
    // /views/idex.ejs   
       res.render('plan.ejs',{script_src:"plan.js"});
  });
  app.get('/day', function(req, res){
    // /views/idex.ejs   
       res.render('day.ejs',{script_src:"day.js"});
  });
  app.get('/eachDay', function(req, res){
    // /views/idex.ejs   
       res.render('eachDay.ejs',{script_src:"eachDay.js"});
  });
  app.get('/publicPlan', function(req, res){
    // /views/idex.ejs   
       res.render('publicPlan.ejs',{script_src:"publicPlan.js"});
  });

  app.use('/', express.static('static'))
  app.use('/', express.static('static/js'))
//https greenlock
require("greenlock-express").create({
	email:"test@test.com",
	agreeTos: true,
	configDir: "./cert/",
	communityMember: false,
	telemetry: false,
	store:require("greenlock-store-fs"),
	app:app
}).listen(80, 443);