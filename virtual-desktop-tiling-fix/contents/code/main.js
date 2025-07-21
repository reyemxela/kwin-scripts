function removeTile(window) {
    var window = window || this;
    var geometry = window.frameGeometry;
    if (window.tile && window.onAllDesktops) {
        window.tile = null;
        window.frameGeometry = geometry;
    }
}

function bind(window) {
    window.quickTileModeChanged.connect(window, removeTile);
}

function main() {
    workspace.stackingOrder.forEach(bind);
    workspace.windowAdded.connect(bind);
}

main();