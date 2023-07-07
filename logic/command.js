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
                this.currentStateHandler = this.rectangleHandler;
                break;
            case 'H':
                wm.writeMessage(this.helpMessage);
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
        const k = key.toUpperCase();

        switch (k) {
            case 'ESCAPE':
                wm.writeMessage("Cancel [R]");
                this.currentStateHandler = this.stateBlankHandler;
                break;
        }
    }

    currentStateHandler = this.stateBlankHandler;
    helpMessage = "[C] - Draw Circle\n[R] - Draw Rectangle";
}

const cmd = new Command();
