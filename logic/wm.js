class WindowManager {
    constructor() {
    }

    resizeCanvas() {
        const canvas = document.getElementById('canvas');
        const parent = document.getElementById('canvas-container');
        const rect = parent.getClientRects()[0];

        canvas.width = rect.width;
        canvas.height = rect.height;

        this.draw.updateCanvasSize(rect.width, rect.height);
    }

    registerComponents() {
        this.workspacePanel = document.getElementById('workspace');
        this.canvasPanel = document.getElementById('canvas-container');
        this.sidebarPanel = document.getElementById('sidebar-container');
        this.hierarchyPanel = document.getElementById('hierarchy-view-container');
        this.propertyPanel = document.getElementById('properties-view-container');
        this.coordinate = document.getElementById('coordinate');
        this.status = document.getElementById('status');
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
        });

        this.canvasPanel.addEventListener('mousemove', e => {
            const canvasRect = this.canvasPanel.getClientRects()[0];
            const relativeLeft = e.clientX - canvasRect.x;
            const relativeTop = e.clientY - canvasRect.y;
            this.coordinate.innerText = `(${relativeLeft}, ${relativeTop})`;
        });

        window.addEventListener('resize', this.windowResize);
        this.resizeCanvas();
    }

    windowResize() {
        this.resizeCanvas();
    }

    processKey(key) {
        // TODO
        if (key === 'Escape') {
            this.currentMoveFunction = () => {
            };
            this.isMouseDown = false;
        }
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

    /**
     * @type {Draw}
     */
    draw = undefined;
}

const wm = new WindowManager();

window.addEventListener('load', () => {
    wm.registerComponents();
});
