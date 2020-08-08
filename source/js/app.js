/**
 * Global Variables
 */
let singularApp;         // holds reference to the Singular App SDK library
let output;              // output object
let composition;         // composition object
let subcompositionList;  // array of subcompositions objects from composition
let tabIdNameList = [];  // array of subcomposition tab ID's

/**
 * Default function called by the Singular platform to provide access to the
 * Singular App SDK.
 *
 * NOTE: For local development usage, this function is defined in
 *       singularAppSDK_Local_Development.js
 *
 * @param {object} app
 */
function singularAppInit(app) {
  console.log('singularAppInit() Called.');

  // define global variables
  singularApp = app;
  output = getOutput(singularApp);
  composition = getComposition(singularApp);
  subcompositionList = getSubcompositionList(singularApp, composition);

  // initialize the application
  initializeGUI();

  // information logging
  console.log('Singular App SDK: ', app);
  console.log('output: ', output);
  console.log('composition: ', composition);
  console.log('subcompositionList: ', subcompositionList);
  console.log('tabIdNameList: ', tabIdNameList);
}

/**
 * Initialize GUI with Singular App SDK when DOM is fully loaded
 */
function initializeGUI() {
  let init = function() {
    // set output iframe src to output's preview url
    document.getElementById("iframe").src = output.getPreviewUrl();

    // if composition has global settings, create a global tab and set the global
    // settings control node to be rendered for the fill-in form
    let compositionToRender;
    if (doesCompositionHaveAGlobalControlNode(composition)) {
      createGlobalTab(composition, tabIdNameList);
      compositionToRender = composition;
    }
    // if no global settings detected, set the first subcomposition listed to be
    // rendered by the fill-in form
    else {
      compositionToRender = composition.getSubcompositionById(subcompositionList[0].id);
    }

    // create fill-in form for either global control node if it exists or first subcomposition
    const fillinFormDOM = document.getElementById("fillin-form");
    createFillInForm(singularApp, compositionToRender, fillinFormDOM, compositionToRender.getControlNode());

    // create subcomposition tabs
    createSubcompTabs(subcompositionList, tabIdNameList);

    // set first tab to active
    if (tabIdNameList.length > 0) {
      const firstTab = document.getElementById(tabIdNameList[0]);
      firstTab.classList.add("tab--active");
    }
  };

  // wait for DOM to load first, then initialize GUI elements
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  }
}

function handleTabOnClick(subcomposition) {
  const fillinFormDOM = document.getElementById("fillin-form");
  createFillInForm(singularApp, subcomposition, fillinFormDOM, subcomposition.getControlNode());
}

function handlePlayOnClick(subcompId) {
  const subcomp = composition.getSubcompositionById(subcompId);
  subcomp.playTo("IN");
}

function handleStopOnClick(subcompId) {
  const subcomp = composition.getSubcompositionById(subcompId);
  subcomp.playTo("OUT");
}
