// HangMan II script- By Chris Fortey (http://www.c-g-f.net/)
// For this and over 400+ free scripts, visit JavaScript Kit- http://www.javascriptkit.com/
// Please keep notice intact
//NOTE: This script has been heavily modified from the original by Chris Fortey

var $ = jQuery;

var can_play = true;


var easyQuestions = new Array(
  "The Adirondack chairs found around campus are made from recycled what?",
  "The Northeastern men’s hockey team won this hockey tournament for the first time in 30 years in 2018.",
  "Northeastern’s seventh president took office in 2006. Who is he?",
  "Northeastern’s mascot is a giant Husky and can be seen at events all over campus. What is his name?",
  "A system of _____ can help students and staff get from one building to another.",
  "What are the call letters of Northeastern’s student-run radio station?",
  "This company makes the products that can be found across campus to help Northeastern students answer various questions.",
  "Northeastern has regional campuses outside Boston. Where are they?",
  "What’s the social media hashtag to see what everyone else is doing in the Northeastern community?",
  "What is Northeastern’s motto?"
);

var easyAnswers = new Array(
  "PLASTIC BOTTLES",
  "THE BEANPOT",
  "JOSEPH E. AOUN",
  "PAWS",
  "TUNNELS",
  "WRBB",
  "AMAZON",
  "CHARLOTTE, SEATTLE, SILICON VALLEY, TORONTO",
  "#NUEXPERIENCE",
  "LUX VERITAS VIRTUS"
);

var mediumQuestions = new Array(
  "There is a sculpture on campus that features a giant sphere that spouts water. What is it called?",
  "President Aoun recently wrote a book titled…",
  "What is the name of Northeastern’s award winning a cappella group?",
  "This famous Northeastern watering hole was named after the dog of former sports information director and Husky icon Jack Grinold.",
  "What is the name of Northeastern’s student-led venture accelerator?",
  "Which two Northeastern satellite campuses used to be missile bases?",
  "Where should you sit if you’re a huge Northeastern hockey fan?",
  "On how many continents can students work on co-op at Northeastern?",
  "Where on campus have Chuck Berry, Jerry Lee Lewis, Phish and The Doors played?",
  "Who was the Northeastern graduate who helped his team win an NBA Championship in 2011?",
  "What is the name of the NUPD app that students, faculty and staff can use to stay safe on campus?"
);

var mediumAnswers = new Array(
  "THE ORB",
  "ROBOT-PROOF",
  "THE NOR'EASTERS",
  "PUNTER'S PUB",
  "IDEA",
  "BURLINGTON AND NAHANT",
  "THE DOGHOUSE",
  "SEVEN",
  "MATTHEWS ARENA",
  "JJ BAREA",
  "SAFEZONE"
);

var hardQuestions = new Array(
  "Which pilot flew across the atlantic then celebrated at Matthews Arena?",
  "Which major sporting event debuted where Northeastern’s Boston campus currently sits?",
  "Matthews Arena hosted rallies for two presidents who shared what last name?",
  "Matthews Arena was originally known as what?",
  "This team played its first-ever home game at the now-Matthews Arena in 1924.",
  "This team played its first-ever home game at the now-Matthews Arena in 1946.",
  "This famous boxer used to train at Santos Gym,which is now the Varsity Club at Matthews Arena,before his scheduled rematch with Sonny Liston in 1964.",
  "This organization originally founded Northeastern as the Evening Institute for Younger Men in 1898.",
  "Northeastern athletics teams (except hockey and rowing) compete in this NCAA Division I conference.",
  "This building on campus has more than 2 million visitors each year.",
  "At Northeastern’s Marine Science Center, researchers are collecting and identifying specimens for a biorepository. What is the name of the repository?"
);

var hardAnswers = new Array(
  "AMELIA EARHART",
  "WORLD SERIES",
  "ROOSEVELT",
  "BOSTON ARENA",
  "BOSTON BRUINS",
  "BOSTON CELTICS",
  "MUHAMMAD ALI",
  "YMCA",
  "COLONIAL ATHLETIC ASSOCIATION",
  "SNELL LIBRARY",
  "OCEAN GENOME LEGACY"
);

