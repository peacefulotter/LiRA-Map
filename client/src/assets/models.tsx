
import { ReactElement } from "react";
import { LatLng } from 'leaflet';
import { createLines, createPoints, createRectangle, createCircle, createHotlines } from '../Components/Rides/Path';

enum RoadCondition {
  'Good', 'Correct', 'Bad'
}


// represents the metadata of a ride
export interface RideMeta {
  TripId: string,
  TaskId: number, 
  StartTimeUtc: string,	// "2021-04-27T18:11:02.223Z"
  EndTimeUtc: string, //	"2021-04-27T18:57:18.551Z"
  StartPositionLat: string, //	"55.683240"
  StartPositionLng: string, //	"12.584890"
  StartPositionDisplay: string, //	"{\"ntk_geocode_time\":48…2,\"type\":\"geocode\"}"
  EndPositionLat: string, //	"55.711580"
  EndPositionLng: string, //		"12.570990"
  EndPositionDisplay: string, //		"{\"ntk_geocode_time\":31…"house_number\":\"37\"}"
  Duration: string, //		"2021-07-30T00:46:16.327Z"
  DistanceKm: number, //		86.0269352289332
  FK_Device: string, //	"d25574dd-e9a4-4296-ae00-7dcef3aa8278"
  Created_Date: string, //		"2021-07-30T07:52:47.969Z"
  Updated_Date: string, //		"0001-01-01T00:00:00.000Z"

  // Fully_Imported: boolean, //		true
  // Fully_RouteAnnotated: object|null, //	null
  // Description	: string|null, //	null
  // ChangeLog: string|null, //	null
}

export type RidePos = LatLng[];

export interface PointData {
  pos: LatLng;
  value?: number | undefined;   // using this field depending on the measurement
}

export type RideData = PointData[]

export interface RideModel {
  pos: RidePos,
  meta: RideMeta
}

export type MeasurementProperty = {
	createElements: ( path: RideData, weight: number, properties: MeasurementProperty, map?: any ) => ReactElement | ReactElement[];
	query: string;
	name: string;
	color: string;
	size: number;
	value?: string;
	minValue?: number;
	maxValue?: number;
}

export type Measurements = {
	'Track_Pos': MeasurementProperty,
	'Interpolation': MeasurementProperty, 
	'Map_Matching': MeasurementProperty,
	'Engine_RPM': MeasurementProperty,
}
	

// TODO: explain to put this on the db
export const MEASUREMENTS: Measurements = {
	'Track_Pos': { 
    	createElements: ( path: RideData, weight: number, properties: MeasurementProperty ) => createPoints(path, weight, properties, createCircle),
		query: '/trackpos',      
		name: 'Track Pos',     
		color: "#AA00CC", 
		size: 1
	},
	'Interpolation': { 
		createElements: createLines,
		query: '/interpolation', 
		name: 'Interpolation', 
		color: "#2288FF",
		size: 1 
	}, 
  	'Map_Matching' : { 
		createElements: createLines,
		query: '/map_match',
		name: 'Map Matching', 
		color: "#0000FF", 
		size: 0.00003, 
		value: 'object' 
	},
	'Engine_RPM': { 
		createElements: createHotlines,
		query: '/rpms', 
		name: 'Engine RPM',    
		color: "#FF00FF", 
		size: 1, 
		value: 'number', 
		minValue: 2000, 
		maxValue: 6000 
	}
}

