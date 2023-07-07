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
        this.parameterPanel = document.getElementById('parameters');
        this.parameters[0] = document.getElementById('parameter-1');
        this.parameters[1] = document.getElementById('parameter-2');
        this.parameters[2] = document.getElementById('parameter-3');
        this.parameters[3] = document.getElementById('parameter-4');

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

        window.addEventListener('mousedown', e => {
            if (!this.isPanActive) {
                return;
            }

            this.isMouseDown = true;
            this.panningStartPoint.x = e.clientX;
            this.panningStartPoint.y = e.clientY;
        });

        window.addEventListener('mousemove', e => {
            if (this.isMouseDown) {
                if (this.isPanActive) {
                    const relativeX = this.panningStartPoint.x - e.clientX;
                    const relativeY = this.panningStartPoint.y - e.clientY;
                    this.draw.panRelativeTo(relativeX, relativeY);
                } else {
                    this.currentMoveFunction(e.clientX, e.clientY);
                }
            }

            this.parameterPanel.style.left = `${e.clientX}px`;
            this.parameterPanel.style.top = `${e.clientY}px`;
            this.parameterUpdateFunction(e);
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.currentMoveFunction = () => {
            };
            if (this.isPanActive) {
                this.draw.panCommit();
            }
        });

        this.canvasPanel.addEventListener('mousemove', e => {
            const relativeCoordinate = this.draw.clientCoordinateToDrawCoordinate(e);
            const relativeLeft = relativeCoordinate.x;
            const relativeTop = relativeCoordinate.y;
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
        this.parameterPanel.style.display = v ? 'block' : 'none';
    }

    setParameterUpdateFunction(f) {
        this.parameterUpdateFunction = f;
    }

    setParameterCount(n) {
        this.parameters.forEach(it => it.classList.add('hidden'));

        for (let i = 0; i < n; i++) {
            this.parameters[i].classList.remove('hidden');
        }
    }

    setParamValues(a, b, c, d) {
        this.parameters[0].innerText = a;
        this.parameters[1].innerText = b;
        this.parameters[2].innerText = c;
        this.parameters[3].innerText = d;
    }

    setActiveParameter(n) {
        if (n > 3) {
            return;
        }

        this.parameters.forEach(it => it.classList.remove('active'));
        this.parameters[n].classList.add('active');
    }

    setPanActive(v) {
        this.canvasPanel.style.cursor = v ? 'grab' : 'crosshair';
        this.isPanActive = v;
    }

    isMouseDown = false;
    isPanActive = false;
    panningStartPoint = {x: 0, y: 0};

    currentMoveFunction = () => {
    };
    parameterUpdateFunction = () => {
    };

    workspacePanel = undefined;
    canvasPanel = undefined;
    sidebarPanel = undefined;
    hierarchyPanel = undefined;
    propertyPanel = undefined;

    coordinate = undefined;
    status = undefined;
    output = undefined;
    parameterPanel = undefined;
    parameters = [];

    /**
     * @type {Draw}
     */
    draw = undefined;
}

const wm = new WindowManager();

window.addEventListener('load', () => {
    wm.registerComponents();
});