var to_guess = "";
var display_word = "";
var used_letters = "";
var wrong_guesses = 0;
var difficulty = "";
var randomFive = [];
var counter = 0;
var easyPlayed = [],
    mediumPlayed = [],
    hardPlayed = [];

function selectLetter(l) {
  if (can_play == false) {
    return;
  }

  if (used_letters.indexOf(l) != -1) {
    return;
  }

  used_letters += l;


  if (to_guess.indexOf(l) != -1) {
   // correct letter guess
    $("." + l ).addClass("highlight");
    pos = 0;
    temp_mask = display_word;


    while (to_guess.indexOf(l, pos) != -1) {
      pos = to_guess.indexOf(l, pos);
      end = pos + 1;

      start_text = temp_mask.substring(0, pos);
      end_text = temp_mask.substring(end, temp_mask.length);

      temp_mask = start_text + l + end_text;
      pos = end;
    }

    display_word = temp_mask;
    document.game.displayWord.value = display_word;

    if (display_word.indexOf("_") == -1) {
      counter++;
      $(".counter").html(counter + "/5");

      if (counter < 5) {
        reset();
      } else {

        // won
        if ( difficulty === "hard" ) {
          document.hm.src="/interactive/2018/09/dunktank/images/woman-won.svg";
          $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait-woman.svg");
        } else if ( difficulty === "medium" ) {
          document.hm.src="/interactive/2018/09/dunktank/images/man-won.svg";
          $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait.svg");
        } else {
          document.hm.src="/interactive/2018/09/dunktank/images/paws-won.svg";
          $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait-paws.svg");
        }

        $(".hangman-message").addClass("visible").html("Congratulations! You won.");

        setTimeout(function() {
          $(".hangman-share").fadeIn();
        }, 1000);

        can_play = false;

      }
    }
  } else {
    // incorrect letter guess
    $("." + l ).addClass("disabled");

    wrong_guesses += 1;

    if (wrong_guesses == 10) {
      // lost
      $(".hangman-message").addClass("visible").html("Oh no! You lost.");

      if ( difficulty === "hard" ) {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait-woman-lost.svg");
      } else if ( difficulty === "medium" ) {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait-lost.svg");
      } else {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/09/dunktank/images/portrait-paws-lost.svg");
      }

      setTimeout(function() {
        $(".bucket").addClass("hidden");
      },100);

      setTimeout(function() {
        $(".hangman-share").fadeIn();
      }, 1000);

      can_play = false;
    } else {

      //play water gif
      var waterDiv = $(".hangman-water-gif img");
      var image = new Image();
      image.src = "/interactive/2018/09/dunktank/images/water.gif";
      var placeholdImg = new Image();
      placeholdImg.src = "/interactive/2018/09/dunktank/images/water-placeholder.png";
      waterDiv.attr("src", image.src);

      setTimeout( function() {
        waterDiv.attr("src", placeholdImg.src);
      }, 2000);

    }

    if ( difficulty === "hard" ) {
      eval("document.hm.src=\"/interactive/2018/09/dunktank/images/woman-" + wrong_guesses + ".svg\"");
    } else if ( difficulty === "medium" ) {
      eval("document.hm.src=\"/interactive/2018/09/dunktank/images/man-" + wrong_guesses + ".svg\"");
    } else {
      eval("document.hm.src=\"/interactive/2018/09/dunktank/images/paws-" + wrong_guesses + ".svg\"");
    }
  }
}

