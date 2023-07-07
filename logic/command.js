class CommandProcessor {
    constructor(rootCommands) {
        this.currentCommands = rootCommands;
    }

    processKey(key) {
        if (key === 'Escape') {
            if (this.commandCallStack.length === 0) {
                wm.writeMessage("No command to cancel");
                return;
            }

            const lastItem = this.commandCallStack.pop();
            lastItem.cleanUp();
            wm.writeMessage(`Cancel [${lastItem.key}]`);
            this.currentCommands = lastItem.commands;
        } else {
            const item = this.currentCommands.find(it => it.key === key);
            if (item == null) {
                return;
            }

            const newCommands = item.process();
            if (newCommands != null) {
                const {cleanUp, commands} = newCommands;
                const frame = {
                    key: key,
                    commands: this.currentCommands,
                    cleanUp: cleanUp
                };
                this.commandCallStack.push(frame);
                this.currentCommands = commands == null ? [] : commands;
            }
        }
    }

    currentCommands = [];
    commandCallStack = [];
}

class Command {
    brief() {
        return "[key] Function of this command";
    }

    /**
     *
     * @returns {undefined | {cleanUp: () => void, commands?: Command[]} }
     */
    process() {
        // do things here
        // return a new key
        return undefined;
    }

    key = 'key';
}

class HelpCommand extends Command {
    brief() {
        return "[H] Help"
    }

    process() {
        cmd.currentCommands.forEach(it => {
            wm.writeMessage(it.brief());
        });
        return undefined;
    }

    key = 'h';
}

class PanCommand extends Command {
    brief() {
        return "[P] Pan tool";
    }

    process() {
        wm.writeMessage("Panning active");
        wm.setPanActive(true);
        return {
            cleanUp: () => wm.setPanActive(false),
        };
    }

    key = 'p';
}

class RectangleCommand extends Command {
    brief() {
        return "[R] Draw Rectangle";
    }

    process() {
        wm.writeMessage("Specify a point to start");
        wm.setParameterInputVisibility(true);
        wm.setParameterCount(2);
        wm.setParameterUpdateFunction((e) => {
            const coordinates = wm.draw.clientCoordinateToDrawCoordinate(e);
            wm.setParamValues(coordinates.x, coordinates.y);
        });
        return {
            cleanUp: () => {
                wm.setParameterInputVisibility(false);
            },
            commands: []
        };
    }

    key = 'r';
}

const cmd = new CommandProcessor([
    new HelpCommand(),
    new PanCommand(),
    new RectangleCommand(),
]);
