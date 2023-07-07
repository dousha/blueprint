class WindowManager {
    constructor() {
    }

    resizeCanvas() {
        const canvas = document.getElementById('canvas');
        const parent = document.getElementById('canvas-container');
        const rect = parent.getClientRects()[0];

        const containerWidth = Math.floor(rect.width * devicePixelRatio) / devicePixelRatio;
        const containerHeight = Math.floor(rect.height * devicePixelRatio) / devicePixelRatio;

        canvas.width = Math.floor(rect.width * devicePixelRatio);
        canvas.height = Math.floor(rect.height * devicePixelRatio);
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerHeight}px`;

        this.draw.updateCanvasSize(canvas.width, canvas.height);
    }

    registerComponents() {
        this.workspacePanel = document.getElementById('workspace');
        this.canvasPanel = document.getElementById('canvas-container');
        this.sidebarPanel = document.getElementById('sidebar-container');
        this.hierarchyPanel = document.getElementById('hierarchy-view-container');
        this.propertyPanel = document.getElementById('properties-view-container');
        this.coordinate = document.getElementById('coordinate');
        this.status = document.getElementById('status');
        this.output = document.getElementById('message');
        this.parameters = document.getElementById('parameters');
        this.draw = new Draw(document.getElementById('canvas'));

        const sideBarGrip = document.getElementById('sidebar-separator');
        const workspaceGrip = document.getElementById('vertical-separator');

        sideBarGrip.addEventListener('mousedown', () => {
            this.isMouseDown = true;

            const sideBarContainerRect = this.sidebarPanel.getClientRects()[0];
            const sideBarGripRect = sideBarGrip.getClientRects()[0];

            this.currentMoveFunction = (x, y) => {
                const upperHeight = Math.max(0, y - sideBarContainerRect.y - sideBarGripRect.height / 2);
                const downerHeight = Math.max(0, sideBarContainerRect.height - upperHeight - sideBarGripRect.height / 2);
                this.hierarchyPanel.style.height = `${upperHeight}px`;
                this.propertyPanel.style.height = `${downerHeight}px`;
            };
        });
        sideBarGrip.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.currentMoveFunction = () => {
            };
        });

        workspaceGrip.addEventListener('mousedown', () => {
            this.isMouseDown = true;

            const workspaceContainerRect = this.workspacePanel.getClientRects()[0];
            const workspaceGripRect = workspaceGrip.getClientRects()[0];

            this.currentMoveFunction = (x) => {
                const leftWidth = Math.max(0, x - workspaceContainerRect.x - workspaceGripRect.width / 2);
                const rightWidth = Math.max(0, workspaceContainerRect.width - leftWidth - workspaceGripRect.width / 2);
                this.canvasPanel.style.width = `${leftWidth}px`;
                this.sidebarPanel.style.width = `${rightWidth}px`;
                this.resizeCanvas();
                this.draw.paint();
            };
        });
        workspaceGrip.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.currentMoveFunction = () => {
            };
        });

        window.addEventListener('mousemove', e => {
            if (this.isMouseDown) {
                this.currentMoveFunction(e.clientX, e.clientY);
            }

            this.parameters.style.left = `${e.clientX}px`;
            this.parameters.style.top = `${e.clientY}px`;
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.currentMoveFunction = () => {
            };
        });

        this.canvasPanel.addEventListener('mousemove', e => {
            const canvasRect = this.canvasPanel.getClientRects()[0];
            const relativeLeft = e.clientX - canvasRect.x;
            const relativeTop = e.clientY - canvasRect.y;
            this.coordinate.innerText = `(${relativeLeft}, ${relativeTop})`;
        });

        window.addEventListener('resize', this.windowResize);

        this.setParameterInputVisibility(false);
        this.resizeCanvas();
        this.draw.paint();
    }

    windowResize() {
        this.resizeCanvas();
    }

    processKey(key) {
        if (key === 'Escape') {
            this.currentMoveFunction = () => {
            };
            this.isMouseDown = false;
        }

        cmd.processKey(key);
    }

    writeMessage(msg) {
        this.output.innerText += `\n${msg}`;
        const parent = this.output.parentElement;
        parent.scrollTop = parent.scrollHeight;
    }

    setParameterInputVisibility(v) {
        this.parameters.style.display = v ? 'block' : 'none';
    }

    isMouseDown = false;
    currentMoveFunction = () => {
    };

    workspacePanel = undefined;
    canvasPanel = undefined;
    sidebarPanel = undefined;
    hierarchyPanel = undefined;
    propertyPanel = undefined;

    coordinate = undefined;
    status = undefined;
    output = undefined;
    parameters = undefined;

    /**
     * @type {Draw}
     */
    draw = undefined;
}

const wm = new WindowManager();

window.addEventListener('load', () => {
    wm.registerComponents();
});
