

export enum RoadCondition {
    'Good', 'Correct', 'Bad'
  }
  
export interface RoadModel {
    x : number[],
    y : number[],
    condition: RoadCondition[]
  }