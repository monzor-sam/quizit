/* =========================================
   QUIZIT — SHARED QUIZ ENGINE
   ========================================= */


/* =========================================
   SETTINGS
   ========================================= */

const TIME_LIMIT = 30;


/* =========================================
   QUIZ VARIABLES
   ========================================= */

   let activeQuestions = [];

let currentIndex = 0;

let score = 0;

let streak = 0;

let bestStreak = 0;

let correctCount = 0;

let missed = [];

let questionResults = [];

let timeLeft = TIME_LIMIT;

let timer = null;


/* =========================================
   TOPIC INFORMATION
   ========================================= */

const TOPIC_META = {

    "IPT": {
        label: "Integrative Programming & Technologies",
        icon: "🔌"
    },

    "OOP": {
        label: "Object-Oriented Programming",
        icon: "🧩"
    },

    "Visual Studio": {
        label: "Visual Studio",
        icon: "🛠️"
    }

};


/* =========================================
   SHUFFLE
   ========================================= */

function shuffle(array) {

    const result = array.slice();

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;
}


/* =========================================
   DOM READY
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeQuiz();

    }
);


/* =========================================
   INITIALIZE
   ========================================= */

function initializeQuiz() {

    const startBtn =
        document.getElementById("startBtn");

    if (startBtn) {

        startBtn.addEventListener(
            "click",
            startQuiz
        );

    }


    const nextBtn =
        document.getElementById("nextBtn");

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextQuestion
        );

    }


    /*
     * If the page has a topic selection area,
     * create the topic buttons.
     */

    createTopicSelection();

}


/* =========================================
   TOPIC SELECTION
   ========================================= */

function createTopicSelection() {

    const container =
        document.getElementById("topicSelect");

    /*
     * The simplified CCIT102 page does not
     * currently have topicSelect.
     *
     * In that case, simply select all topics.
     */

    if (!container) {

        window.selectedTopics =
            new Set(
                QUESTIONS.map(
                    question => question.topic
                )
            );

        return;

    }


    const topics = [
        ...new Set(
            QUESTIONS.map(
                question => question.topic
            )
        )
    ];


    window.selectedTopics =
        new Set(topics);


    container.innerHTML = "";


    topics.forEach(topic => {

        const meta =
            TOPIC_META[topic] || {
                label: topic,
                icon: "📚"
            };


        const count =
            QUESTIONS.filter(
                question =>
                    question.topic === topic
            ).length;


        const card =
            document.createElement("button");


        card.type = "button";

        card.className =
            "topic-card selected";


        card.innerHTML = `

            <span class="t-name">
                ${meta.icon} ${meta.label}
            </span>

            <span class="t-count">
                ${count} questions
            </span>

        `;


        card.addEventListener(
            "click",
            function () {

                if (
                    selectedTopics.has(topic)
                ) {

                    /*
                     * Don't allow all topics
                     * to be deselected.
                     */

                    if (
                        selectedTopics.size > 1
                    ) {

                        selectedTopics.delete(
                            topic
                        );

                        card.classList.remove(
                            "selected"
                        );

                    }

                } else {

                    selectedTopics.add(topic);

                    card.classList.add(
                        "selected"
                    );

                }

            }
        );


        container.appendChild(card);

    });

}


/* =========================================
   START QUIZ
   ========================================= */

function startQuiz() {

    /*
     * Get questions belonging to
     * selected topics.
     */

    activeQuestions =
        shuffle(
            QUESTIONS.filter(
                question =>
                    selectedTopics.has(
                        question.topic
                    )
            )
        );


    /*
     * Reset everything.
     */
    currentIndex = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    correctCount = 0;

    missed = [];

    questionResults = [];

    timeLeft = TIME_LIMIT;


    /*
     * Switch screens.
     */

    hideElement("startScreen");
    hideElement("resultScreen");
    showElement("quizScreen");


    updateHud();

    showQuestion();

}


/* =========================================
   SHOW QUESTION
   ========================================= */

