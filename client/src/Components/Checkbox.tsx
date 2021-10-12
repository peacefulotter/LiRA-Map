import React, { useState } from "react";
import JsxParser from 'react-jsx-parser'; 

interface Props {
	className: string;
	content: any;
  	onClick: (isChecked: boolean) => void;
}

const Checkbox = (props: Props) => {
	const { className, content, onClick } = props;
  	const [ isChecked, setChecked ] = useState<boolean>(false)
  
  	return (
        <div 
            className={`${className} btn ${isChecked ? 'btn-checked' : ''}`} 
            onClick={() => { 
				onClick(!isChecked); 
				setChecked(prev => !prev); 
			}}>
            <JsxParser jsx={content}></JsxParser>
        </div>
  	);
};
export default Checkbox;