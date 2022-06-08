

export default class RGB {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(o: RGB): RGB
    {
        return new RGB(this.r + o.r, this.g + o.g, this.b + o.b )
    }

    sub(o: RGB): RGB
    {
        return new RGB(this.r - o.r, this.g - o.g, this.b - o.b )
    }

    mul(fac: number): RGB 
    {
        return new RGB( this.r * fac, this.g * fac, this.b * fac )
    }

    get(): [number, number, number]
    {
        return [this.r, this.g, this.b]
    }
}