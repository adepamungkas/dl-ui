import {
  inject,
  Lazy,
  bindable,
  BindingEngine
} from "aurelia-framework";
import {
  Router
} from "aurelia-router";
import {
  Service
} from "./service";
var ConstructionLoader = require("../../../loader/weaving-constructions-loader");
var BeamLoader = require("../../../loader/weaving-beam-loader");
var OperatorLoader = require("../../../loader/weaving-operator-loader");

@inject(Router, Service, BindingEngine)
export class Update {
  @bindable StartTime;
  @bindable PauseTime;
  @bindable ResumeTime;
  @bindable DoffTime;

  constructor(router, service, bindingEngine) {
    this.router = router;
    this.service = service;
    this.bindingEngine = bindingEngine;
    this.data = {};
  }

  formOptions = {
    cancelText: 'Kembali',
    saveText: 'Simpan',
  };

  beamColumns = [{
    value: "BeamNumber",
    header: "No. Beam"
  }, {
    value: "EmptyWeight",
    header: "Berat Kosong Beam"
  }];

  logColumns = [{
      value: "ShiftName",
      header: "Shift"
    },
    {
      value: "BrokenBeamCauses",
      header: "Putus"
    },
    {
      value: "MachineDateHistory",
      header: "Waktu"
    },
    {
      value: "MachineStatusHistory",
      header: "Status"
    },
    {
      value: "InformationHistory",
      header: "Information"
    }
  ];

  async activate(params) {
    var Id = params.Id;
    var dataResult;
    this.data = await this.service
      .getById(Id)
      .then(result => {
        dataResult = result;
        return this.service.getUnitById(result.WeavingUnitDocumentId);
      })
      .then(unit => {
        dataResult.WeavingDocument = unit;
        return dataResult;
      });
    if (this.data.Id) {
      this.BeamsWarping = this.data.WarpingBeamsDocument;
      this.Log = this.data.Details;
    }
    console.log(this.data);
  }

  causes = ["", "Putus Beam", "Mesin Bermasalah"];

  get constructions() {
    return ConstructionLoader;
  }

  get operators() {
    return OperatorLoader;
  }

  get beams() {
    return BeamLoader;
  }

  start() {
    if (this.showHideStartMenu === true) {
      this.showHideStartMenu = false;
    } else {
      this.showHideStartMenu = true;
      this.showHidePauseMenu = false;
      this.showHideResumeMenu = false;
      this.showHideDoffMenu = false;
    }
  }

  pause() {
    if (this.showHidePauseMenu === true) {
      this.showHidePauseMenu = false;
    } else {
      this.showHideStartMenu = false;
      this.showHidePauseMenu = true;
      this.showHideResumeMenu = false;
      this.showHideDoffMenu = false;
    }
  }

  resume() {
    if (this.showHideResumeMenu === true) {
      this.showHideResumeMenu = false;
    } else {
      this.showHideStartMenu = false;
      this.showHidePauseMenu = false;
      this.showHideResumeMenu = true;
      this.showHideDoffMenu = false;
    }
  }

  finish() {
    if (this.showHideDoffMenu === true) {
      this.showHideDoffMenu = false;
    } else {
      this.showHideStartMenu = false;
      this.showHidePauseMenu = false;
      this.showHideResumeMenu = false;
      this.showHideDoffMenu = true;
    }
  }

  hideMenu() {
    if (this.showResumeMenu === true || this.showDoffMenu === true || this.showPauseMenu === true) {
      this.showPauseMenu = false;
      this.showResumeMenu = false;
      this.showDoffMenu = false;
    }
  }

  StartTimeChanged(newValue) {
    this.service.getShiftByTime(newValue)
      .then(result => {
        this.error.StartShift = "";
        this.StartShift = {};
        this.StartShift = result;
      })
      .catch(e => {
        this.StartShift = {};
        this.error.StartShift = " Shift tidak ditemukan ";
      });
  }

  saveStart() {
    var IdContainer = this.data.Id;
    var HistoryDateContainer = this.StartDate;
    var HistoryTimeContainer = this.StartTime;
    var ShiftContainer = this.StartShift;

    this.data = {};
    this.data.Id = IdContainer;
    this.data.Details = {};
    this.data.Details.History = {};
    this.data.Details.History.MachineDate = HistoryDateContainer;
    this.data.Details.History.MachineTime = HistoryTimeContainer;
    this.data.Details.ShiftDocumentId = ShiftContainer.Id;

    this.service
      .updateStartEntry(this.data.Id, this.data)
      .then(result => {
        location.reload();
      })
      .catch(e => {
        this.error = e;
      });
  }

  PauseTimeChanged(newValue) {
    this.service.getShiftByTime(newValue)
      .then(result => {
        this.error.PauseShift = "";
        this.PauseShift = {};
        this.PauseShift = result;
      })
      .catch(e => {
        this.PauseShift = {};
        this.error.PauseShift = " Shift tidak ditemukan ";
      });
  }

