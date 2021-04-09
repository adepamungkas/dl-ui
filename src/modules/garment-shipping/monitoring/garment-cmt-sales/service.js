import { buildQueryString } from 'aurelia-path';
import { RestService } from '../../../../utils/rest-service';

const serviceUri = 'garment-shipping/monitoring/garment-cmt-sales';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "packing-inventory");
    }

search(info) { 
       var endpoint = `${serviceUri}?buyerAgent=${info.buyerAgent}&optionDate=${info.optionDate}&dateFrom=${info.dateFrom}&dateTo=${info.dateTo}`;
       return super.get(endpoint);
        
    }
    
generateExcel(info) {
       var endpoint = `${serviceUri}/download?buyerAgent=${info.buyerAgent}&optionDate=${info.optionDate}&dateFrom=${info.dateFrom}&dateTo=${info.dateTo}`;
       return super.getXls(endpoint);
    }

}