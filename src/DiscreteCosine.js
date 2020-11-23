import { useRef, useEffect, useState } from 'react';
import { BlockMath } from 'react-katex';
import { 
    drawCosineOneDim,
    drawCosineTable,
    selectCosineTable,
    draw8x8Tile,
 } from './discreteCosineHelper.js';
 import { drawCosine3d } from './cosine3dHelper.js';


export default function DiscreteCosine() {
    const [n, setN] = useState(0);

    const cosineOneDim = useRef();
    const cosineTable = useRef();
    const cosineSelect = useRef();
    const cosine3d = useRef();
    useEffect(() => {
        const contextOneDim = cosineOneDim.current.getContext('2d');
        drawCosineOneDim(n, contextOneDim);
        const contextTable = cosineTable.current.getContext('2d');
        drawCosineTable(contextTable);
        drawCosine3d(cosine3d.current, 0, 0);
    })

    function handleChangeN(e) {
        setN(parseInt(e.target.value));
    }

    function handleSelect(e) {
        const [n, m] = selectCosineTable(e);
        const selectCanvas = cosineSelect.current;
        const selectContext = selectCanvas.getContext('2d');
        const { width, height } = selectCanvas;
        selectContext.fillRect(0, 0, width, height);
        draw8x8Tile(n, m, 0, 0, width, height, selectContext);
        const canvas3d = cosine3d.current;
        drawCosine3d(canvas3d, n, m);
    }

    return <div>
        <h4 className="chapter-intro">Diskrete Kosinustransformation</h4>
        <div className="display-container">
            <canvas width={1000}  height={570} ref={cosineOneDim}/>
        </div> 
        <div className="display-container">
            <div>
                <label>n: {n}</label>
                <input 
                    type="range"
                    min={0} 
                    max={8} 
                    step={1} 
                    value={n}
                    onChange={handleChangeN}
                />
            </div>
        </div>
        <BlockMath
            math={`
                F_{x,y} = \\frac{1}{4}C_xC_y \\sum_{m=0}^7\\sum_{n=0}^7 f_{mn} 
                \\cos\\frac{(2m+1)x \\pi}{16} \\cos\\frac{(2n+1)y \\pi}{16}
            `}/>
        <p>wobei</p>
        <BlockMath
            math={`
                C_x, C_y := 
                \\begin{cases} 
                    \\frac{1}{\\sqrt{2}} & \\text{wenn } x,y = 0 \\\\
                    1 & \\text{sonst}
                \\end{cases}
            `}/>
        <div className="horizontal-display-container">
            <canvas width={400} height={400} ref={cosineTable} onClick={handleSelect}/>
            <canvas width={400} height={400} ref={cosineSelect} />
            <canvas width={400} height={400} ref={cosine3d} />
        </div>
    </div>
}