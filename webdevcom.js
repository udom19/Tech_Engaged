var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
// APP CONFIGURATION
mongoose.connect("mongodb://udom19:udom19@ds123822.mlab.com:23822/tech_engaged")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//******************SCHEMA SETUP*****************
var questionSchema = new mongoose.Schema({
  title: String,
  tags: String,
  created: {type:Date, default: Date.now},
  questn: String
});

var answerSchema = new mongoose.Schema({
  answer: String,
  question_id: String,
  created: {type: Date, default: Date.now}
});

// ******* MODEL CONFIG ************//
var Question = mongoose.model("Question", questionSchema);
var Answer = mongoose.model("Answer", answerSchema);

// Question.create(
//   {
//     title: "Form styling", 
//     tags: "html, css, bootstrapp", 
//     questn: "I wanted to appy styling to my form ......" 
//   }, function(err, question){
//     if(err){
//       console.log(err);
//     }else{
//       console.log("Newly asked question:");
//       console.log(question);
//     }
//   });

app.get("/", function(req, res){
  res.redirect("/webdevcom")
})

app.get("/webdevcom", function(req, res){
  res.render("webdevcom");
});

app.get("/webdevcom/signup", function(req, res){
  res.render("signup");
});

//INDEX ROUTE - Show all questions
app.get("/webdevcom/questions", function(req, res){
  //Get all questions from DB:
  Question.find({}, function(err, allQuestions){
    if(err){
      console.log(err);
    }else{
      res.render("index", {questions: allQuestions});
    }
  });
});

// CREATE ROUTE - Add new questiona to the DB
app.post("/webdevcom", function(req, res){
  //get data from form and add it to the question array
  var title = req.body.title;
  var tags = req.body.tags;
  var questn = req.body.questn;
  // var answer = req.body.answer;
  var newQuestion = {title: title, tags: tags, questn: questn}
  // var newAnswer = {answer:answer}
  //Ask a new question and save to DB
  Question.create(newQuestion, function(err, newlyAsked){
    if(err){
      console.log(err)
    }else{
       //redirect back to the question page
      res.redirect("/webdevcom/questions");
    }
  })
});

// NEW ROUTE - Show form to ask new question 
app.get("/webdevcom/questions/ask", function(req, res){
  res.render("ask")
});

// SHOW - Show more info about each question
app.get("/webdevcom/questions/:question_id", function(req, res){ //ds
  //Find the question with provided id
  Question.findById(req.params.question_id, function(err, foundQuestion){
    if(err){
      console.log(err);
    }else{
      //Render the show template with that question
      console.log(foundQuestion)
      res.render("show", {question: foundQuestion});
    }
  });
  // Find the answer to a question
  // Answer.findById(req.params.id, function(err, foundAnswer){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     // render the show template with the answer
  //     res.render("show", {answer: foundAnswer});
  //   }
  // });
});

// ******New Inputs ******
app.get("/webdevcom/questions/:question_id", function(req, res){
 //Find the answer to a question
 Answer.findById(req.params.question_id, function(err, foundAnswer){
   if(err){
     console.log(err);
  }else{
   // render the show template with the answer
 res.render("show", {answer: foundAnswer});
   }
});


});

app.post("/webdevcom/questions", function(req, res){
 //get data from form and add it to the question array
 var answer = req.body.answer;
 var newAnswer = {answer:answer, question_id : req.params.question_id}

 // Answer a new question and save to DB.
 Answer.create(newAnswer, function(err, newlyAnswered){
    if (err){
      console.log(err)
    }else{
      res.redirect("/webdevcom/questions/:question_id");
    }
  })
});
app.listen(3000, function(){
  console.log('Serving webdevcom at 3000');
});