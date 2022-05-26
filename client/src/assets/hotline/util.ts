import L from 'leaflet'
import Hotline from "./core/Hotline";

const Util = {
    /**
     * This is just a copy of the original Leaflet version that support a third z coordinate.
     * @see {@link http://leafletjs.com/reference.html#lineutil-clipsegment|Leaflet}
     */
    clipSegment: function (hotline: Hotline<any>, a: any, b: any, bounds: any, useLastCode: any, round: any) {
        
        let codeA = useLastCode ? hotline._lastCode : (L.LineUtil as any)._getBitCode(a, bounds);
        let codeB = (L.LineUtil as any)._getBitCode(b, bounds);
        let codeOut, p, newCode;

        // save 2nd code to avoid calculating it on the next segment
        hotline._lastCode = codeB;

        while (true) {
            // if a,b is inside the clip window (trivial accept)
            if ( !(codeA | codeB) ) {
                return [a, b];
            // if a,b is outside the clip window (trivial reject)
            } else if (codeA & codeB) {
                return undefined;
            // other cases
            } else {
                codeOut = codeA || codeB;
                p = (L.LineUtil as any)._getEdgeIntersection(a, b, codeOut, bounds, round);
                newCode = (L.LineUtil as any)._getBitCode(p, bounds);

                if (codeOut === codeA) {
                    p.z = a.z;
                    p.i = a.i
                    // p.d = a.d
                    a = p;
                    codeA = newCode;
                } else {
                    p.z = b.z;
                    p.i = b.i
                    // p.d = b.d
                    b = p;
                    codeB = newCode;
                }
            }
        }
    }
};

export default Util;