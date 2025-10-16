let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = []; // array met true/false per vraag


const scoreElement = document.getElementById("score");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const qimg = document.getElementById("qimg");

// CSV laden
fetch('questions.csv')
  .then(res => res.text())
  .then(data => {
    const rows = data.trim().split('\n');
    rows.shift(); // headers verwijderen

    rows.forEach(row => {
      const cols = row.split(';');
      const questionText = cols[0].trim();
      const image = cols[1].trim();
      const category = cols[2].trim();
      const answers = [];

      for (let i = 3; i <= 5; i++) { // 3 antwoorden
        const letter = String.fromCharCode(65 + (i-3)); // A,B,C
        answers.push({
          Text: cols[i].trim(),
          correct: cols[6].trim().toUpperCase() === letter
        });
      }

      questions.push({
        question: questionText,
        image: image,
        category: category,
        answer: answers
      });
    });

    showQuestion(); // start de quiz
  });

// Score updaten
function updateScore() {
    const correct = answeredQuestions.filter(ans => ans === true).length;
    const wrong = answeredQuestions.filter(ans => ans === false).length;
    const total = correct + wrong;

    let percentage = 0;
    if (total > 0) {
        percentage = Math.round((correct / total) * 100);
    }

    scoreElement.innerHTML =
      `Juist: ${correct} | Fout: ${wrong} | Percentage: ${percentage}%`;
}

// Vraag tonen
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];

   

    // === Vraagnummer + tekst ===
    const qText = document.createElement("div");
    qText.innerHTML = `<span class="question-label">${currentQuestionIndex + 1}</span> ${currentQuestion.question}`;
    questionElement.appendChild(qText); questionElement.innerHTML = `<span class="question-label">${currentQuestionIndex+1}</span>${currentQuestion.question}`;

    // === AANDACHT-afbeelding controleren ===
    if (currentQuestion.category.toUpperCase() === "AANDACHT") {
        const alertImg = document.createElement("img");
        alertImg.src = "./Images/opgelet.JPG";
        alertImg.alt = "Opgelet!";
        alertImg.classList.add("alert-image");
        questionElement.prepend(alertImg); // bovenaan tonen
    }

    if(currentQuestion.image){
        qimg.src = currentQuestion.image;
        qimg.style.display = "block";
    } else {
        qimg.style.display = "none";
    }

    currentQuestion.answer.forEach((answer,index)=>{
        const button = document.createElement("button");
        const label = String.fromCharCode(65+index); // A,B,C
        button.innerHTML = `<span class="answer-label">${label}</span>${answer.Text}`;
        button.classList.add("btn");
        if(answer.correct) button.dataset.correct = true;
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });

    updateScore();
}

// Reset antwoordknoppen
function resetState(){
    answerButtons.innerHTML = "";
}

// Antwoord selecteren
function selectAnswer(e){
    const selectedBtn = e.target.closest("button");
    const isCorrect = selectedBtn.dataset.correct === "true";

    // Update answeredQuestions
    answeredQuestions[currentQuestionIndex] = isCorrect;

    // Alle knoppen uitschakelen
    Array.from(answerButtons.children).forEach(button=>{
        button.disabled = true;
    });

    if(isCorrect){
        selectedBtn.classList.add("correct");
    } else {
        selectedBtn.classList.add("incorrect");

        Array.from(answerButtons.children).forEach(button=>{
            if(button.dataset.correct === "true") button.classList.add("correct");
        });
    }

    updateScore();
    nextButton.style.display = "block";
}

// Volgende vraag
nextButton.addEventListener("click", ()=>{
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
        nextButton.style.display = "none";
    } else {
        showFinalScore();
    }
});

// Eindscore tonen
function showFinalScore() {
    const correct = answeredQuestions.filter(ans => ans === true).length;
    const wrong = answeredQuestions.filter(ans => ans === false).length;
    const total = wrong+correct;
    const percentage = Math.round((correct / total) * 100);

    questionElement.innerHTML = `
        Juiste antwoorden: ${correct} <br>
        Foute antwoorden: ${wrong} <br>
        Percentage: ${percentage}%
    `;
    answerButtons.innerHTML = "";
    nextButton.textContent = "Opnieuw spelen";
    nextButton.style.display = "block";
    nextButton.onclick = () => location.reload();
}

const jumpInput = document.getElementById("jumpTo");
const jumpBtn = document.getElementById("jumpBtn");

// Naar een specifiek vraagnummer springen
function goToQuestionNumber(num) {
    const index = num - 1; // omdat vragen in array vanaf 0 tellen
    if (index >= 0 && index < questions.length) {
        currentQuestionIndex = index;
        showQuestion(); // toont vraag + antwoorden in de bestaande lay-out
    } else {
        alert("Geen geldige vraag: " + num);
    }
}

jumpBtn.addEventListener("click", () => {
    const num = parseInt(jumpInput.value);
    if (!isNaN(num)) {
        goToQuestionNumber(num);
    }
});

const restartButton = document.getElementById("restartButton");

restartButton.onclick = () => location.reload();
    // Zet quiz terug naar beginwaarden
   // currentQuestionIndex = 0;
   // answeredQuestions = [];

    // Toon de eerste vraag
  //  showQuestion();

    // Maak de score & knoppen weer zichtbaar
  //  questionElement.style.display = "block";
  //  answerButtons.style.display = "block";
//};