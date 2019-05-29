const lib = require("../routes/api.js");
const assert = require("assert");
const chai = require('chai');
const expect = require('expect');

describe("API Logic Test",function(){
 it("public",function(){
     assert.equal(lib.apiLogic('public',0,0,0),"https://17runa.com/api/public")
 })
 it("private",function(){
    assert.equal(lib.apiLogic('private','Runa%20Wang',0,0),"https://17runa.com/api/private?name=Runa%20Wang")
})
it("search",function(){
    assert.equal(lib.apiLogic('search',0,'攝影',0),"https://17runa.com/api/search?topic=攝影")
})
it("userSearch",function(){
    assert.equal(lib.apiLogic('userSearch','Runa%20Wang',0,'攝影'),"https://17runa.com/api/userSearch?name=Runa%20Wang&search=攝影")
})

});
chai.should();//允许我们使用 "should style" 断言:someValue.should.equal(12345)
describe('API test:https://17runa.com/api/public', function() {
    it('result', function(done) {
        lib.apiPublic.get(function(err, result) {
           // result.should.deep.equal(data);
          expect(result[0].id).should.exist;
          expect(result[0].topic).should.exist;
          expect(result[0].goal).should.exist;
          expect(result[0].image).should.exist;
          expect(result[0].user_id).should.exist;
          expect(result[0].user_name).should.exist;
          console.log(typeof result[0].id);
         // expect(result[0].id).should.be.a('number');
         //expect(result).should.be.an.instanceof(Object);
            if (err) done(err);
             else done();   
        });     
   });
  });






  
