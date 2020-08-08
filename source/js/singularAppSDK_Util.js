/*****************************************************************************
 * Description: Singular App SDK Utility
 * Author:      d.salcedo@rcs.live
 * API Docs:    https://developer.singular.live/app-sdk/app-sdk-introduction/
 *****************************************************************************/

/**
 * Create Singular fill-in form for the defined control node.
 *
 * @param {object} singularApp The reference to the Singular App SDK.
 * @param {object} composition The composition or subcomposition object
 *                 for the fill-in form.
 * @param {object} dom Reference to HTML DOM element that will render the
 *                 payload fill-in form.
 * @param {object} controlNode The Control Node of the composition or
 *                 subcomosition for the fill-in form.
 *
 * NOTE: The composition or subcomposition used in @param "composition"
 *       should be the same one used in @param "controlNode".
 */
function createFillInForm(singularApp, composition, dom, controlNode) {
  singularApp.createSingularForm(window, dom, controlNode, function(msg) {
    if (msg.event === 'load') {
      console.log('Rendered Singular Form Successfully.');
    }
    else if (msg.event === 'change') {
      composition.setPayload(msg.payload);
    }
  });
}

/**
 * Returns true if the composition has a payload, where composition
 * global settings are stored.
 *
 * @param {object} composition The composition object.
 * @returns {boolean} Returns true or false if composition has a control
 *                    node.
 */
function doesCompositionHaveAGlobalControlNode(composition) {
  return !!composition.getControlNode().payload
    ? !!composition.getControlNode().payload
    : false;
}

/**
 * Returns first composition attached to the app listed in the app
 * manager.
 * NOTE: You can attach more than one composition to your app.
 *
 * @param {object} singularApp The reference to the Singular App SDK.
 * @returns {object|null} The first composition object attached to the
 *                        app.
 */
function getComposition(singularApp) {
  const compositionList = singularApp.listCompositions();
  return compositionList.length > 0
    ? singularApp.getCompositionById(compositionList[0].id)
    : null;
}

/**
 * Returns first output listed in the app manager
 * NOTE: Although you can have more than one output for your app,
 *       current functionality only supports usage of one output.
 *
 * @param {object} singularApp The reference to the Singular App SDK.
 * @returns {object | null} The output object.
 */
function getOutput(singularApp) {
  const outputList = singularApp.listOutputs();
  return outputList.length > 0
    ? singularApp.getOutputById(outputList[0].id)
    : null;
}

/**
 * Returns an array of subcomposition objects from the passed in
 * composition.
 *
 * @param {object} singularApp The reference to the Singular App SDK.
 * @param {object} composition The composition object.
 * @returns {Array<object>} An array of subcompositions objects.
 */
function getSubcompositionList(singularApp, composition) {
  const subcompositions = composition.listSubcompositions();
  return subcompositions.map(function(subcomp) {
    return composition.getSubcompositionById(subcomp.id)
  });
}