import { useState } from "react";

interface Props {
	forceState?: boolean;
	className: string;
	html: JSX.Element;
  	onClick: (isChecked: boolean) => void;
}

const Checkbox = (props: Props) => {
	const { forceState, className, html, onClick } = props;
  	const [ isChecked, setChecked ] = useState<boolean>(forceState || false)	
	  	
  	return (
        <div 
            className={`${className} btn ${(forceState === undefined ? isChecked : forceState) ? 'btn-checked' : ''}`} 
            onClick={() => { 	
				const update = forceState === undefined ? !isChecked : !forceState								
				onClick( update ); 
				setChecked( update ); 
			}}>
			{html}
        </div>
  	);
};
export default Checkbox;