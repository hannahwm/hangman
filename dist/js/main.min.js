// HangMan II script- By Chris Fortey (http://www.c-g-f.net/)
// For this and over 400+ free scripts, visit JavaScript Kit- http://www.javascriptkit.com/
// Please keep notice intact

var $ = jQuery;

var can_play = true;

var easyAnswers = new Array("EASY ANSWER", "EASY'S ANSWER");

var easyQuestions = new Array("easy question", "Easy question with apostrophe");

var mediumAnswers = new Array("MEDIUM ANSWER", "MEDIUM-ANSWER");

var mediumQuestions = new Array("medium question", "Medium question with dash");

var hardAnswers = new Array("HARD ANSWER");

var hardQuestions = new Array("hard question");

var to_guess = "";
var display_word = "";
var used_letters = "";
var wrong_guesses = 0;
var difficulty = "";

function selectLetter(l)
{
if (can_play == false)
  {
  return;
  }

if (used_letters.indexOf(l) != -1)
  {
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
    // won
    if ( difficulty === "hard" ) {
      document.hm.src="/interactive/2018/08/hangman/images/woman-won.svg";
    } else if ( difficulty === "medium" ) {
      document.hm.src="/interactive/2018/08/hangman/images/man-won.svg";
    } else {
      document.hm.src="/interactive/2018/08/hangman/images/paws-won.svg";
    }

    $(".hangman-message").addClass("visible").html("Congratulations! You won.");

    if ( difficulty === "hard" ) {
      $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait-woman.svg");
    } else if ( difficulty === "medium" ) {
      $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait.svg");
    } else {
      $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait-paws.svg");
    }


    setTimeout(function() {
      $(".hangman-share").fadeIn();
    }, 1000);

    can_play = false;
    }
  } else {
    // incorrect letter guess
    $("." + l ).addClass("disabled");

    wrong_guesses += 1;

    if (wrong_guesses == 10) {
      // lost
      $(".hangman-message").addClass("visible").html("Oh no! You lost.");

      if ( difficulty === "hard" ) {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait-woman-lost.svg");
      } else if ( difficulty === "medium" ) {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait-lost.svg");
      } else {
        $(".hangman-share__portrait").attr("src", "/interactive/2018/08/hangman/images/portrait-paws-lost.svg");
      }

      $(".bucket").addClass("hidden");

      setTimeout(function() {
        $(".hangman-share").fadeIn();
      }, 1000);

      can_play = false;
    } else {

      //play water gif
      var waterDiv = $(".hangman-water-gif img");
      var image = new Image();
      image.src = "/interactive/2018/08/hangman/images/water.gif";
      var placeholdImg = new Image();
      placeholdImg.src = "/interactive/2018/08/hangman/images/water-placeholder.png";
      waterDiv.attr("src", image.src);

      setTimeout( function() {
        waterDiv.attr("src", placeholdImg.src);
      }, 2000);

    }

    if ( difficulty === "hard" ) {
      eval("document.hm.src=\"/interactive/2018/08/hangman/images/woman-" + wrong_guesses + ".svg\"");
    } else if ( difficulty === "medium" ) {
      eval("document.hm.src=\"/interactive/2018/08/hangman/images/man-" + wrong_guesses + ".svg\"");
    } else {
      eval("document.hm.src=\"/interactive/2018/08/hangman/images/paws-" + wrong_guesses + ".svg\"");
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
    document.hm.src="/interactive/2018/08/hangman/images/woman-start.svg";

  } else if ( difficulty === "medium" ) {
    document.hm.src="/interactive/2018/08/hangman/images/man-start.svg";

  } else {
    document.hm.src="/interactive/2018/08/hangman/images/paws-start.svg";
  }

  $(".bucket").removeClass("hidden");

  $(".hangman-message").removeClass("visible").html("How well do you know Northeastern?");
  $(".letters a").each( function() {
    $(this).removeClass("disabled highlight");
  });
}

function selectWord() {
  can_play = true;

  if ( difficulty === "hard" ) {
    random_number = Math.round(Math.random() * (hardAnswers.length - 1));

    to_guess = hardAnswers[random_number];
    questions_val = hardQuestions[random_number];

  } else if ( difficulty === "medium" ) {
    random_number = Math.round(Math.random() * (mediumAnswers.length - 1));

    to_guess = mediumAnswers[random_number];
    questions_val = mediumQuestions[random_number];

  } else {
    random_number = Math.round(Math.random() * (easyAnswers.length - 1));

    to_guess = easyAnswers[random_number];
    questions_val = easyQuestions[random_number];

  }

  // document.game.question.value = questions_val;
  $(".question").text(questions_val);

  // display masked word
  masked_word = createMask(to_guess);
  document.game.displayWord.value = masked_word;
  display_word = masked_word;
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
      reset();
    }, 200);
  });

  reset();
  return true;
};
