import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Depotstock} from '../../../_domains/depotstock.domain';
import { DepotstockService } from '../../../_services/depotstock.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, forbiddenNameValidator} from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class DepotstockFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private depotstockService: DepotstockService) {
    }

    title='';
    depotstockForm: FormGroup;
    depotstock:  Depotstock;
    submitted = false;

    clabelstr = '创建仓库明细';
    ulabelstr = "修改仓库明细";
    curlstr = frontendUrl + '/#/home/depotstock/form';
    uurlstr = 'http://localhost:4200/#/home/depotstock';
    
    ngOnInit() {
        if (this.depotstockService.isUpdate == false) {
            this.title='创建仓库明细';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改仓库明细';
            // this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
    }

    createForm() {
        
        this.depotstockForm = this.fb.group({
            OilName: [this.depotstock.OilName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')])],
            DepotDate: [this.depotstock.DepotDate, Validators.required ],
            Amount: [this.depotstock.Amount, Validators.compose([Validators.required,this.validateNumber])],
            DepotName: [this.depotstock.DepotName, Validators.required ]
           
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.depotstockForm.valid){
            this.prepareSaveDictionary();
            if (!this.depotstockService.isUpdate) {
            this.depotstockService.add(this.depotstock).then(()=> {this.router.navigateByUrl('/home/depotstock');
                this.eventbusService.addMsgs({severity:'success', summary:'新增仓库明细成功', detail:'油品名称: '+this.depotstock.OilName});});
            } else {
                this.depotstockService.update(this.depotstock).then(()=> {this.router.navigateByUrl('/home/depotstock');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改仓库明细成功', detail:'油品名称: '+this.depotstock.OilName});})
            }
        }
    }
    
    prepareSaveDictionary() {
        const formModel = this.depotstockForm.value;
        this.depotstock.OilName=formModel.OilName as string;
        this.depotstock.DepotDate=formModel.DepotDate as string;
        this.depotstock.Amount=formModel.Amount  as number;
        this.depotstock.DepotName= formModel.DepotName as string;
      }

    initCreate(){
        this.depotstock = new Depotstock();
        this.depotstock.id = null;
        this.depotstock.OilName= '';
        this.depotstock.DepotDate= '';
        this.depotstock.Amount= null;
        this.depotstock.DepotName='';
    }

    //确定选择框的source和target
    initUpdate() {
        this.depotstock= this.depotstockService.updateDepotstock;
    }

    //字典Code异步验证
    checkCode(control: AbstractControl): any {
         return null 
    }

     //合计值、序列数字验证
    validateNumber(c: FormControl) {
        return c.value > 0 ? null : {validateNumber: true}
    };

}