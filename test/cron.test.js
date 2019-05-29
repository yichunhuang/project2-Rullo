const lib = require("../routes/cron.js");
const assert = require("assert");

describe("Crontab Test",function(){    
      it("plan",function(){
        return lib.crontab([0,1,1557732623590,1558069809708]).then( (result) => {
               assert.equal(result,'此計畫已經到期'); 
             });
     })
})


