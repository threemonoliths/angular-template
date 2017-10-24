import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DepotDetail } from '../../../_domains/depotdetail.domain';
import { Role } from '../../../_domains/role.domain';
import { DepotDetailService } from '../../../_services/depotdetail.service';

import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';

import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class DepotDetailFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private depotdetailService: DepotDetailService
        ) {
    }

    title='';

   //日期控件本地化
    en: any;
    depotdetailForm: FormGroup;
    depotdetail: DepotDetail;
    submitted = false;

    clabelstr = '创建出入明细表';
    ulabelstr = "修改出入明细表";
    curlstr = frontendUrl + '/#/home/depotdetail/form';
    uurlstr = 'http://localhost:4200/#/home/depotdetail';
    
    ngOnInit() {
        if (this.depotdetailService.isUpdate == false) {
            this.title='创建出入明细表';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改出入明细表'
            // this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
          this.en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["日","一","二","三","四","五","六"],
            monthNames: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            today: 'Today',
            clear: 'Clear'
        };
    }

    createForm() {
        this.depotdetailForm = this.fb.group({
            FromTableName: [this.depotdetail.FromTableName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')])],
            FromColumnName: [this.depotdetail.FromColumnName, Validators.required ],
            BillNo: [this.depotdetail.BillNo, Validators.required ],
            Seqn: [this.depotdetail.Seqn, Validators.required ],
            Amount: [this.depotdetail.Amount, Validators.required ],
            Kind: [this.depotdetail.Kind, Validators.required ],
            Date: [this.depotdetail.Date, Validators.required],
            Depot: [this.depotdetail.Depot, Validators.required],
            State: [this.depotdetail.State, Validators.required],
            Comment: [this.depotdetail.Comment, Validators.required],
            Class: [this.depotdetail.Class, Validators.required]
              }, 
            
        );
    }

    onSubmit() {
        this.submitted = true;
        if (this.depotdetailForm.valid){
            this.prepareSaveCompany();
            if (!this.depotdetailService.isUpdate) {
                this.depotdetailService.add(this.depotdetail).then(()=> {this.router.navigateByUrl('/home/depotdetail');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增出入明细表成功', detail:'表名: '+this.depotdetail.FromTableName});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                this.depotdetailService.update(this.depotdetail).then(()=> {this.router.navigateByUrl('/home/depotdetail');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改出入明细表成功', detail:'表名: '+this.depotdetail.FromTableName});})
                    .catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            }
        }
    }
    
    prepareSaveCompany() {
        const formModel = this.depotdetailForm.value;
        this.depotdetail.FromTableName = formModel.FromTableName as string;
        this.depotdetail.FromColumnName = formModel.FromColumnName as string;
        this.depotdetail.BillNo = formModel.BillNo as string;
        this.depotdetail.Seqn = formModel.Seqn as string;
        this.depotdetail.Amount = formModel.Amount as number;
        this.depotdetail.Kind = formModel.Kind as number;
        this.depotdetail.Date = formModel.Date as string;
        this.depotdetail.Depot = formModel.Depot as number;
        this.depotdetail.State = formModel.State as string;
        this.depotdetail.Comment = formModel.Comment as string;
        this.depotdetail.Class = formModel.Class as string;

      }

    initCreate(){
        this.depotdetail = new DepotDetail();
        this.depotdetail.id = null;
        this.depotdetail.FromTableName = '';
        this.depotdetail.FromColumnName = '';
        this.depotdetail.BillNo = '';
        this.depotdetail.Seqn = '';
        this.depotdetail.Amount = null;
        this.depotdetail.Date = '';
        this.depotdetail.Depot = null;
        this.depotdetail.State = '';
        this.depotdetail.Comment = '';
         this.depotdetail.Class= '';
    }

    //确定选择框的source和target
    initUpdate() {
        this.depotdetail = this.depotdetailService.updateDepotDetail;
        // this.targetRoles = this.user.roles;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //用户名username异步验证
    // checFromtableName(control: AbstractControl): any {
    //     return this.depotdetailService.getByFromtableName(control.value, this.depotdetail.id).then(result=>{
    //             if (result.id > 0){
    //                 return{checFromtableName: true};
    //             }
    //             else {return null}
    //         })
    //         .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    // }
                
    
}