
import * as d3 from "d3";

const addAxisX = ( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
    maxX: any,
    width: number,
    height: number ) =>
{
    const x = d3.scaleLinear()
        .domain([0, maxX])
        .range([ 0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    return x
}

const addAxisY = ( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
    maxY: any,
    height: number ) =>
{
    const y = d3.scaleLinear()
        .domain([0, maxY])
        .range([ height, 0 ]);
            
    svg.append("g")
        .call(d3.axisLeft(y));
    
    return y
}


export type Axis = d3.ScaleLinear<number, number, never>

const getAxis = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
    maxX: number, maxY: number, width: number, height: number
)
: [Axis, Axis] => {

    const x = addAxisX(svg, maxX, width, height)
    const y = addAxisY(svg, maxY, height)

    return [x, y]
}

export default getAxis;
