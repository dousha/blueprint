class Draw {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        const rect = canvas.getClientRects()[0];
        this.w = rect.width;
        this.h = rect.height;
    }

    updateCanvasSize(w, h) {
        this.w = w;
        this.h = h;
    }

    paint() {
        this.ctx.save();
        this.ctx.translate(this.w / 2, this.h / 2)
        this.objects.forEach(obj => {
            obj.draw(this.ctx);
        })
        this.ctx.restore();
    }

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
