var app = {
  version: 1,
  currentQ: 0,

  allData: {
    "What makes someone a strong leader?": [
      ["Good communication", 46],
      ["Leads by example", 29],
      ["Makes confident decisions", 15],
      ["Motivates the team", 7],
      ["Takes responsibility", 3]
    ],
    "What should a leader do when the team is behind on a major deadline?": [
      ["Identify the main delay and fix it ASAP", 40],
      ["Meet the team and talk about it", 25],
      ["Reassign tasks if needed", 15],
      ["Provide resources to help them finish", 12],
      ["Set a new timeline", 8]
    ],
    "What is the best way to resolve a group conflict?": [
      ["Listen to all opinions", 35],
      ["Find a compromise", 28],
      ["Have a private conversation", 20],
      ["Talk to a leader/manager", 10],
      ["Ignore it", 7]
    ],
    "Your group member missed the deadline, what should you do?": [
      ["Ask why privately", 33],
      ["Offer them help", 25],
      ["Adjust responsibilities", 18],
      ["Tell a leader/manager", 12],
      ["Do the work for them", 2]
    ],
    "Name something people should do if there is a fire in a building": [
      ["Evacuate immediately", 71],
      ["Pull the fire alarm", 15],
      ["Call 911/emergency services", 8],
      ["Stay low under smoke", 4],
      ["Stop, drop, and roll", 2]
    ],
    "Name something a business should have to prevent or fight a fire": [
      ["Fire extinguisher", 37],
      ["Smoke detectors/fire alarms", 28],
      ["Sprinkler system", 16],
      ["Emergency exit signs", 9],
      ["Fire blanket", 4]
    ],
    "What's something a billionaire will buy?": [
      ["Private jet/plane", 33],
      ["Yacht/supergiant boat", 24],
      ["Private island", 19],
      ["Mansion/multiple houses", 14],
      ["Sports team/football club", 6]
    ],
    "Name something you might lose in the couch cushions": [
      ["Remote control", 38],
      ["Phone", 27],
      ["Loose change", 17],
      ["Keys", 11],
      ["Toys", 5]
    ],
    "What are the top 5 most watched sports events?": [
      ["FIFA World Cup", 44],
      ["Summer Olympics", 29],
      ["Cricket World Cup", 16],
      ["Champions League Final", 8],
      ["Super Bowl", 3]
    ],
    "Who are the last NBA champs in order?": [
      ["OKC", 26],
      ["Boston Celtics", 24],
      ["Denver Nuggets", 21],
      ["Golden State Warriors", 19],
      ["Milwaukee Bucks", 10]
    ]
  },

  board: $("<div class='gameBoard'>"+
           
             "<!--- Scores --->"+
             "<div class='score' id='boardScore'>0</div>"+
             "<div class='score' id='team1' >0</div>"+
             "<div class='score' id='team2' >0</div>"+
           
             "<!--- Question --->"+
             "<div class='questionHolder'>"+
               "<span class='question'></span>"+
             "</div>"+
           
             "<!--- Answers --->"+
             "<div class='colHolder'>"+
               "<div class='col1'></div>"+
               "<div class='col2'></div>"+
             "</div>"+
           
             "<!--- Buttons --->"+
             "<div class='btnHolder'>"+
               "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>"+
               "<div id='newQuestion' class='button'>New Question</div>"+
               "<div id='awardTeam2' data-team='2'class='button'>Award Team 2</div>"+
             "</div>"+
           
           "</div>"),

  shuffle: function(array){
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  makeQuestion: function(qNum){
    var qText  = app.questions[qNum]
    var qAnswr = app.allData[qText]

    var qNum = qAnswr.length
        qNum = (qNum<8)? 8: qNum;
        qNum = (qNum % 2 != 0) ? qNum+1: qNum;
    
    var boardScore = app.board.find("#boardScore")
    var question   = app.board.find(".question")
    var col1       = app.board.find(".col1")
    var col2       = app.board.find(".col2")
    
    boardScore.html(0)
    question.html(qText.replace(/&x22;/gi,'"'))
    col1.empty()
    col2.empty()

    for (var i = 0; i < qNum; i++){
      var aLI     
      if(qAnswr[i]){
        aLI = $("<div class='cardHolder'>"+
                  "<div class='card'>"+
                    "<div class='front'>"+
                      "<span class='DBG'>"+(i+1)+"</span>"+
                    "</div>"+
                    "<div class='back DBG'>"+
                      "<span>"+qAnswr[i][0]+"</span>"+
                      "<b class='LBG'>"+qAnswr[i][1]+"</b>"+
                    "</div>"+
                  "</div>"+
                "</div>")
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>")
      }
      var parentDiv = (i<(qNum/2))? col1: col2;
      $(aLI).appendTo(parentDiv)
    }  
    
    var cardHolders = app.board.find('.cardHolder')
    var cards       = app.board.find('.card')
    var backs       = app.board.find('.back')
    var cardSides   = app.board.find('.card>div')

    TweenLite.set(cardHolders , {perspective:800});
    TweenLite.set(cards       , {transformStyle:"preserve-3d"});
    TweenLite.set(backs       , {rotationX:180});
    TweenLite.set(cardSides   , {backfaceVisibility:"hidden"});

    cards.data("flipped", false)
    
    function showCard(){
      var card = $('.card', this)
      var flipped = $(card).data("flipped")
      var cardRotate = (flipped)?0:-180;
      TweenLite.to(card, 1, {rotationX:cardRotate, ease:Back.easeOut})
      flipped = !flipped
      $(card).data("flipped", flipped)
      app.getBoardScore()
    }
    cardHolders.on('click',showCard)
  },

  getBoardScore: function(){
    var cards = app.board.find('.card')
    var boardScore = app.board.find('#boardScore')
    var currentScore = {var: boardScore.html()}
    var score = 0
    function tallyScore(){
      if($(this).data("flipped")){
         var value = $(this).find("b").html()
         score += parseInt(value)
      }
    }
    $.each(cards, tallyScore)      
    TweenMax.to(currentScore, 1, {
      var: score, 
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },

  awardPoints: function(num){
    var num          = $(this).attr("data-team")
    var boardScore   = app.board.find('#boardScore')
    var currentScore = {var: parseInt(boardScore.html())}
    var team         = app.board.find("#team"+num)
    var teamScore    = {var: parseInt(team.html())}
    var teamScoreUpdated = (teamScore.var + currentScore.var)
    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated, 
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
      },
      ease: Power3.easeOut,
    });
    
    TweenMax.to(currentScore, 1, {
      var: 0, 
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },

  changeQuestion: function(){
    app.currentQ++
    app.makeQuestion(app.currentQ)
  },

  init: function(){
    app.questions = Object.keys(app.allData)
    // app.shuffle(app.questions)
    app.makeQuestion(app.currentQ)
    $('body').append(app.board)

    app.board.find('#newQuestion' ).on('click', app.changeQuestion)
    app.board.find('#awardTeam1'  ).on('click', app.awardPoints)
    app.board.find('#awardTeam2'  ).on('click', app.awardPoints)
  }  
}
app.init()