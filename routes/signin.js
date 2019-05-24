const express = require('express');
const router = express.Router();
const mysql = require("../mysqlcon.js");
const googleSetting = require("../googleSetting.js");
router.get('/', (req, res) => {
  res.send("haha");
});
router.post("/signin", function (req, res) {
  let data = req.body;
  let {email,id_token } = data;
let CLIENT_ID = googleSetting.clientId;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify(id_token) { 
const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
}
verify(res, id_token, email)
.then(() => {
  const request = require('request');
  request(`https://oauth2.googleapis.com/tokeninfo?id_token=`+id_token,(error, response, body) => {
    let result = JSON.parse(body);
    let userData = {
      name: result.name,
      email: result.email,
      image: result.picture,  
    };
    //let sql = `SELECT * FROM member WHERE email ="${result.email}"`;
    let sql = 'SELECT accesstoken FROM member WHERE email = ?'
    mysql.con.query(sql, result.email ,(err, resultp) => {
      if (!resultp[0]) {//代表user沒有用gmail登入過
        var crypto = require('crypto'); //make access token + expire
          var access_token = crypto.randomBytes(24).toString('hex');  
          userData.accesstoken = access_token;
        let query = 'INSERT INTO member SET ?';        
        mysql.con.query(query, userData, (err) => {
          if (err) throw err;
         // console.log("insert user data!");
          res.clearCookie('access_token');
          res.cookie('access_token', access_token);
          res.json(userData);
        });
      }else{
        //console.log("already inserted user data");
      res.clearCookie('access_token');
      res.cookie('access_token', resultp[0].accesstoken);
      res.json(userData);
    }
      
    });
  }); 
})
.catch(err => console.log(err));
});

router.post('/accesstoken', (req, res) => {
  let bearer = req.get('Authentication'); 
 // console.log(bearer);
  let accessToken = bearer.replace('Bearer G_ENABLED_IDPS=google; G_AUTHUSER_H=0; ','');//console.log(accessToken); 
  let access_token = JSON.stringify(accessToken);//console.log(typeof access_token);
  let data ={};
  let sql = `SELECT * FROM member WHERE accesstoken =${access_token}`;
  mysql.con.query(sql,(err, result) => {
    if (err) throw err;
    if (!result[0]) {
      res.send({error:"wrong token"});
    }else{
      data.user_id=result[0].id;
      data.user_name=result[0].name;
      res.send(data);
    }
  });
});
router.post('/signout', (req, res) => {
  //console.log("signout clear cookie");
  res.clearCookie('access_token');
  res.send("cleared cookie");
});
module.exports = router;
