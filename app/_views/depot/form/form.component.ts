import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Depot } from '../../../_domains/depot.domain';
//import { Role } from '../../../_domains/role.domain';
import { DepotService } from '../../../_services/depot.service';
//import { RoleService } from '../../../_services/role.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class DepotFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private depotService: DepotService
       // private roleService: RoleService
    ) {
    }

    title='';
    depotForm: FormGroup;
    depot: Depot;
    submitted = false;

    clabelstr = '创建仓库信息';
    ulabelstr = "修改仓库信息";
    curlstr = frontendUrl + '/#/home/depot/form';
    uurlstr = 'http://localhost:4200/#/home/depot';
    
    ngOnInit() {
        if (this.depotService.isUpdate == false) {
            this.title='创建仓库信息';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改仓库信息'
            // this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
    }

    createForm() {
        this.depotForm = this.fb.group({
            DepotName: [this.depot.DepotName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')]), this.checkDepotName.bind(this)],
            OilName: [this.depot.OilName, Validators.required ],
            DepotIDDR: [this.depot.DepotIDDR, Validators.required ],
            Kind: [this.depot.Kind, Validators.required ],
            Company_Id: [this.depot.Company_Id, Validators.required ]
          
              }, 
            
        );
    }

    onSubmit() {
        this.submitted = true;
        if (this.depotForm.valid){
            this.prepareSaveDepot();
            if (!this.depotService.isUpdate) {
                this.depotService.add(this.depot).then(()=> {this.router.navigateByUrl('/home/depot');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增仓库信息成功', detail:'仓库名称: '+this.depot.DepotName});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                this.depotService.update(this.depot).then(()=> {this.router.navigateByUrl('/home/depot');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改仓库信息成功', detail:'仓库名称: '+this.depot.DepotName});})
                    .catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            }
        }
    }
    
    prepareSaveDepot() {
        const formModel = this.depotForm.value;
        this.depot.DepotName = formModel.DepotName as string;
        this.depot.OilName = formModel.OilName as string;
        this.depot.DepotIDDR = formModel.DepotIDDR as string;
        this.depot.Kind = formModel.Kind as string;
        this.depot.Company_Id = formModel.Company_Id as number;
        
      }

    initCreate(){
        this.depot = new Depot();
        this.depot.id = null;
        this.depot.DepotName = '';
        this.depot.OilName = '';
        this.depot.DepotIDDR = '';
        this.depot.Kind = '';
        this.depot.Company_Id =null;
       }

    //确定选择框的source和target
    initUpdate() {
        this.depot = this.depotService.updateDepot;
       
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //用户名username异步验证
    checkDepotName(control: AbstractControl): any {
        return this.depotService.getByDepotname(control.value, this.depot.id).then(result=>{
                if (result.id > 0){
                    return{checkDepotName: true};
                }
                else {return null}
            })
            .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
                
    
}