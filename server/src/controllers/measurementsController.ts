import { path } from 'nconf';
import measurements from '../measurements.json';
import knex, { Knex } from 'knex';
import {DATABASE_CONFIG} from '../database';

class MeasurementsController {

    // API ROUTES METHODS

    // get '/types'
    getMeasurementTypes = (request: any, response: any) => {
        console.log("[GET /measurements/types]");
        response.json(measurements)
    }

    getMeasurements = async (request: any, response: any) => {
        console.log("[GET /measurements]")

        const builder: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
        const res =  await builder.select('*')
                     .from( { public: 'MeasurementTypes' } )
                     /*.where(function(){
                        const queryArray = Object.entries(request.query);
                        queryArray.forEach(([key, value]) => {
                            switch(key){
                                case 'maxlon':
                                    key = 'lon'
                                    this.where(key.toString(), '<' ,value.toString());
                                    break;
                                case 'maxlat':
                                    key = 'lat'
                                    this.where(key.toString(), '<' ,value.toString());
                                    break;
                                case 'minlon':
                                    key = 'lon'
                                    this.where(key.toString(), '>' ,value.toString());
                                    break;
                                case 'minlat':
                                    key = 'lat'
                                    this.where(key.toString(), '>' ,value.toString());
                                    break;
                                default:
                                    this.where(key.toString(), value.toString());
                                    break;
                            }
                        });
                     })*/
        console.log(res);
        response.json(res);

    }

    // get '/:taskid'
    getMeasurementsByTrip = (request: any, response: any) => {
        console.log("We are getting all measurements of a trip requested!");
    }


    // AUXILIAR METHODS


  }

  export default MeasurementsController;