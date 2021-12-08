


const outOfBounds = (bounds, point) => {
    const [northWest, southEast] = bounds;
    const p = point.pos;
    return p.lat > northWest.lat || p.lng < northWest.lng || p.lat < southEast.lat || p.lng > southEast.lng
}

const getPerformancePath = (bounds, path, precisionLength) => {
    const NB_POINTS_THRESHOLD = 1_000;
    if ( path.data.length <= NB_POINTS_THRESHOLD )
         return path;

    let currentPoint = path.data[0]
    const updated = [currentPoint]
    let oob = false;

    for (let i = 1; i < path.data.length; i++) 
    {            
        const point = path.data[i]
        const distLat = point.pos.lat - currentPoint.pos.lat; 
        const distLng = point.pos.lng - currentPoint.pos.lng; 
        const length = Math.sqrt( distLat * distLat + distLng * distLng )
        if ( outOfBounds(bounds, point) )
        {
            if ( !oob )
            {
                updated.push(point)
                oob = true;
            }
            
            currentPoint = point;                
        }
        else if ( length <= precisionLength )
            oob = false
        else if ( length > precisionLength )
        {
            if ( oob )
                updated.push(path.data[i - 1])
            oob = false

            currentPoint = point;
            updated.push(point)
        }
            
    }

    console.log(path.data.length, updated.length);
    return { data: updated, minValue: path.minValue, maxValue: path.maxValue, minTime: path.minTime, maxTime: path.maxTime };
}


const calcPerformancePaths = (bounds, paths, precisionLength) => {

    const pathsCopy = [...paths]        

    paths.forEach( (p, k) => {
        if ( !p.loaded || p.fullPath === undefined )
            return;

        const performancePath = getPerformancePath(bounds, p.fullPath, precisionLength)
        pathsCopy[k].path = performancePath;
    } )

    return pathsCopy
}


self.addEventListener('message', ({ data }) => {

    let { type, paths, path, i, bounds, minLength} = data;
    console.log(type, paths, path, i, bounds, minLength);

    if ( type === 'ONE')
    {
        const performancePath = getPerformancePath(bounds, path, minLength)                
        self.postMessage( { type: type, pathsCopy: paths, path: path, performancePath: performancePath, index: i } );
    }
    else if ( type === 'ALL')
    {
        const pathsCopy = calcPerformancePaths(bounds, paths, minLength);        
        self.postMessage( { type: type, pathsCopy: pathsCopy, path: undefined, performancePath: undefined, index: undefined } );
    }
});


self.addEventListener('exit', () => {
    console.log('worker exiting');
    
    // process.exit(0);
}, false );