  savePause() {
    var LastDetails = this.data.Details[this.data.Details.length - 1];
    var LastCausesBrokenBeam = parseInt(LastDetails.BrokenBeamCauses);
    // var LastCausesBrokenBeam = 0;
    var LastCausesMachineTroubled = parseInt(LastDetails.MachineTroubledCauses);
    // var LastCausesMachineTroubled = 0;

    switch (this.CauseOfStopping) {
      case "Putus Beam":
        LastCausesBrokenBeam = LastCausesBrokenBeam + 1;
        break;
      case "Mesin Bermasalah":
        LastCausesMachineTroubled = LastCausesMachineTroubled + 1;
        break;
      default:
        this.error.CauseOfStopping = "Penyebab berhenti harus diisi";
    }

    var IdContainer = this.data.Id;
    var HistoryDateContainer = this.PauseDate;
    var HistoryTimeContainer = this.PauseTime;
    var ShiftContainer = this.PauseShift.Id;
    var InformationContainer = this.Information;

    this.data = {};
    this.data.Id = IdContainer;
    this.data.Details = {};
    this.data.Details.History = {};
    this.data.Details.History.MachineDate = HistoryDateContainer;
    this.data.Details.History.MachineTime = HistoryTimeContainer;
    this.data.Details.History.Information = InformationContainer;
    this.data.Details.ShiftDocumentId = ShiftContainer;
    this.data.Details.Causes = {};
    this.data.Details.Causes.BrokenBeam = LastCausesBrokenBeam.toString();
    this.data.Details.Causes.MachineTroubled = LastCausesMachineTroubled.toString();

    this.service
      .updatePauseEntry(this.data.Id, this.data)
      .then(result => {
        location.reload();
      })
      .catch(e => {
        this.error = e;
      });
  }

  ResumeTimeChanged(newValue){
    this.service.getShiftByTime(newValue)
    .then(result => {
      this.error.ResumeShift = "";
      this.ResumeShift = {};
      this.ResumeShift = result;
    })
    .catch(e => {
      this.ResumeShift = {};
      this.error.ResumeShift = " Shift tidak ditemukan ";
    });
  }

  saveResume() {
    var IdContainer = this.data.Id;
    var HistoryDateContainer = this.ResumeDate;
    var HistoryTimeContainer = this.ResumeTime;
    var ShiftContainer = this.ResumeShift.Id;
    var OperatorContainer = this.ResumeOperator.Id;

    this.data = {};
    this.data.Id = IdContainer;
    this.data.Details = {};
    this.data.Details.History = {};
    this.data.Details.History.MachineDate = HistoryDateContainer;
    this.data.Details.History.MachineTime = HistoryTimeContainer;
    this.data.Details.ShiftDocumentId = ShiftContainer;
    this.data.Details.OperatorDocumentId = OperatorContainer;

    this.service
      .updateResumeEntry(this.data.Id, this.data)
      .then(result => {
        location.reload();
      })
      .catch(e => {
        this.error = e;
      });
  }

  DoffTimeChanged(newValue){
    this.service.getShiftByTime(newValue)
    .then(result => {
      this.error.DoffShift = "";
      this.DoffShift = {};
      this.DoffShift = result;
    })
    .catch(e => {
      this.DoffShift = {};
      this.error.DoffShift = " Shift tidak ditemukan ";
    });
  }  

  saveDoff() {
    var IdContainer = this.data.Id;
    var FinishCounterContainer = this.DoffFinishCounter;
    var BrutoWeightContainer = this.DoffBrutoWeight;
    var MachineSpeedContainer = this.DoffMachineSpeed;
    var TexSQContainer = this.DoffTexSQ;
    var ViscoContainer = this.DoffVisco;
    var PISContainer = this.DoffPIS;
    var SPUContainer = this.DoffSPU;
    var SizingBeamIdContainer = this.SizingBeamDocumentId.Id;
    var HistoryDateContainer = this.DoffDate;
    var HistoryTimeContainer = this.DoffTime;

    this.data = {};
    this.data.Id = IdContainer;
    this.data.Counter = {};
    this.data.Counter.Finish = FinishCounterContainer;
    this.data.Weight = {};
    this.data.Weight.Bruto = BrutoWeightContainer;
    this.data.MachineSpeed = MachineSpeedContainer;
    this.data.TexSQ = TexSQContainer;
    this.data.Visco = ViscoContainer;
    this.data.PIS = PISContainer;
    this.data.SPU = SPUContainer;
    this.data.SizingBeamDocumentId = SizingBeamIdContainer;
    this.data.Details = {};
    this.data.Details.History = {};
    this.data.Details.History.MachineDate = HistoryDateContainer;
    this.data.Details.History.MachineTime = HistoryTimeContainer;

    this.service
      .updateDoffEntry(this.data.Id, this.data)
      .then(result => {
        location.reload();
      })
      .catch(e => {
        this.error = e;
      });
  }

  cancelCallback(event) {
    this.router.navigateToRoute('list');
  }
}
