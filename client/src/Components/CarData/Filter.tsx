import { FC, useEffect, useState } from "react";
import '../../css/filter.css'

export interface FilterProps{
    setSelectedDataType: (type: string) => void;
    setSelectedAggregation: (type: string) => void;
    setShowFilter: (value: Boolean) => void;
}

const Filter: FC<FilterProps> = (props) => {

    const [selectedData, setSelectedData] = useState<[string, string]>();
    const [selectedAggregation, setSelectedAggregation] = useState<[string, string]>();


    let dataOptions: any[] = [];
    let aggregationOptions: any[] = [];


    useEffect(() => {
        changeSelectedDataColor('#1B41FF');
        changeSelectedAggregationColor('#1B41FF')
    });

    const dataTypeOnClick = (e:any) =>{

        const element = e.target;
        changeSelectedDataColor('#9CADFF');
        setSelectedData([element.id, element.textContent]);
    }

    const aggregationTypeOnClick = (e:any) =>{

        const element = e.target;
        changeSelectedAggregationColor('#9CADFF');
        setSelectedAggregation([element.id, element.textContent]);
    }

    const changeSelectedDataColor = (color:string) => {
        if(selectedData != null){
            let selectedElement = document.getElementById(selectedData[0]);
            if(selectedElement != null)
                selectedElement.style.backgroundColor = color;
        }
    }

    const changeSelectedAggregationColor = (color:string) => {
        if(selectedAggregation != null){
            let selectedElement = document.getElementById(selectedAggregation[0]);
            if(selectedElement != null)
                selectedElement.style.backgroundColor = color;
        }
    }


    const doneOnClick = (e:any) => {
        if(selectedAggregation != undefined && selectedData != undefined){
            props.setSelectedAggregation(selectedAggregation[1]);
            props.setSelectedDataType(selectedData[1]);
            props.setShowFilter(false);
        }
    }


    let index = -1;
    let dataTypes = ["inertialForce", "tractionForce"]
        dataOptions = dataTypes.map((element) => {
            index = index + 1;
            return(<div className="item" id={String(index)} onClick={((e) => dataTypeOnClick(e))}>
                {element}
            </div>)
        })

    let aggregationTypes = ["average"]
    aggregationOptions = aggregationTypes.map((element) => {
        index = index + 1;
        return(<div className="item" id={String(index)} onClick={((e) => aggregationTypeOnClick(e))}>
            {element}
        </div>)
    })

    return (
    <div className="container">
        <div className="content">
            <div className="subsection">
                <div className="title">
                    <p>Select the type of data you want to visualize</p>
                </div>
                
                <div className="items">
                    {dataOptions}
                </div>
            </div>
            <div className="subsection">
                <div className="title">
                    <p>Select the type of aggregation</p>
                </div>
                
                <div className="items">
                    {aggregationOptions}
                </div>
            </div>
            <button onClick={((e) => doneOnClick(e))}>
                Done
            </button>
        </div>

        
    </div>)
  }


  export default Filter;