function showQuestion() {

    const item =
        activeQuestions[currentIndex];


    if (!item) {

        endQuiz();

        return;

    }


    /*
     * Question number
     */

    setText(
        "questionNumber",
        `Question ${currentIndex + 1} of ${activeQuestions.length}`
    );


    /*
     * Score
     */

    setText(
        "scoreDisplay",
        `⭐ ${score} pts`
    );


    /*
     * Streak
     */

    setText(
        "streakDisplay",
        `🔥 ${streak}`
    );


    /*
     * Topic
     */

    const meta =
        TOPIC_META[item.topic] || {
            label: item.topic,
            icon: "📚"
        };


    setText(
        "topicLabel",
        `${meta.icon} ${meta.label}`
    );


    /*
     * Question
     */

    setText(
        "questionText",
        item.q
    );


    /*
     * Progress
     */

    const progress =
        (
            currentIndex /
            activeQuestions.length
        ) * 100;


    const progressBar =
        document.getElementById(
            "progressFill"
        );


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    /*
     * Hide feedback
     */

    hideElement("feedback");
    hideElement("explanation");

        const explanationBox =
            document.getElementById(
                "explanation"
            );

        if (explanationBox) {
            explanationBox.innerHTML = "";
}
    hideElement("nextBtn");


    /*
     * Create answers.
     *
     * We shuffle the answer choices
     * but keep track of the correct answer.
     */

    const correctText =
        item.options[item.correct];


    const shuffledOptions =
        shuffle(item.options);


    const newCorrectIndex =
        shuffledOptions.indexOf(
            correctText
        );


    const answersContainer =
        document.getElementById("answers");


    answersContainer.innerHTML = "";


    shuffledOptions.forEach(
        function (option, index) {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "answer";


            button.innerHTML = `

                <span class="a-shape">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span>
                    ${escapeHTML(option)}
                </span>

            `;


            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        index,
                        newCorrectIndex,
                        item,
                        option
                    );

                }
            );


            answersContainer.appendChild(
                button
            );

        }
    );


    /*
     * Start timer.
     */

    startTimer(
        newCorrectIndex,
        item
    );

}


/* =========================================
   TIMER
   ========================================= */

function startTimer(
    correctIndex,
    item
) {

    clearInterval(timer);


    timeLeft = TIME_LIMIT;


    updateTimer();


    timer =
        setInterval(
            function () {

                timeLeft--;

                updateTimer();


                if (timeLeft <= 0) {

                    clearInterval(timer);


                    selectAnswer(
                        -1,
                        correctIndex,
                        item,
                        null
                    );

                }

            },
            1000
        );

}


/* =========================================
   UPDATE TIMER
   ========================================= */

function updateTimer() {

    setText(
        "timer",
        timeLeft
    );


    const timerElement =
        document.getElementById(
            "timer"
        );


    if (!timerElement) return;


    /*
     * Change timer appearance
     * when time is running low.
     */

    if (timeLeft <= 5) {

        timerElement.style.color =
            "var(--wrong)";

    } else {

        timerElement.style.color =
            "var(--cream)";

    }

}

/* =========================================
   SELECT ANSWER
   ========================================= */

/* =========================================
   SELECT ANSWER
   ========================================= */

function selectAnswer(
    chosenIndex,
    correctIndex,
    item,
    chosenText
) {

    clearInterval(timer);

    const buttons =
        document.querySelectorAll(
            "#answers .answer"
        );

    /*
     * Disable all answers
     */

    buttons.forEach(
        function (button, index) {

            button.disabled = true;

            if (index === correctIndex) {

                button.classList.add(
                    "correct-answer"
                );

            } else if (index === chosenIndex) {

                button.classList.add(
                    "wrong-answer"
                );

            } else {

                button.classList.add(
                    "dim"
                );

            }

        }
    );


    /*
     * Get the correct answer
     */

    const correctAnswer =
        item.options[item.correct];


    /*
     * Get explanation.
     *
     * Supports both:
     * explain
     * explanation
     */

    const explanation =
        item.explain ||
        item.explanation ||
        "No explanation was provided for this question.";

        questionResults.push({

            question: item.q,

            yourAnswer:
                chosenIndex === -1
                    ? "No answer — Time's up!"
                    : chosenText,

            correctAnswer:
                correctAnswer,

            explanation:
                explanation,

            isCorrect:
                chosenIndex === correctIndex

        });

    /*
     * CORRECT
     */

    if (chosenIndex === correctIndex) {

        streak++;

        bestStreak =
            Math.max(
                bestStreak,
                streak
            );

        correctCount++;


        const streakBonus =
            Math.min(
                streak * 10,
                50
            );


        const timeBonus =
            Math.max(
                timeLeft,
                0
            ) * 4;


        const gained =
            100 +
            streakBonus +
            timeBonus;


        score += gained;


        /*
         * SHOW CORRECT FEEDBACK
         */

        showFeedback(
            `
            <div class="feedback-title">
                ${pickPraise()} +${gained} pts
            </div>

            <div class="answer-explanation">

                <strong>💡 Explanation</strong>

                <p>
                    ${escapeHTML(explanation)}
                </p>

            </div>
            `,
            "good"
        );

    }


    /*
     * WRONG / TIME OUT
     */

    else {

        streak = 0;

        missed.push(item);


        const message =
            chosenIndex === -1
                ? "⏱️ Time's up!"
                : "❌ Eeenggkkk Wrongch!";


        /*
         * SHOW WRONG FEEDBACK
         */

        showFeedback(
            `
            <div class="feedback-title">
                ${message}
            </div>

            <div class="answer-explanation">

                <strong>
                    ✅ Correct Answer
                </strong>

                <p class="correct-answer-text">
                    ${escapeHTML(correctAnswer)}
                </p>

                <strong>
                    💡 Explanation
                </strong>

                <p>
                    ${escapeHTML(explanation)}
                </p>

            </div>
            `,
            "bad"
        );

    }


    updateHud();


    /*
     * Show Next button
     */

    showElement("nextBtn");

}

