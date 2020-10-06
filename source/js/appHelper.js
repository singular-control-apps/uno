function createGuidePopups(composition) {
  const isGlobalControlNode = doesCompositionHaveAGlobalControlNode(composition);
  createOverlayGuidePopup(isGlobalControlNode);
  createOutputGuidePopup();
}

function createOverlayGuidePopup(isGlobalControlNode) {
  const popup = document.createElement('div');
  popup.setAttribute('id', 'guide-popup--overlay');
  popup.classList.add('guide-popup--overlay');
  if (isGlobalControlNode) {
    popup.style.left = '122px';
  }
  else {
    popup.style.left = '4px';
  }

  const exitButton = document.createElement('span');
  exitButton.classList.add('guide-popup-button');
  exitButton.innerHTML = '&#10006;';
  exitButton.addEventListener('click', function () {
    const mainPage = document.getElementById('fill-in-form');
    const popup = document.getElementById('guide-popup--overlay');
    mainPage.removeChild(popup);
  });

  const header = document.createElement('div');
  header.classList.add('guide-popup-header');
  header.innerText = 'Plays Overlays On/Off Air';

  const text = document.createElement('div');
  text.classList.add('guide-popup-text');
  text.innerText = 'Click the play and pause buttons';

  popup.appendChild(exitButton);
  popup.appendChild(header);
  popup.appendChild(text);

  const fillinForm = document.getElementById('fill-in-form');
  fillinForm.appendChild(popup);
}

function createOutputGuidePopup() {
  const popup = document.createElement('div');
  popup.setAttribute('id', 'guide-popup--output');
  popup.classList.add('guide-popup--output');

  const exitButton = document.createElement('span');
  exitButton.classList.add('guide-popup-button');
  exitButton.innerHTML = '&#10006;';
  exitButton.addEventListener('click', function () {
    const mainPage = document.getElementById('main-page');
    const popup = document.getElementById('guide-popup--output');
    mainPage.removeChild(popup);
  });

  const header = document.createElement('div');
  header.classList.add('guide-popup-header');
  header.innerText = 'Output URL';

  const text = document.createElement('div');
  text.classList.add('guide-popup-text');
  const paragraph1 = document.createElement('p');
  paragraph1.innerText = 'Copy the output URL.';

  const paragraph2 = document.createElement('p');

  const paragraph2a = document.createElement('span');
  paragraph2a.innerText = 'Click ';

  const aTag = document.createElement('a');
  aTag.setAttribute('href', 'https://singularlive.zendesk.com/hc/en-us/sections/360001827592-STREAMING-PRODUCTION-SOFTWARE');
  aTag.setAttribute('target', '_blank');
  aTag.innerText = 'here';

  const paragraph2b = document.createElement('span');
  paragraph2b.innerText = ' for a tutorial.';

  paragraph2.appendChild(paragraph2a);
  paragraph2.appendChild(aTag);
  paragraph2.appendChild(paragraph2b);

  text.appendChild(paragraph1);
  text.appendChild(paragraph2);

  popup.appendChild(exitButton);
  popup.appendChild(header);
  popup.appendChild(text);

  const mainPage = document.getElementById('main-page');
  mainPage.appendChild(popup);
}

function createGlobalTab(composition, tabIdNameList) {
  if (doesCompositionHaveAGlobalControlNode(composition)) {
    const globalTab = document.createElement('span');
    globalTab.innerText = 'Settings';
    globalTab.setAttribute('id', 'tab--global');
    globalTab.addEventListener('click', function () {
      setTabClass('tab--global', 'tab--active');
      unsetTabsClass('tab--global', 'tab--active');
      handleTabOnClick(composition);
    });

    const tabs = document.getElementById('tabs');
    tabs.prepend(globalTab);

    tabIdNameList.push('tab--global');
  }
}

function createSubcompTabs(subcompositionList, tabIdNameList, isFirstLoad) {
  const tabs = document.getElementById('tabs');

  let setFirstTabToPlay = false;
  for (const subcomp of subcompositionList) {
    const tabIdName = createIdName('tab', subcomp.name);
    tabIdNameList.push(tabIdName);

    if (isFirstLoad && !setFirstTabToPlay) {
      const tab = createSubcompTab(subcomp, tabIdName, true);
      tabs.appendChild(tab);
      setFirstTabToPlay = true;
    }
    else {
      const tab = createSubcompTab(subcomp, tabIdName, false);
      tabs.appendChild(tab);
    }

  }
}

function createIdName(prefix, subcompName) {
  // lowercase and replace all spaces with -
  // ie: Lower Third returns 'tab--lower-third
  return `${prefix}--${subcompName.toLowerCase().replace(/\s+/g, '-')}`;
}

function createSubcompTab(subcomp, tabIdName, setToIn) {
  const tab = document.createElement('span');

  tab.innerText = subcomp.name;
  tab.setAttribute('id', tabIdName);

  if (setToIn) {
    tab.setAttribute('class', 'tab--playing');
  }
  else {
    if (subcomp.getState().toUpperCase().includes('IN')) {
      tab.setAttribute('class', 'tab--playing');
    }
    else if (subcomp.getState().toUpperCase().includes('OUT')) {
      tab.setAttribute('class', 'tab--stopped');
    }
  }

  tab.addEventListener('click', function() {
    setTabClass(tabIdName, 'tab--active');
    unsetTabsClass(tabIdName, 'tab--active');
    handleTabOnClick(subcomp);
  });

  const playSvg = createPlaySvg(subcomp);
  tab.appendChild(playSvg);

  const stopSvg = createStopSvg(subcomp);
  tab.appendChild(stopSvg);

  return tab;
}

