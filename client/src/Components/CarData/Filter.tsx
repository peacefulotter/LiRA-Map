import { FC, useEffect, useState } from "react";
import { GetAggregationTypes, GetDataTypes } from "../../queries/DataRequests";
import '../../css/filter.css'

export interface FilterProps{
    setSelectedDataType: (type: string) => void;
    setSelectedAggregation: (type: string) => void;
    setShowFilter: (value: Boolean) => void;
}

const Filter: FC<FilterProps> = (props) => {

    const [selectedData, setSelectedData] = useState<[string, string]>();
    const [selectedAggregation, setSelectedAggregation] = useState<[string, string]>();
    const [dataTypes, setDataTypes] = useState<string[]>([]);
    const [aggregationTypes, setAggregationTypes] = useState<string[]>([]);

    useEffect(() => {
        const fetchDataTypes = async () => {
            console.log("fetching data");
            let dataTypes = await GetDataTypes();
            setDataTypes(dataTypes);
        }
        fetchDataTypes();
    }, []);

    const fetchAggregationTypes = async (dataType: string) => {
        console.log("fetching " + dataType)
        let aggregationTypes = await GetAggregationTypes(dataType);
        console.log(aggregationTypes);
        setAggregationTypes(aggregationTypes);
    }

    const dataTypeOnClick = (e:any) =>{
        const element = e.target;
        setSelectedData([element.id, element.textContent]);
        fetchAggregationTypes(element.textContent);
    }

    const aggregationTypeOnClick = (e:any) =>{

        const element = e.target;
        setSelectedAggregation([element.id, element.textContent]);
    }


    const doneOnClick = (e:any) => {
        if(selectedAggregation != undefined && selectedData != undefined){
            props.setSelectedAggregation(selectedAggregation[1]);
            props.setSelectedDataType(selectedData[1]);
            props.setShowFilter(false);
        }
    }

    const GetDataOptions = () => {
        let index = -1;
    
        return dataTypes.map((element) => {
            index = index + 1;
            let color = '#9CADFF';

            if(selectedData != undefined && String(index) == String(selectedData[0]))
                color = '#2146FF'

            return(<div style={{"backgroundColor": color}} className="item" id={String(index)} onClick={((e) => dataTypeOnClick(e))}>
                {element}
            </div>)
        })
    }



    const GetAggregationOptions = () => {
        let index = 1000;
        return aggregationTypes.map((element) => {
            index = index + 1;
            let color = '#9CADFF';

            if(selectedAggregation != undefined && String(index) == String(selectedAggregation[0]))
                color = '#2146FF'

            return(<div style={{"backgroundColor": color}} className="item" id={String(index)} onClick={((e) => aggregationTypeOnClick(e))}>
                {element}
            </div>)
        })
    }


    return (
    <div className="container">
        <div className="content">
            <h2>Filter</h2>
            <div className="subsection">
                <div className="title">
                    <p>Select the type of data you want to visualize</p>
                </div>
                
                <div className="items">
                    {GetDataOptions()}
                </div>
            </div>
            <div className="subsection">
                <div className="title">
                    <p>Select the type of aggregation</p>
                </div>
                
                <div className="items">
                    {GetAggregationOptions()}
                </div>
            </div>
            <button className="done-button" onClick={((e) => doneOnClick(e))}>
                Done
            </button>
        </div>

        
    </div>)
  }


  export default Filter;