class Command {
    constructor() {
    }

    processKey(key) {
        this.currentStateHandler(key);
    }

    stateBlankHandler(key) {
        const k = key.toUpperCase();

        switch (k) {
            case 'R':
                wm.writeMessage("select a starting corner, or [ESC] to cancel");
                wm.setParameterInputVisibility(true);
                this.currentStateHandler = this.rectangleHandler;
                break;
            case 'H':
                wm.writeMessage(this.helpMessage);
                break;
            case 'P':
                wm.setPanActive(true);
                wm.writeMessage("Start panning, [ESC] end panning");
                this.currentStateHandler = this.panningHandler;
                break;
            case 'ESCAPE':
                wm.writeMessage("Cancel selection");
                break;
            default:
                break;
        }
    }

    rectangleHandler(key) {
        // TODO
        if (this.processParameterInput(key)) {
            return;
        }

        const k = key.toUpperCase();

        switch (k) {
            case 'ESCAPE':
                wm.writeMessage("Cancel [R]");
                wm.setParameterInputVisibility(false);
                this.currentStateHandler = this.stateBlankHandler;
                break;
            default:
                break;
        }
    }

    panningHandler(key) {
        if (key === 'Escape') {
            wm.writeMessage("Cancel [P]");
            wm.setPanActive(false);
            this.currentStateHandler = this.stateBlankHandler;
        }
    }

    processParameterInput(key) {
        return false;
    }

    currentStateHandler = this.stateBlankHandler;
    helpMessage = "[C] - Draw Circle\n[R] - Draw Rectangle\n[P] - Pan";
}

const cmd = new Command();
