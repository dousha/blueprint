class Draw {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const rect = canvas.getClientRects()[0];
        this.w = rect.width;
        this.h = rect.height;

        this.objects.push(new Origin());
    }

    updateCanvasSize(w, h) {
        this.w = w;
        this.h = h;
    }

    paint() {
        this.ctx.save();
        this.ctx.translate(Math.floor(this.w / 2) - this.centerLeft, Math.floor(this.h / 2) - this.centerTop);
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.objects.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.ctx.restore();
    }

    canvas;
    ctx;
    w = 0;
    h = 0;
    centerLeft = 0;
    centerTop = 0;

    /**
     *
     * @type {[DrawObject]}
     */
    objects = [];
}

class DrawObject {
    left = 0;
    top = 0;
    baseColor = '#ffffff';
    accentColor = '#000000';

    constructor(x, y) {
        this.left = x;
        this.top = y;
    }

    draw(ctx) {
        // do nothing
    }
}

class Origin extends DrawObject {
    constructor() {
        super();

        this.baseColor = '#000000';
        this.accentColor = '#ff00ff';
    }

    draw(ctx) {
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(-5, 0, 11, 1);
        ctx.fillRect(0, -5, 1, 11);
        ctx.fillStyle = this.accentColor;
        ctx.fillRect(0, 0, 1, 1);
    }
}

class Rectangle extends DrawObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.width = w;
        this.height = h;
    }

    draw(ctx) {
        ctx.strokeStyle = this.accentColor;
        ctx.strokeRect(this.left, this.top, this.width, this.height);
    }

    width = 0;
    height = 0;
}
