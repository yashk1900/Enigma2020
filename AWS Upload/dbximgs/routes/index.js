var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');  
const questions = require("./questions");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var crypto=require('crypto');

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("enigma_database3");

//var answer= ; // Add corresponding answers here

function hash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
 }

function update_level(email, level)
{
  var myquery = {email:email};
  var newvalues={$set :{level:level,last_write: Date.now()} }
  return dbo.collection('ENIGMA').updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
}

function get_level(email)
{
  return new Promise(function(resolve,reject){
        dbo.collection('ENIGMA').findOne({email:email},function(err,result){
          if(err) throw err;
          resolve(result.level);
          console.log("got the level",result.level);
        });
        })
}

function get_username(email)
{
  return new Promise(function(resolve,reject){
    dbo.collection('ENIGMA').findOne({email:email},function(err,result){
      if(err) throw err;
      resolve(result.username);
      console.log("got the username",result.username);
    });
    })
}

function get_rank(email)
{
  return new Promise(function(resolve,reject){
    leaderboard_id=[];
    leaderboard_level=[];
    itr=0;
  
    dbo.collection('ENIGMA').find().sort({level:-1,last_write:1}).toArray(function(err, result) {
      if (err) throw err;
      var userrank=0;
       console.log(result[0].name,result[1].name);
      while(itr<result.length )
      {
        if(itr<20)
        {
          leaderboard_id.push(result[itr].username);
          leaderboard_level.push(result[itr].level);
        }
        if(email == result[itr].email)
        {
          userrank=itr+1;
        }
        if(itr>=Math.min(20,result.length)-1 && userrank!=0)
        {
          resolve(userrank);
          return;
        }
        itr++;
      }
  
    });
})
}

function check(email,password)
{
  return new Promise(function(resolve,reject){

      dbo.collection('ENIGMA').findOne({email:email},function(err,result){
        if(err) throw err;
        if(result.password == hash(password))
          {
            resolve(1);
          }
          else resolve(0);
      });
      })  
}
function assign()
{
 return new Promise(
   function(resolve,reject){
  resolve(1);
 })
}
router.get('/', function(req, res, next) {
  res.render('', {layout: 'layout_static'});
});

router.get('/signin', function(req, res, next) {
  res.render('', {layout: 'signin'});
});

router.post('/signin_send',async function(req,res,next)
{
  var func=await check(req.body.email,req.body.password);
  console.log("func is",func); 
  if(func ==1)
  {
    req.session.email = req.body.email;
    req.session.level=await get_level(req.body.email);
    //req.session.uname=req.session.username;
    req.session.save();
    console.log(req.session.level);
    res.redirect('/play');
  }
 else res.render('', {func:'wrong_password()',layout: 'signin'});
});

router.get('/signup', function(req, res, next) {
  res.render('', {layout: 'register'});
});

router.post('/createuser', function(req, res, next) {
  dbo.collection("ENIGMA").createIndex( { "email" : 1 }, { unique : true } );
  var account={
    email: req.body.email,
    username:req.body.username,
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    password:hash(req.body.password),
    level:1,
    last_write:Date.now()
  }
  dbo.collection('ENIGMA').insertOne(account,function(err,res){
    if(err) throw err;
    console.log("1 doc inserted");
  });

  res.render('', {func:'register_successful()',layout: 'layout_static'});
});

router.get('/play', async function(req, res, next) {

  console.log('CURRENT LEVEL',req.session.level);
  let currentQuestion = questions[req.session.level-1];
  res.render('index', currentQuestion);
});

router.post('/send_data',async function (req, res) {   
  var ans=req.body.answer;
  let currentQuestion = questions[req.session.level-1];
  console.log(ans,answer[req.session.level-1]);
  if(ans == answer[req.session.level-1])
  {
    req.session.level++;
    await update_level(req.session.email, req.session.level);
    res.render('index', {...currentQuestion,func:1});
    res.redirect('/play');
  }
  else
  { 
    res.render('index', {...currentQuestion,func:0});
  }
  console.log(req.session.level);
}) 

//leaderboard to be done later
router.get('/leaderboard',async function(req,res,next){
  req.session.level=await get_level(req.session.email);
  const rank =await get_rank(req.session.email);
  const uname=await get_username(req.session.email);
  console.log("rank is :",rank);
  console.log("THE LEADERBOARD DATA:", leaderboard_id,leaderboard_level);
  res.render('',{layout: 'leaderboard', Rank:rank, User_Id: uname, My_Level:req.session.level, userid_1: leaderboard_id[0], userid_2: leaderboard_id[1], userid_3: leaderboard_id[2], userid_4: leaderboard_id[3], userid_5: leaderboard_id[4], userid_6: leaderboard_id[5], userid_7: leaderboard_id[6], userid_8: leaderboard_id[7], userid_9: leaderboard_id[8], userid_10: leaderboard_id[9], userid_11: leaderboard_id[10], userid_12: leaderboard_id[11], userid_13: leaderboard_id[12], userid_14: leaderboard_id[13], userid_15: leaderboard_id[14], userid_16: leaderboard_id[15], userid_17: leaderboard_id[16], userid_18: leaderboard_id[17], userid_19: leaderboard_id[18], userid_20: leaderboard_id[19], level_1: leaderboard_level[0], level_2:leaderboard_level[1], level_3:leaderboard_level[2], level_4:leaderboard_level[3], level_5:leaderboard_level[4], level_6:leaderboard_level[5], level_7:leaderboard_level[6], level_8:leaderboard_level[7], level_9:leaderboard_level[8], level_10:leaderboard_level[9], level_11:leaderboard_level[10], level_12:leaderboard_level[11], level_13:leaderboard_level[12], level_14:leaderboard_level[13], level_15:leaderboard_level[14], level_16:leaderboard_level[15], level_17:leaderboard_level[16], level_18:leaderboard_level[17], level_19:leaderboard_level[18], level_20:leaderboard_level[19] });
})

});
module.exports = router;