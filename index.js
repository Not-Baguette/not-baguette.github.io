function addAccordionEventListeners(minimizeButtonId, maximizeButtonId, closeButtonId, collapseElementId) {
    // Function to deal with the accordion buttons independently
    document.getElementById(minimizeButtonId).addEventListener('click', function() {
        var collapseElement = document.getElementById(collapseElementId);
        var bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false
        });
        bsCollapse.hide();
    });

    document.getElementById(maximizeButtonId).addEventListener('click', function() {
        var collapseElement = document.getElementById(collapseElementId);
        var bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false
        });
        if (collapseElement.classList.contains('show')) {
            bsCollapse.hide();
        } else {
            bsCollapse.show();
        }
    });

    document.getElementById(closeButtonId).addEventListener('click', function() {
        var collapseElement = document.getElementById(collapseElementId);
        var bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false
        });
        bsCollapse.hide();
    });
}

addAccordionEventListeners('minimizeButton', 'maximizeButton', 'closeButton', 'collapse-one');
addAccordionEventListeners('minimizeButton2', 'maximizeButton2', 'closeButton2', 'collapse-two');