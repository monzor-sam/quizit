/* =========================================================
   QuizIT — REUSABLE MODE SELECTION
   =========================================================

   This file controls:

   • Mode selection
   • Reviewer mode
   • Quiz mode
   • Back to mode selection

   It does NOT replace quiz.js.
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           GET SCREENS
        ================================================= */

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


        /* =================================================
           GET BUTTONS
        ================================================= */

        const reviewerModeBtn =
            document.getElementById(
                "reviewerModeBtn"
            );

        const quizModeBtn =
            document.getElementById(
                "quizModeBtn"
            );

        const reviewerBackBtn =
            document.getElementById(
                "reviewerBackBtn"
            );


        /* =================================================
           INITIAL STATE
        ================================================= */

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


        /* =================================================
           REVIEWER MODE
        ================================================= */

        if (reviewerModeBtn) {

            reviewerModeBtn.addEventListener(
                "click",
                function () {


                    /*
                     * Check whether this subject
                     * has a reviewer PDF configured.
                     */

                    if (
                        typeof REVIEWER_PDF ===
                        "undefined" ||
                        !REVIEWER_PDF
                    ) {

                        alert(
                            "No reviewer PDF has been configured."
                        );

                        return;
                    }


                    /*
                     * Hide mode selection.
                     */

                    if (modeScreen) {

                        modeScreen.style.display =
                            "none";

                    }


                    /*
                     * Hide quiz screens.
                     */

                    if (startScreen) {

                        startScreen.style.display =
                            "none";

                    }

                    if (quizScreen) {

                        quizScreen.style.display =
                            "none";

                    }

                    if (resultScreen) {

                        resultScreen.style.display =
                            "none";

                    }


                    /*
                     * Show reviewer.
                     */

                    if (reviewerScreen) {

                        reviewerScreen.style.display =
                            "block";

                    }


                    /*
                     * Load the PDF.
                     *
                     * pdf.js exposes this function
                     * globally.
                     */

                    if (
                        typeof window.loadReviewerPDF ===
                        "function"
                    ) {

                        window.loadReviewerPDF(
                            REVIEWER_PDF
                        );

                    } else {

                        console.error(
                            "pdf.js has not loaded yet."
                        );

                    }


                    window.scrollTo(
                        0,
                        0
                    );

                }
            );

        }


        /* =================================================
           QUIZ MODE
        ================================================= */

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
                     * Show the EXISTING
                     * quiz start screen.
                     *
                     * quiz.js continues to
                     * control the actual quiz.
                     */

                    if (startScreen) {

                        startScreen.style.display =
                            "block";

                    }


                    window.scrollTo(
                        0,
                        0
                    );

                }
            );

        }


        /* =================================================
           BACK FROM REVIEWER
        ================================================= */

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
                     * Clear rendered PDF pages.
                     */

                    const pdfViewer =
                        document.getElementById(
                            "pdfViewer"
                        );

                    if (pdfViewer) {

                        pdfViewer.innerHTML = "";

                    }


                    /*
                     * Show mode selection.
                     */

                    if (modeScreen) {

                        modeScreen.style.display =
                            "block";

                    }


                    window.scrollTo(
                        0,
                        0
                    );

                }
            );

        }

    }
);