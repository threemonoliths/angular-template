import {Component,OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {DataTable} from 'primeng/primeng';

import { Dispatch, DispatchDetail } from '../../../_domains/dispatch.domain';
import { DispatchService } from '../../../_services/dispatch.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class DispatchFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private dispatchService: DispatchService) {
    }

    @ViewChild(DataTable) dt: DataTable;
    title='';

    //日期控件本地化
    en: any;
    dispatchForm: FormGroup;
    dispatch: Dispatch;
    submitted = false;
    //明细列表中选择的detail对象
    selectedDetail = null;

    //合同明细信息输入是否正确
    detailsChecked = true;

    //明细列表数据源
    details = new Array<DispatchDetail>();

    clabelstr = '创建配送单';
    ulabelstr = "修改配送单";
    curlstr = frontendUrl + '/#/home/dispatch/form';
    uurlstr = 'http://localhost:4200/#/home/dispatch';
    //审核变量
    editable = true;
    yesorno=true;
    ngOnInit() {
        if (this.dispatchService.isUpdate == false) {
            this.title='创建配送单';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else if (!this.dispatchService.isAudit) {
            this.title='修改配送单';
            this.initUpdate();
        } else {
            this.title='审计配送单';
            this.editable = false;
            this.yesorno=false;
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
        this.dispatchForm = this.fb.group({
            billno: [this.dispatch.billno, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')])],
            date: [this.dispatch.date, Validators.required ],
            purchaser: [this.dispatch.purchaser, Validators.required],
            stockplace: [this.dispatch.stockplace, Validators.required],
            quantity: [this.dispatch.quantity,  Validators.compose([Validators.required,this.validateNumber])],
            total: [this.dispatch.total,  Validators.compose([Validators.required,this.validateNumber])],
            dispatcher: [this.dispatch.dispatcher, Validators.required],
            stockman: [this.dispatch.stockman, Validators.required],
            accountingclerk: [this.dispatch.accountingclerk, Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
        //准备判断合同明细输入是否正确
        this.dispatch.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.dispatch.details);
        //验证合同基础信息
        if (this.dispatchForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
            this.prepareSaveDispatch();
            if (!this.dispatchService.isUpdate) {
                this.dispatchService.add(this.dispatch).then(()=> {this.router.navigateByUrl('/home/dispatch');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增配送单成功', detail:'单号: '+this.dispatch.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                this.dispatchService.update(this.dispatch).then(()=> {this.router.navigateByUrl('/home/dispatch');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改配送单成功', detail:'单号: '+this.dispatch.billno});})
                    .catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            }
        }
     }
    }
    
    //审计保存按钮
    onAudited(){
         this.submitted = true;
        //准备判断合同明细输入是否正确
        this.dispatch.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.dispatch.details);
        //验证合同基础信息
        if (this.dispatchForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveDispatch();
                if (!this.dispatchService.isUpdate) {
                    this.dispatchService.update(this.dispatch).then(()=> {this.router.navigateByUrl('/home/dispatch');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改配送单成功', detail:'单号: '+this.dispatch.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } 
                    else{
                    this.dispatchService.update(this.dispatch).then(()=> {this.router.navigateByUrl('/home/dispatch');
                        this.eventbusService.addMsgs({severity:'success', summary:'审核配送单成功', detail:'单号: '+this.dispatch.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                }
            }  
            
        }
   }
    prepareSaveDispatch() {
        const formModel = this.dispatchForm.value;
        this.dispatch.billno = formModel.billno as string;
        this.dispatch.date = formModel.date as string;
        this.dispatch.purchaser = formModel.purchaser as string;
        this.dispatch.stockplace = formModel.stockplace as string;
        this.dispatch.quantity = formModel.quantity as number;
        this.dispatch.total = formModel.total as number;
        this.dispatch.dispatcher = formModel.dispatcher as string;
        this.dispatch.stockman = formModel.stockman as string;
        this.dispatch.accountingclerk = formModel.accountingclerk as string;
      }

    initCreate(){
        this.dispatch = new Dispatch();
        this.dispatch.id = null;
        this.dispatch.billno = '';
        this.dispatch.date = '';
        this.dispatch.purchaser = '';
        this.dispatch.stockplace = '';
        this.dispatch.quantity = null;
        this.dispatch.total = null;
        this.dispatch.dispatcher = '';
        this.dispatch.stockman = '';
        this.dispatch.accountingclerk = '';
        this.addDispatchDetail();
    }

    //确定选择框的source和target
    initUpdate() {
        this.dispatch = this.dispatchService.updateDispatch;
        this.details = this.dispatch.details;
        this.dispatchService.isAudit=false;
        // this.targetRoles = this.user.roles;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    addDispatchDetail() {
        let d : DispatchDetail = new DispatchDetail();
        //生成id
        let maxid = 0
        for (let i of this.details){
            if (i.id > maxid) {
                maxid=i.id
            }
        }
        d.id = maxid + 1
        this.details.push(d);
        //用来刷新datatable
        this.details=this.details.slice();
    }

    //删除合同明细记录
    deleteDispatchDetail(){
        if (this.selectedDetail) {
            let i = this.details.indexOf(this.selectedDetail);
            this.details.splice(i,1);
            //用来刷新datatable
            this.details=this.details.slice();
            this.selectedDetail = null;
        }
    }

    //合同号contractno异步验证
    checkBillno(control: AbstractControl): any {
         return null 
        // return this.userService.getByUsername(control.value, this.user.id).then(result=>{
        //         if (result.id > 0){
        //             return{checkUserName: true};
        //         }
        //         else {return null}
        //     })
        //     .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
      //合计数量、油劵回笼金额数字验证
    validateNumber(c: FormControl) {
        return c.value > 0 ? null : {validateNumber: true}
    };

    //验证合同明细中数字类型字段
    validateDetailNumber(ds: any): boolean {
        
        for ( let d of ds){
          if (d.startdegree!=null) {
            if (isNaN(d.startdegree)||(isNaN(d.enddegree))||(isNaN(d.quantity))) {
                return false
            } else if ((d.startdegree < 0)||(d.enddegree < 0)||(d.quantity < 0))  {
                return false
            }
          }
        }
        return true;
    }           
    
}



 