/**
 * Global Variables
 */
let singularApp;         // holds reference to the Singular App SDK library
let output;              // output object
let composition;         // composition object
let subcompositionList;  // array of subcompositions objects from composition
let tabIdNameList = [];  // array of the tab IDs for the subcomposition tabs

/**
 * Default function called by the Singular platform to provide access to the
 * Singular App SDK.
 *
 * NOTE: For local development usage, this function is defined in
 *       singularAppSDK_Local_Development.js
 *
 * @param {object} app Singular App SDK passed in (automatically) through app
 *                 parameter.
 */
function singularAppInit(app) {
  console.log('singularAppInit() Called.');

  initializeSingularData(app);
  initializeGUI(app);
  logSingularData();
}

function initializeSingularData(app) {
  singularApp = app;
  output = getOutput(singularApp);
  composition = getComposition(singularApp);
  subcompositionList = getSubcompositionList(singularApp, composition);
}

function initializeGUI(singularApp) {
  let init = function() {
    // confirm closing of application
    window.addEventListener('beforeunload', event => {
      event.preventDefault();
      event.returnValue = '';  // Chrome requires returnValue to be set.
    });

    // set output iframe src to the singular app's output preview url
    setIframeSrcToOutput('iframe', output);

    // render fill-in form to edit subcomposition's payload
    renderInitialFillInForm('fillin-form', singularApp, composition, subcompositionList);

    const appId = singularApp.getAppInstanceInfo().id;

    // if first time loaded
    singularApp.storage.get('isFirstLoad', value => {
      console.log(`Storage 'isFirstLoad' is: ${value}`);
      if (!value) {
        singularApp.storage.set('isFirstLoad', true);
        playToInFirstSubcomp(composition, subcompositionList);
      }

      // create popups, settings tab and subcomposition tabs
      setTimeout(function () { createGuidePopups(composition); }, 4000);
      createGlobalTab(composition, tabIdNameList);
      createSubcompTabs(subcompositionList, tabIdNameList, !value);
      setFirstTabToActive(tabIdNameList);
    });
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
  renderFillInForm('fillin-form', singularApp, subcomposition);
}

function handlePlayOnClick(subcompId) {
  playToSubcompositionById(subcompId, composition, 'IN');
}

function handleStopOnClick(subcompId) {
  playToSubcompositionById(subcompId, composition, 'OUT');
}

function logSingularData() {
  console.log('Singular App SDK: ', singularApp);
  console.log('output: ', output);
  console.log('composition: ', composition);
  console.log('subcompositionList: ', subcompositionList);
  console.log('tabIdNameList: ', tabIdNameList);
}