function reset()
{
  selectWord();
  document.game.usedLetters.value = "";
  used_letters = "";
  wrong_guesses = 0;

  if ( difficulty === "hard" ) {
    document.hm.src="/interactive/2018/09/dunktank/images/woman-start.svg";

  } else if ( difficulty === "medium" ) {
    document.hm.src="/interactive/2018/09/dunktank/images/man-start.svg";

  } else {
    document.hm.src="/interactive/2018/09/dunktank/images/paws-start.svg";
  }

  $(".bucket").removeClass("hidden");

  $(".hangman-message").removeClass("visible").html("How well do you know Northeastern?");
  $(".letters a").each( function() {
    $(this).removeClass("disabled highlight");
  });
}

function createRandomFive() {
  for(var i = 0; i < 5; i++) {
      var numberIsInArray = false;

      var random_number;

      if ( difficulty === "hard" ) {
        random_number = Math.round(Math.random() * (hardAnswers.length - 1));
      } else if ( difficulty === "medium" ) {
        random_number = Math.round(Math.random() * (mediumAnswers.length - 1));
      } else {
        random_number = Math.round(Math.random() * (easyAnswers.length - 1));
      }

      for(var j = 0; j < randomFive.length; j++){
          if(random_number === randomFive[j]) {
              numberIsInArray = true;
              i--;
          }
      }
      if(!numberIsInArray){
         randomFive.push(random_number);
      }

  }


}

function selectWord() {
  can_play = true;

  // var randOfFive = Math.floor(Math.random() * (4 - 0) + 0);
  var ArrayNum = randomFive[counter];

  // if (counter < 5) {

    if ( difficulty === "hard" ) {
      to_guess = hardAnswers[ArrayNum];
      questions_val = hardQuestions[ArrayNum];
    } else if ( difficulty === "medium" ) {
      to_guess = mediumAnswers[ArrayNum];
      questions_val = mediumQuestions[ArrayNum];
    } else {
      to_guess = easyAnswers[ArrayNum];
      questions_val = easyQuestions[ArrayNum];
    }

    setTimeout( function() {
      $(".hangman-form").addClass("hidden");
    }, 200);


    setTimeout( function() {
      $(".question").text(questions_val);
      masked_word = createMask(to_guess);
      document.game.displayWord.value = masked_word;
      display_word = masked_word;
      $(".hangman-form").removeClass("hidden");
    }, 1000);

}

function createMask(m) {

  var answer = m.split(" "),
      mask = "",
      maskArray = [];

  for (i = 0; i < answer.length; i ++) {
    var id = i;
    var curWord = answer[i];

    var maskedWord = "";

    for (o = 0; o < curWord.length; o ++) {

      var letter = curWord.charAt(o);

      if (letter === "'") {
        maskedWord += "\’";
      } else if (letter === "-") {
        maskedWord += "\-";
      } else if (letter === "#") {
        maskedWord += "\#";
      } else if (letter === ",") {
        maskedWord += "\,";
      } else if (letter === ".") {
        maskedWord += "\.";
      } else {
        maskedWord += "_";
      }
    }
    maskArray.push(maskedWord);
  }

  for (p = 0; p < maskArray.length; p ++) {
    mask = mask + maskArray[p] + " ";
  }

  return mask;

}


window.onload = function(e){

  $(".difficulty-level").each(function() {
    var curButton = $(this);
    curButton.on("click touchstart", function(){
      var level = curButton.attr("id");
      $(".difficulty-level").removeClass("selected");
      difficulty = level;
      curButton.addClass("selected");
      reset();
    });
  });

  $(".hangman-share__close").on("click touchstart", function() {
    $(".hangman-share").fadeOut();
  });

  $(".hangman-share__reset").on("click touchstart", function() {
    $(".hangman-share").fadeOut();
    setTimeout(function() {
      counter = 0;
      $(".counter").html(counter + "/5");

      randomFive = [];

      //create an array of five questions
      createRandomFive();

      reset();
    }, 200);

  });

  $(".hangman-reset").on("click touchstart", function() {
    counter = 0;
    $(".counter").html(counter + "/5");

    randomFive = [];

    //create an array of five questions
    createRandomFive();

    reset();
  });

  randomFive = [];

  //create an array of five questions
  createRandomFive();

  reset();
  return true;
};
