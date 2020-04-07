class ColorInterpolator {
    generateColor(colorStart, colorEnd, colorCount) {
        let start = this._convertToRGB(colorStart);
        let end = this._convertToRGB(colorEnd);
        let len = colorCount;
        let alpha = 0.0;
        let results = [];
        for (let i = 0; i < len; i++) {
            let c = [];
            alpha += (1.0 / len);
            c[0] = start[0] * alpha + (1 - alpha) * end[0];
            c[1] = start[1] * alpha + (1 - alpha) * end[1];
            c[2] = start[2] * alpha + (1 - alpha) * end[2];
            results.push(this._convertToHex(c));
        }
        return results;
    }

    _hex(c) {
        let s = "0123456789abcdef";
        let i = parseInt(c);
        if (i == 0 || isNaN(c))
            return "00";
        i = Math.round(Math.min(Math.max(0, i), 255));
        return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
    }

    _convertToHex(rgb) {
        return this._hex(rgb[0]) + this._hex(rgb[1]) + this._hex(rgb[2]);
    }

    _trim(s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

    _convertToRGB(hex) {
        let color = [];
        color[0] = parseInt((this._trim(hex)).substring(0, 2), 16);
        color[1] = parseInt((this._trim(hex)).substring(2, 4), 16);
        color[2] = parseInt((this._trim(hex)).substring(4, 6), 16);
        return color;
    }
}

export default ColorInterpolator = new ColorInterpolator();