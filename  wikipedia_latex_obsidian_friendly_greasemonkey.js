// ==UserScript==
// @name        Wikipedia_latex_obsidian_friendly_greasemonkey
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Display LaTeX instead of formula images in Wikipedia
// @author      Philo Chang
// @match       https://*.wikipedia.org/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Get all the span and img tags in the page
//    var elements = document.querySelectorAll('span.mwe-math-element, img.mwe-math-fallback-image-inline');
    var elements = document.querySelectorAll('span.mwe-math-element, img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display');

    // Iterate over the elements
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var latex = '';
        var enclosingSymbol = '';

        // Check if the element is a formula
        if (element.tagName.toLowerCase() === 'span') {
            // Get the MathML element
            var mathml = element.firstChild;
            // Get the annotation element
            var annotation = mathml.getElementsByTagName('annotation')[0];
            // Get the LaTeX source from the annotation
            latex = annotation.textContent;

            // Strip '{\displaystyle ' from LaTeX formula
            latex = latex.replace('{\\displaystyle ', '');

            // Remove the corresponding '}'
            latex = latex.replace(/}$/g, '');

            // Check if it's an inline LaTeX or standalone LaTeX
            enclosingSymbol = element.parentNode.tagName.toLowerCase() === 'dd' ? '$$' : '$';

            // Enclose the LaTeX with appropriate symbols
            latex = enclosingSymbol + latex.trim() + enclosingSymbol;

            // Replace the span with a text node containing the LaTeX source
            var latexNode = document.createTextNode(latex);
            element.parentNode.replaceChild(latexNode, element);
        } else if (element.tagName.toLowerCase() === 'img') {
            // Get the LaTeX source from the alt attribute
            var alt = element.alt;
            if (alt.lastIndexOf('}.') > -1) {
                latex = alt.substring(alt.lastIndexOf('{\\displaystyle ') + 15, alt.lastIndexOf('}.'));
            } else {
                latex = alt.substring(alt.lastIndexOf('{\\displaystyle ') + 15);
            }


            // Remove the corresponding '}'
            latex = latex.replace(/}$/g, '');

            // Check if it's an inline LaTeX or standalone LaTeX
            enclosingSymbol = element.parentNode.tagName.toLowerCase() === 'dd' ? '$$' : '$';

            // Enclose the LaTeX with appropriate symbols
            latex = enclosingSymbol + latex.trim() + enclosingSymbol;

            // Replace the img tag with a span containing the LaTeX source
            var span = document.createElement('span');
            span.className = 'mwe-math-element';
            span.textContent = latex;
            element.parentNode.replaceChild(span, element);
        }
    }

    // Now process all text nodes for the new functionality
    var walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    var node;
    while (node = walker.nextNode()) {
        var text = node.textContent;
        var match = text.match(/\$\$([^\$]+)\$\$\s*\$\$([^\$]+)\$\$/g);
        if (match) {
            for (var j = 0; j < match.length; j++) {
                var newContent = match[j].replace(/\$\$([^\$]+)\$\$\s*\$\$([^\$]+)\$\$/g, "$$$1$$$2");
                node.textContent = text.replace(match[j], newContent);
            }
        }
    }
    // Get all the edit section links on the page
    var editLinks = document.querySelectorAll('span.mw-editsection-bracket, a[title^="Edit section"], a[title^="编辑章节"]');

    // Iterate over the links
    for (i = 0; i < editLinks.length; i++) {
        var link = editLinks[i];

        // Remove the link
        link.parentNode.removeChild(link);
    }
    // Get all the annotation tags on the page
    var annotationElements = document.querySelectorAll('annotation');

    // Iterate over the annotation elements
    for ( i = 0; i < annotationElements.length; i++) {
         element = annotationElements[i];

        // Remove the annotation element
        element.parentNode.removeChild(element);
    }
    // Get all the annotation tags on the page
    annotationElements = document.querySelectorAll('annotation');

    // Iterate over the annotation elements
    for (i = 0; i < annotationElements.length; i++) {
        element = annotationElements[i];

        // Remove the annotation element
        element.parentNode.removeChild(element);
    }
    // Get all the div tags with the class 'mwe-math-mathml-display' and 'mwe-math-mathml-a11y' on the page
    var divElements = document.querySelectorAll('div.mwe-math-mathml-display.mwe-math-mathml-a11y');

    // Iterate over the div elements
    for (i = 0; i < divElements.length; i++) {
        element = divElements[i];

        // Remove the div element
        element.parentNode.removeChild(element);
    }

})();
