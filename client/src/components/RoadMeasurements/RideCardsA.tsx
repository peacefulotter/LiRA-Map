import {FC, ReactNode, useEffect, useState} from "react";
import {List, ListRowRenderer} from "react-virtualized";

import Checkbox from '../Checkbox';

import {RideMeta, TripsOptions} from '../../models/models'

import {useMetasCtx} from "../../context/MetasContext";


interface CardsProps {
	showMetas: SelectMeta[]
	onClick: (meta: SelectMeta, i: number, isChecked: boolean) => void;
}

const Cards: FC<CardsProps> = ({showMetas, onClick}) => {
	const renderRow: ListRowRenderer = ({index, key, style}): ReactNode => {
		const meta = showMetas[index];
		return <div key={key} style={style}>
			<Checkbox
				forceState={meta.selected}
				className="ride-card-container"
				html={<div><b>{meta.TaskId}</b><br></br>{new Date(meta.Created_Date).toLocaleDateString()}</div>}
				onClick={(isChecked) => {
					onClick(meta, index, isChecked)
				}}/>
		</div>
	}

	// @ts-ignore
	return <List
		width={170}
		height={2500}
		rowHeight={61}
		rowRenderer={renderRow}
		rowCount={showMetas.length}/>
}

interface SelectMeta extends RideMeta {
	selected: boolean;
}

const RideCards: FC = () => {

	const {metas, selectedMetas, setSelectedMetas, showMetas, setShowMetas} = useMetasCtx();

	// const [showMetas, setShowMetas] = useState<SelectMeta[]>([])

	useEffect(() => {
		// console.log("Metas:\n");
		// console.log(metas); // ProdURL
		setShowMetas(metas.map(m => ({...m, selected: false})))
	}, [metas])

	const onClick = (md: SelectMeta, i: number, isChecked: boolean) => {
		const temp = [...showMetas]
		temp[i].selected = isChecked
		setShowMetas(temp)

		return isChecked
			? setSelectedMetas(prev => [...prev, md])
			: setSelectedMetas(prev => prev.filter(({TripId}) => md.TripId !== TripId))
	}


	return (
		<div className="ride-list">
			<Cards showMetas={showMetas} onClick={onClick}/>
		</div>
	)
}

export default RideCards;