/* =========================================
   FEEDBACK
   ========================================= */

function showFeedback(
    message,
    type
) {

    const feedback =
        document.getElementById(
            "feedback"
        );


    if (!feedback) return;


    feedback.innerHTML =
        message;


    feedback.className =
        `feedback-banner ${type}`;


    feedback.style.display =
        "block";

}


/* =========================================
   EXPLANATION
   ========================================= */

function showExplanation(
    explanation
) {

    const box =
        document.getElementById(
            "explanation"
        );


    if (!box) return;


    box.innerHTML =
        explanation;


    box.style.display =
        "block";

}


/* =========================================
   NEXT QUESTION
   ========================================= */

function nextQuestion() {

    currentIndex++;


    if (
        currentIndex >=
        activeQuestions.length
    ) {

        endQuiz();

        return;

    }


    showQuestion();

}


/* =========================================
   UPDATE HUD
   ========================================= */

function updateHud() {

    setText(
        "questionNumber",
        `Question ${currentIndex + 1} of ${activeQuestions.length}`
    );


    setText(
        "scoreDisplay",
        `⭐ ${score} pts`
    );


    setText(
        "streakDisplay",
        `🔥 ${streak}`
    );

}

/* =========================================
   END QUIZ
   ========================================= */

function endQuiz() {

    clearInterval(timer);


    hideElement("quizScreen");

    showElement("resultScreen");


    /*
     * Final statistics
     */

    setText(
        "finalScore",
        score
    );

    setText(
        "correctCount",
        correctCount
    );

    setText(
        "totalCount",
        activeQuestions.length
    );

    setText(
        "bestStreak",
        bestStreak
    );


    const accuracy =
        activeQuestions.length > 0
            ? Math.round(
                (
                    correctCount /
                    activeQuestions.length
                ) * 100
            )
            : 0;


    /*
     * Final message
     */

    let message;

    if (accuracy >= 90) {

        message =
            "🏆 Perfect! You're Exam Ready!";

    } else if (accuracy >= 75) {

        message =
            "⚡ Great job! Keep it up!";

    } else if (accuracy >= 50) {

        message =
            "🔌 Not bad! A little more review!";

    } else {

        message =
            "🧩 Keep reviewing! You got this!";

    }


    setText(
        "finalMessage",
        message
    );


    /*
     * QUESTION REVIEW
     */

    const reviewWrap =
        document.getElementById(
            "reviewWrap"
        );

    const reviewList =
        document.getElementById(
            "reviewList"
        );


    if (
        !reviewWrap ||
        !reviewList
    ) {

        console.error(
            "Review elements not found."
        );

        return;
    }


    reviewList.innerHTML = "";


    reviewWrap.style.display =
        "block";


    questionResults.forEach(
        function (result, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                result.isCorrect
                    ? "review-item review-correct"
                    : "review-item review-wrong";


            let html = `

                <div class="review-number">
                    Question ${index + 1}
                </div>

                <div class="rq">
                    ${escapeHTML(result.question)}
                </div>

            `;


            if (result.isCorrect) {

                html += `

                    <div class="review-status correct-status">
                        🟢 Correct
                    </div>

                    <div class="review-answer">

                        <strong>
                            Correct Answer:
                        </strong>

                        <span class="correct-text">
                            ${escapeHTML(result.correctAnswer)}
                        </span>

                    </div>

                `;

            } else {

                html += `

                    <div class="review-status wrong-status">
                        🔴 Incorrect
                    </div>

                    <div class="review-answer">

                        <strong>
                            Your Answer:
                        </strong>

                        <span class="your-answer">
                            ${escapeHTML(result.yourAnswer)}
                        </span>

                    </div>

                    <div class="review-answer">

                        <strong>
                            Correct Answer:
                        </strong>

                        <span class="correct-text">
                            ${escapeHTML(result.correctAnswer)}
                        </span>

                    </div>

                    <div class="review-explanation">

                        <strong>
                            💡 Explanation
                        </strong>

                        <p>
                            ${escapeHTML(result.explanation)}
                        </p>

                    </div>

                `;

            }


            div.innerHTML =
                html;


            reviewList.appendChild(
                div
            );

        }
    );

}

/* =========================================
   PRAISE
   ========================================= */

function pickPraise() {

    const praises = [

        "✅ Nicech!",

        "🎯 Correctch!",

        "🔥 Flow state ah!",

        "💡 Yiz galing taina!",

        "⚡ Perfectch!",

        "🚀 Ta is ma!"

    ];


    return praises[
        Math.floor(
            Math.random() *
            praises.length
        )
    ];

}


/* =========================================
   HELPER FUNCTIONS
   ========================================= */

function showElement(id) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.style.display = "";

}


function hideElement(id) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.style.display =
        "none";

}


function setText(
    id,
    text
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.textContent =
        text;

}


/*
 * Prevent question/answer text from
 * accidentally being interpreted as HTML.
 */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}