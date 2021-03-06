import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'internal-transfer-orders/unused';

module.exports = function (keyword, filter) {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("int-purchasing");

    var filterTemp = Object.assign({}, filter);

    var currentUsed = filterTemp ? filterTemp.currentUsed : null;

    if (filterTemp && filterTemp.currentUsed) {
        delete filterTemp.currentUsed;
    }

    return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filterTemp), currentUsed: currentUsed, size: 10 })
        .then(results => {
            if (currentUsed) {
                return results.data.filter((data) => data && currentUsed.indexOf(data.Id) < 0);
            }
            return results.data
        });
}