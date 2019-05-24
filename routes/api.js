const express = require('express');
const router = express.Router();
const mysql = require("../mysqlcon.js");
router.get("/:category", function(req, res){
    let { category } = req.params;
    if(category === 'public'){
        let query = `SELECT id,topic,goal,image,user_id,user_name FROM plan where status=1`;
        mysql.con.query(query, function (error, result) {
            if (error) {
                res.send("Database query error" + error);
            }
            res.send(result);
        });
      }else if ( category === 'private' ) { 
        let { name } = req.query;
        let query = `SELECT * FROM plan where user_name="${name}"`;
        mysql.con.query(query, function (error, result) {
            if (error) {
                res.send("Database query error" + error);
            }
            res.send(result);
        });  
      }else if (category==='search'){
        let { topic } = req.query;
        let query =  `SELECT * FROM plan WHERE topic LIKE '%`+ topic + `%' and status=1`;
        mysql.con.query(query, function (error, result) {
            if (error) {
                res.send("Database query error");
            }
           
            res.send(result);
        });
       
      }else if (category==='userSearch'){
        var search = req.query.search;
        var name = JSON.stringify(req.query.name);
        let querys = `SELECT * FROM plan WHERE topic LIKE '%`+ search + `%' AND user_name=${name}`;
        mysql.con.query(querys, function (error, result) {
            if (error) {
                res.send("Database query error" + error);
            }
            res.send(result);
        });  
      }  
   });



   module.exports = router;