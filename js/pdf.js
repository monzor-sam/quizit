/* =========================================================
   QuizIT — PDF REVIEWER
   =========================================================

   Uses PDF.js to render reviewer PDFs directly
   onto the page.

   This gives us:

   • Mobile scrolling
   • Desktop scrolling
   • Responsive PDF pages
   • Touch-friendly viewing
   • No iframe PDF viewer
   ========================================================= */


/* =========================================================
   IMPORT PDF.JS
   ========================================================= */

import {
    getDocument,
    GlobalWorkerOptions
}
from
"https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";


/* =========================================================
   PDF.JS WORKER
   ========================================================= */

GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";


/* =========================================================
   CURRENT PDF
   ========================================================= */

let currentPDF = null;


/* =========================================================
   LOAD REVIEWER PDF
   ========================================================= */

async function loadReviewerPDF(pdfURL) {

    const pdfViewer =
        document.getElementById(
            "pdfViewer"
        );


    if (!pdfViewer) {

        console.error(
            "PDF viewer element was not found."
        );

        return;
    }


    if (!pdfURL) {

        console.error(
            "No reviewer PDF was provided."
        );

        return;
    }


    /*
     * Clear old PDF.
     */

    pdfViewer.innerHTML = "";


    /*
     * Loading message.
     */

    const loading =
        document.createElement(
            "div"
        );

    loading.className =
        "pdf-loading";

    loading.textContent =
        "Loading reviewer...";

    pdfViewer.appendChild(
        loading
    );


    try {


        /* =============================================
           LOAD PDF
        ============================================= */

        const loadingTask =
            getDocument(
                pdfURL
            );


        currentPDF =
            await loadingTask.promise;


        /* Remove loading message */

        loading.remove();


        /* =============================================
           RENDER ALL PAGES
        ============================================= */

        for (
            let pageNumber = 1;
            pageNumber <=
            currentPDF.numPages;
            pageNumber++
        ) {

            await renderPDFPage(
                currentPDF,
                pageNumber
            );

        }


    } catch (error) {

        console.error(
            "PDF loading error:",
            error
        );


        loading.textContent =
            "Unable to load the reviewer PDF.";

    }

}


/* =========================================================
   RENDER ONE PDF PAGE
   ========================================================= */

async function renderPDFPage(
    pdf,
    pageNumber
) {

    const pdfViewer =
        document.getElementById(
            "pdfViewer"
        );


    const page =
        await pdf.getPage(
            pageNumber
        );


    /* =============================================
       PAGE CONTAINER
    ============================================= */

    const pageContainer =
        document.createElement(
            "div"
        );

    pageContainer.className =
        "pdf-page";


    pageContainer.dataset.page =
        pageNumber;


    /* =============================================
       CANVAS
    ============================================= */

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.className =
        "pdf-canvas";


    const context =
        canvas.getContext(
            "2d"
        );


    /* =============================================
       ORIGINAL PDF SIZE
    ============================================= */

    const baseViewport =
        page.getViewport({
            scale: 1
        });


    /* =============================================
       AVAILABLE WIDTH
    ============================================= */

    const viewerWidth =
        pdfViewer.clientWidth;


    const isMobile =
        window.innerWidth <= 768;


    const horizontalPadding =
        isMobile
            ? 16
            : 40;


    const availableWidth =
        Math.max(
            viewerWidth -
            horizontalPadding,
            280
        );


    /* =============================================
       SCALE PDF TO SCREEN
    ============================================= */

    let scale =
        availableWidth /
        baseViewport.width;


    /*
     * Limit desktop size.
     */

    if (!isMobile) {

        scale =
            Math.min(
                scale,
                1.5
            );

    }


    /* =============================================
       SCALED VIEWPORT
    ============================================= */

    const viewport =
        page.getViewport({
            scale: scale
        });


    /* =============================================
       HIGH-DPI SUPPORT
    ============================================= */

    const pixelRatio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.floor(
            viewport.width *
            pixelRatio
        );


    canvas.height =
        Math.floor(
            viewport.height *
            pixelRatio
        );


    canvas.style.width =
        viewport.width + "px";


    canvas.style.height =
        viewport.height + "px";


    context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    /* =============================================
       ADD PAGE TO VIEWER
    ============================================= */

    pageContainer.appendChild(
        canvas
    );


    pdfViewer.appendChild(
        pageContainer
    );


    /* =============================================
       RENDER PAGE
    ============================================= */

    await page.render({

        canvasContext:
            context,

        viewport:
            viewport

    }).promise;

}


/* =========================================================
   MAKE FUNCTION AVAILABLE TO mode.js
========================================================= */

window.loadReviewerPDF =
    loadReviewerPDF;