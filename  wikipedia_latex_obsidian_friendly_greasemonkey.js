// ==UserScript==
// @name        Wikipedia_latex_obsidian_friendly_greasemonkey
// @namespace   http://tampermonkey.net/
// @version     1.2
// @description Display LaTeX instead of formula images in Wikipedia
// @author      Philo Chang
// @match       https://*.wikipedia.org/*
// @grant       none
// ==/UserScript==

(() => {
    'use strict';

    const replaceElementWithLatex = (element, latex) => {
        latex = latex.replace('{\\displaystyle ', '').replace(/}$/g, '');
        const enclosingSymbol = element.parentNode.tagName.toLowerCase() === 'dd' ? '$$' : '$';
        latex = `${enclosingSymbol}${latex.trim()}${enclosingSymbol}`;

        if (element.tagName.toLowerCase() === 'span') {
            const latexNode = document.createTextNode(latex);
            element.parentNode.replaceChild(latexNode, element);
        } else {
            const span = document.createElement('span');
            span.className = 'mwe-math-element';
            span.textContent = latex;
            element.parentNode.replaceChild(span, element);
        }
    };

    const elements = document.querySelectorAll('span.mwe-math-element, img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display');

    elements.forEach(element => {
        let latex = '';
        if (element.tagName.toLowerCase() === 'span') {
            const annotation = element.firstChild.getElementsByTagName('annotation')[0];
            latex = annotation.textContent;
        } else {
            const alt = element.alt;
            latex = alt.lastIndexOf('}.') > -1 ? alt.substring(alt.lastIndexOf('{\\displaystyle ') + 15, alt.lastIndexOf('}.'))
                : alt.substring(alt.lastIndexOf('{\\displaystyle ') + 15);
        }
        replaceElementWithLatex(element, latex);
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);



    const editLinks = document.querySelectorAll('span.mw-editsection-bracket, a[title^="Edit section"], a[title^="编辑章节"]');
    editLinks.forEach(link => link.parentNode.removeChild(link));

    const annotationElements = document.querySelectorAll('annotation');
    annotationElements.forEach(element => element.parentNode.removeChild(element));

    const divElements = document.querySelectorAll('div.mwe-math-mathml-display.mwe-math-mathml-a11y');
    divElements.forEach(element => element.parentNode.removeChild(element));
})();
