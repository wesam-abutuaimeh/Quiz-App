const startBtn = document.querySelector(".start-btn button");
const quizRules = document.querySelector(".quiz-rules");
const continueQuiz = document.querySelector(".continue-quiz");
const leaveQuiz = document.querySelector(".exit-quiz");
const quizQuestions = document.querySelector(".question-area");
const bullets = document.querySelector(".bullets .spans");
let answersArea = document.querySelector(".answers-area");
let questionTitle = document.querySelector(".question-title");
let questionCategory = document.querySelector(".category");
let submitAndContinue = document.querySelector(".submit-and-continue");
let quizResultContainer = document.querySelector(".result");
let theResult = document.querySelector(".the-result");
let finishQuiz = document.querySelector(".finish-quiz");
let repeatQuiz = document.querySelector(".repeat-quiz");
let theDuration = document.querySelector(".seconds");

startBtn.addEventListener("click", () => {
  quizRules.classList.add("show-rules");
});

leaveQuiz.addEventListener("click", () => {
  quizRules.classList.remove("show-rules");
});

continueQuiz.addEventListener("click", () => {
  quizRules.classList.remove("show-rules");
  quizQuestions.classList.add("showQuestion-area");
  questionDuration(15, "/js/questions.json".length);
});

repeatQuiz.addEventListener("click", () => {
  quizResultContainer.classList.remove("show-result");
});

finishQuiz.addEventListener("click", () => {
  window.close();
});

let questionIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function fetchQuestions() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText),
        questionsLength = questions.length;

      createBullets(questionsLength, questions);

      appendQuestionData(questions[questionIndex], questionsLength);

      submitAndContinue.onclick = () => {
        let therightAnswer = questions[questionIndex].right_answer;

        questionIndex++;

        clearInterval(countdownInterval);
        questionDuration(15, questionsLength);

        cheakRightAnswers(therightAnswer, questionsLength);

        questionCategory.innerHTML = "";

        answersArea.innerHTML = "";

        questionTitle.innerHTML = "";

        appendQuestionData(questions[questionIndex], questionsLength);

        colorizeBullets();

        showResult(questionsLength);
      };
    }
  };

  request.open("GET", "/js/questions.json");
  request.send();
}

fetchQuestions(); // main function

function createBullets(bulletsNumber, category) {
  let bulletsSpan;
  for (let i = 0; i < bulletsNumber; i++) {
    bulletsSpan = document.createElement("span");
    bulletsSpan.className = "bulletsSpan";
    bullets.appendChild(bulletsSpan);
  }
}

function appendQuestionData(questions, questionsLength) {
  let radioInput, mainDiv, theLabel, theLabelText;

  if (questionIndex < questionsLength) {
    let questionHeading = document.createElement("h3");
    questionHeading.append(document.createTextNode(questions["question"]));
    questionTitle.appendChild(questionHeading);

    let category = document.createElement("span");
    category.append(
      document.createTextNode("category :" + questions["category"])
    );
    questionCategory.appendChild(category);

    for (let i = 1; i <= 4; i++) {
      mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      mainDiv.style.cssText = "line-height:1.8";
      radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "answer";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = questions[`answer_${i}`];

      theLabel = document.createElement("label");
      theLabel.style.cssText = "padding-left: 20px";
      theLabel.htmlFor = `answer_${i}`;

      theLabelText = document.createTextNode(questions[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);

      i === 1 ? radioInput.setAttribute("checked", true) : false;
    }
  }
}

function cheakRightAnswers(therightAnswer, questionsLength) {
  if (questionIndex < questionsLength) {
    let answers = document.getElementsByTagName("input");
    let theChoosenAnswer;
    const length = answers.length;
    for (let i = 0; i < length; i++) {
      answers[i].checked ? (theChoosenAnswer = answers[i].dataset.answer) : "";
    }
    if (therightAnswer === theChoosenAnswer) rightAnswers += 1;
    // TODO => Must Not Select More One Option
  }
}

function colorizeBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  bullets.forEach((span, index) => {
    if (questionIndex === index) {
      span.classList.add("active");
    }
  });
}

function showResult(questionsLength) {
  if (questionIndex === questionsLength) {
    quizQuestions.classList.remove("showQuestion-area");
    quizResultContainer.classList.add("show-result");
    let finalResult;

    if (rightAnswers <= questionsLength) {
      if (
        rightAnswers > questionsLength / 2 &&
        rightAnswers < questionsLength
      ) {
        finalResult = `<span class="good">Good</span>, ${rightAnswers} From ${questionsLength}`;
      }
      if (rightAnswers === questionsLength) {
        finalResult = `<span class="perfect">Perfect</span>, All Answers Is Right 💌`;
      }
      if (rightAnswers < questionsLength / 2 && rightAnswers >= 0) {
        finalResult = `<span class="bad">Bad</span>, ${rightAnswers} From ${questionsLength}`;
      }
    }
    theResult.innerHTML = finalResult;
  }
}

function questionDuration(duration, questionsLength) {
  if (questionIndex < questionsLength) {
    let seconds;
    countdownInterval = setInterval(() => {
      seconds = duration;
      theDuration.innerHTML = seconds;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitAndContinue.click();
      }
    }, 1000);
  }
}
