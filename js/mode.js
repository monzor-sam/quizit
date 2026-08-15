/* =========================================================
   QuizIT — Reusable Mode Selection
   =========================================================

   Reviewer:
       Opens the configured PDF.

   Quiz:
       Opens the EXISTING startScreen.

   This does NOT replace the existing quiz engine.
   ========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const modeScreen =
        document.getElementById("modeScreen");

    const reviewerScreen =
        document.getElementById("reviewerScreen");

    const startScreen =
        document.getElementById("startScreen");

    const quizScreen =
        document.getElementById("quizScreen");

    const resultScreen =
        document.getElementById("resultScreen");


    const reviewerModeBtn =
        document.getElementById("reviewerModeBtn");

    const quizModeBtn =
        document.getElementById("quizModeBtn");

    const reviewerBackBtn =
        document.getElementById("reviewerBackBtn");

    const reviewerFrame =
        document.getElementById("reviewerFrame");


    /* =====================================================
       INITIAL STATE
       
       Mode Selection is shown first.
       Existing quiz screens remain hidden.
    ===================================================== */

    if (modeScreen) {
        modeScreen.style.display = "block";
    }

    if (reviewerScreen) {
        reviewerScreen.style.display = "none";
    }

    if (startScreen) {
        startScreen.style.display = "none";
    }

    if (quizScreen) {
        quizScreen.style.display = "none";
    }

    if (resultScreen) {
        resultScreen.style.display = "none";
    }


    /* =====================================================
       REVIEWER MODE
    ===================================================== */

    if (reviewerModeBtn) {

        reviewerModeBtn.addEventListener(
            "click",
            function () {

                /*
                 * Make sure the PDF path exists.
                 */

                if (
                    typeof REVIEWER_PDF === "undefined" ||
                    !REVIEWER_PDF
                ) {

                    alert(
                        "No reviewer PDF has been configured."
                    );

                    return;
                }


                /*
                 * Load the PDF.
                 */

                if (reviewerFrame) {

                    reviewerFrame.src =
                        REVIEWER_PDF;

                }


                /*
                 * Hide other screens.
                 */

                if (modeScreen) {
                    modeScreen.style.display = "none";
                }

                if (startScreen) {
                    startScreen.style.display = "none";
                }

                if (quizScreen) {
                    quizScreen.style.display = "none";
                }

                if (resultScreen) {
                    resultScreen.style.display = "none";
                }


                /*
                 * Show reviewer.
                 */

                if (reviewerScreen) {

                    reviewerScreen.style.display =
                        "block";

                }


                window.scrollTo(0, 0);

            }
        );

    }


    /* =====================================================
       QUIZ MODE
       
       IMPORTANT:
       Show the EXISTING startScreen instead of directly
       opening quizScreen.
       
       This preserves your existing quiz.js behavior.
    ===================================================== */

    if (quizModeBtn) {

        quizModeBtn.addEventListener(
            "click",
            function () {


                /*
                 * Hide mode selection.
                 */

                if (modeScreen) {

                    modeScreen.style.display =
                        "none";

                }


                /*
                 * Hide reviewer.
                 */

                if (reviewerScreen) {

                    reviewerScreen.style.display =
                        "none";

                }


                /*
                 * Hide results.
                 */

                if (resultScreen) {

                    resultScreen.style.display =
                        "none";

                }


                /*
                 * Show your EXISTING start screen.
                 */

                if (startScreen) {

                    startScreen.style.display =
                        "block";

                }


                window.scrollTo(0, 0);

            }
        );

    }


    /* =====================================================
       BACK FROM REVIEWER
    ===================================================== */

    if (reviewerBackBtn) {

        reviewerBackBtn.addEventListener(
            "click",
            function () {


                /*
                 * Hide reviewer.
                 */

                if (reviewerScreen) {

                    reviewerScreen.style.display =
                        "none";

                }


                /*
                 * Clear PDF.

                 * This prevents the PDF from continuing
                 * unnecessarily in the background.
                 */

                if (reviewerFrame) {

                    reviewerFrame.src = "";

                }


                /*
                 * Show mode selection.
                 */

                if (modeScreen) {

                    modeScreen.style.display =
                        "block";

                }


                window.scrollTo(0, 0);

            }
        );

    }


});