export default class Vec2 {
    x;
    y;
    constructor(base) {
        if (base) {
            this.x = base.x;
            this.y = base.y;
        }
        else {
            this.x = 0.0;
            this.y = 0.0;
        }
    }
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    length2() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    normalize() {
        const length = this.length();
        if (length > 0.0) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }
    dot(otherVec) {
        return this.x * otherVec.x + this.y * otherVec.y;
    }
    flip() {
        this.x *= -1.0;
        this.y *= -1.0;
        return this;
    }
    compare(other) {
        return this.x === other.x && this.y === other.y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    multiply(mult) {
        this.x *= mult;
        this.y *= mult;
        return this;
    }
    min(vec) {
        this.x = Math.min(this.x, vec.x);
        this.y = Math.min(this.y, vec.y);
        return this;
    }
    max(vec) {
        this.x = Math.max(this.x, vec.x);
        this.y = Math.max(this.y, vec.y);
        return this;
    }
}
//# sourceMappingURL=Vec2.js.map