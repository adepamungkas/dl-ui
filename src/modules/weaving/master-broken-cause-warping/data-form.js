import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";

@inject(Service, Router)
export class DataForm {
    @bindable title;
    @bindable readOnly;

    constructor(service, router) {
        this.service = service;
        this.router = router;
    }

    categories = ["-- Pilih Kategori Penyebab Putus --", "Umum", "Lain-lain"];

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus"
    };
    
    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
    }
}