function createPlaySvg(subcomp) {
  const playSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  playSvg.setAttribute('id', createIdName('play-icon', subcomp.name));
  playSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  playSvg.setAttribute('viewBox', '0 0 24 24');

  // upon creation, if subcomp is in IN state, hide 'play' button
  if (subcomp.getState().toUpperCase().includes('IN')) {
    playSvg.setAttribute('style', 'visibility: hidden');
  }

  playSvg.addEventListener('click', function(event) {
    event.stopPropagation();

    // set tab classes
    const tabIdName = createIdName('tab', subcomp.name);
    setTabClass(tabIdName, 'tab--playing');
    unsetTabClass(tabIdName, 'tab--stopped');

    // show stop icon, hide play icon
    setIconVisibility('play-icon', subcomp.name, 'hidden');
    setIconVisibility('stop-icon', subcomp.name, 'visible');

    handlePlayOnClick(subcomp.id);
  });

  const playSvgPath = createPlaySvgPath();
  playSvg.appendChild(playSvgPath);

  return playSvg;
}

function createPlaySvgPath() {
  const playSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  playSvgPath.setAttribute('d', 'M7,5.62V18.38a.64.64,0,0,0,.66.62A.6.6,0,0,0,8,18.92l11.72-6.38a.61.61,0,0,0,.26-.82.65.65,0,0,0-.26-.26L8,5.08a.65.65,0,0,0-.87.25A.6.6,0,0,0,7,5.62Z');
  return playSvgPath;
}

function createStopSvg(subcomp) {
  const stopSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  stopSvg.setAttribute('id', createIdName('stop-icon', subcomp.name));
  stopSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  stopSvg.setAttribute('viewBox', '0 0 24 24');

  // upon creation, if subcomp is in OUT state, hide 'stop' button
  if (subcomp.getState().toUpperCase().includes('OUT')) {
    stopSvg.setAttribute('style', 'visibility: hidden');
  }

  stopSvg.addEventListener('click', function(event) {
    event.stopPropagation();

    // set tab classes
    const tabIdName = createIdName('tab', subcomp.name);
    setTabClass(tabIdName, 'tab--stopped');
    unsetTabClass(tabIdName, 'tab--playing');

    // show stop icon, hide play icon
    setIconVisibility('play-icon', subcomp.name, 'visible');
    setIconVisibility('stop-icon', subcomp.name, 'hidden');

    handleStopOnClick(subcomp.id);
  });

  const stopSvgPath = createStopSvgPath();
  stopSvg.appendChild(stopSvgPath);

  return stopSvg;
}

function createStopSvgPath() {
  const stopSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  stopSvgPath.setAttribute('d', 'M6.75,6h10.5a.76.76,0,0,1,.75.75v10.5a.76.76,0,0,1-.75.75H6.75A.76.76,0,0,1,6,17.25V6.75A.76.76,0,0,1,6.75,6Z');
  return stopSvgPath;
}

function playToInFirstSubcomp(composition, subcompositionList) {
  if (subcompositionList && subcompositionList.length > 0) {
    playToSubcompositionById(subcompositionList[0].id, composition, 'IN');
  }
}

function renderInitialFillInForm(fillInFormId, singularApp, composition, subcompositionList) {
  const fillInFormDiv = document.getElementById('fillin-form');

  // if composition has global settings, render global settings for the fill-in form
  if (doesCompositionHaveAGlobalControlNode(composition)) {
    createFillInForm(singularApp, composition, fillInFormDiv, composition.getControlNode());
  }

  // else if no global settings exist, render the first subcomposition instead
  else {
    const firstSubComp = composition.getSubcompositionById(subcompositionList[0].id);
    createFillInForm(singularApp, firstSubComp, fillInFormDiv, firstSubComp.getControlNode());
  }
}

function renderFillInForm(fillInFormId, singularApp, subcomposition) {
  const fillinFormDOM = document.getElementById('fillin-form');
  createFillInForm(singularApp, subcomposition, fillinFormDOM, subcomposition.getControlNode());
}

function setIconVisibility(iconName, subCompName, visibility) {
  const playSvgId = createIdName(iconName, subCompName);
  const playSvg = document.getElementById(playSvgId);
  playSvg.setAttribute('style', `visibility: ${visibility}`);
}

function setFirstTabToActive(tabIdNameList) {
  if (tabIdNameList.length > 0) {
    setTabClass(tabIdNameList[0], 'tab--active');
  }
}

function setIframeSrcToOutput(iframeId, output) {
  const outputIframe = document.getElementById(iframeId);
  outputIframe.src = `${output.getPreviewUrl()}?bgcolor=black`;
}

function setTabClass(tabIdName, className) {
  const activeTab = document.getElementById(tabIdName);
  activeTab.classList.add(className);
}

function unsetTabClass(tabIdName, className) {
  const activeTab = document.getElementById(tabIdName);
  activeTab.classList.remove(className);
}

function unsetTabsClass(tabIdName, className) {
  for (const id of tabIdNameList) {
    if (id !== tabIdName) {
      const tab = document.getElementById(id);
      if (tab.classList.contains(className)) {
        tab.classList.remove(className);
      }
    }
  }
}
