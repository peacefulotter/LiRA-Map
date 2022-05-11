
////// VISUALIZATION DATABASE OBJECTS //////
export interface Segment {
	id: number;
	positionA: [number, number];
	positionB:[number, number];
	way: number;
	value: number;
	count: number;
	direction: number;
}

// export interface AggregatedValue {
// 	id:number;
// 	segment:number;
// 	count:number;
// 	type:string;
// 	aggregation:string;
// 	value:number;
// }