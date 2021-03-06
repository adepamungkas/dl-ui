import {bindable, computedFrom} from 'aurelia-framework'

export class GarmentPreparingItem {
    activate(context) {
        this.data = context.data;
        this.options = context.context.options;
        this.error = context.error;
        this.contextOptions = context.context.options;
        this.readOnly = this.options.readOnly;
        this.data.Currency = "IDR";
        this.data.RemainingQuantity = this.data.Quantity;
        this.data.UENItemId = this.data.Id;
        if(this.options.isCreate){
            delete this.data.Id;
        }
    }

}