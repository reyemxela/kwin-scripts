var primaryScreen = "";

function updatePrimaryScreen() {
    var dockScreens = [];
    for (const window of workspace.stackingOrder) {
        if (window.dock) {
            dockScreens.push(window.output);
        }
    }

    if (dockScreens.length === 1 && dockScreens[0] !== primaryScreen) {
        primaryScreen = dockScreens[0];
        workspace.stackingOrder.forEach(updateWindowDesktop);
        return;
    }

    // reset primary if the above checks fail
    primaryScreen = workspace.screens[0];
    workspace.stackingOrder.forEach(updateWindowDesktop);
}

function clearWindowDesktopPin(window) {
    var window = window || this;

    if (
        window.desktopWindow ||
        window.dock ||
        (!window.normalWindow && window.skipTaskbar)
    ) {
        return;
    }

    window.onAllDesktops = false;
}

function updateWindowDesktop(window) {
    var window = window || this;

    if (
        window.desktopWindow ||
        window.dock ||
        (!window.normalWindow && window.skipTaskbar)
    ) {
        return;
    }

    var currentScreen = window.output;
    var previousScreen = window.previousOutput;
    window.previousOutput = currentScreen;

    if (currentScreen !== primaryScreen) {
        window.onAllDesktops = true;
    } else if (previousScreen !== primaryScreen) {
        window.onAllDesktops = false;
    }
}

function bind(window) {
    window.previousOutput = window.output;

    // NOTE:
    // re-calculate primaryScreen when every dock window appears.
    // (kwin-script activates before dock window, which prevents
    // primaryScreen detection.)
    if (window.dock) {
        updatePrimaryScreen();
        return;
    }

    updateWindowDesktop(window);

    window.outputChanged.connect(window, updateWindowDesktop);
    window.desktopsChanged.connect(window, updateWindowDesktop);
    print("Window " + window.internalId + " has been bound");
}

function main() {
    // clear previous binding
    workspace.stackingOrder.forEach(clearWindowDesktopPin);

    updatePrimaryScreen();

    workspace.stackingOrder.forEach(bind);
    workspace.windowAdded.connect(bind);

}

main();
