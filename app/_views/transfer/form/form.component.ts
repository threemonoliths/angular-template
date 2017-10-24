import {Component,OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {DataTable} from 'primeng/primeng';

import { Transfer, TransferDetail } from '../../../_domains/transfer.domain';
import { TransferService } from '../../../_services/transfer.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class TransferFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private transferService: TransferService) {
    }

      //审核变量
    editable = true;
    yesorno=true;

    @ViewChild(DataTable) dt: DataTable;

    title='';

    //日期控件本地化
    en: any;
    transferForm: FormGroup;
    transfer: Transfer;
    submitted = false;

    //明细列表中选择的detail对象
    selectedDetail = null;

    //合同明细信息输入是否正确
    detailsChecked = true;

    //明细列表数据源
    details = new Array<TransferDetail>();

    clabelstr = '创建油品调拨单';
    ulabelstr = "修改油品调拨单";
    curlstr = frontendUrl + '/#/home/transfer/form';
    uurlstr = 'http://localhost:4200/#/home/transfer';
    
    ngOnInit() {
        if (this.transferService.isUpdate == false) {
            this.title='创建油品调拨单';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else if (!this.transferService.isAudit) {
            this.title='修改油品调拨单';
            //this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        } else {
            this.title='审计油品调拨单';
            this.editable = false;
            this.yesorno=false;
            //this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
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
        this.transferForm = this.fb.group({
            billno: [this.transfer.billno, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9]*$')])],
            date: [this.transfer.date, Validators.required ],
            stockplace: [this.transfer.stockplace, Validators.required],
            dispatcher: [this.transfer.dispatcher,  Validators.required],
            stockman: [this.transfer.stockman, Validators.required],
            accountingclerk: [this.transfer.accountingclerk, Validators.required],
            entryperson: [this.transfer.entryperson, Validators.required],
            auditperson: [this.transfer.auditperson, Validators.required],
            state: [this.transfer.state, Validators.required],
            auditdate: [this.transfer.auditdate, Validators.required]
                        
        });
    }

    onSubmit() {
        this.submitted = true;
        //准备判断油品调拨单明细输入是否正确
        this.transfer.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.transfer.details);
        console.log(this.transferForm.valid)
        //验证油品调拨单基础信息
        if (this.transferForm.valid){
            
            //验证油品调拨单明细的数字类型字段
            console.log(this.detailsChecked)
            if (this.detailsChecked){
                this.prepareSaveTransfer();
                if (!this.transferService.isUpdate) {
                    this.transferService.add(this.transfer).then(()=> {this.router.navigateByUrl('/home/transfer');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增油品调拨单成功', detail:'调拨单号: '+this.transfer.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } else {
                   
                    this.transferService.update(this.transfer).then(()=> {this.router.navigateByUrl('/home/transfer');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改油品调拨单成功', detail:'调拨单号: '+this.transfer.billno});})
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
        this.transfer.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.transfer.details);
        //验证合同基础信息
        if (this.transferForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveTransfer();
                if (!this.transferService.isUpdate) {
                    this.transferService.update(this.transfer).then(()=> {this.router.navigateByUrl('/home/transfer');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改油品调拨单成功', detail:'单号: '+this.transfer.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } 
                    else{
                    this.transferService.update(this.transfer).then(()=> {this.router.navigateByUrl('/home/transfer');
                        this.eventbusService.addMsgs({severity:'success', summary:'审核油品调拨单成功', detail:'单号: '+this.transfer.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                }
            }  
            
        }
   }
    prepareSaveTransfer() {
        const formModel = this.transferForm.value;
        this.transfer.billno = formModel.billno as string;
        this.transfer.date = formModel.date as string;
        this.transfer.stockplace = formModel.stockplace as string;
        this.transfer.dispatcher = formModel.dispatcher as string;
        this.transfer.stockman = formModel.stockman as string;
        this.transfer.accountingclerk = formModel.accountingclerk as string;
        this.transfer.entryperson = formModel.entryperson as string;
        this.transfer.auditperson = formModel.auditperson as string;
        this.transfer.state = formModel.state as string;
        this.transfer.auditdate = formModel.auditdate as string;

    }

    initCreate(){
        this.transfer = new Transfer();
        this.transfer.id = null;
        this.transfer.billno = '';
        this.transfer.date = '';
        this.transfer.stockplace = '';
        this.transfer.dispatcher = '';
        this.transfer.accountingclerk = '';
        this.transfer.entryperson = '';
        this.transfer.auditperson = '';
        this.transfer.state = '';
        this.transfer.auditdate = '';

        this.addTransferDetail();
    }

    //确定选择框的source和target
    initUpdate() {
        this.transfer = this.transferService.updateTransfer;
        this.details = this.transfer.details;
        this.transferService.isAudit=false;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //增加调拨单号明细记录
    addTransferDetail() {
       
        let d : TransferDetail = new TransferDetail();
        //生成id
        let maxid = 0
        //console.log(this.details)
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

    //删除油品调拨单明细记录
    deleteTransferDetail(){
        if (this.selectedDetail) {
            let i = this.details.indexOf(this.selectedDetail);
            this.details.splice(i,1);
            //用来刷新datatable
            this.details=this.details.slice();
            this.selectedDetail = null;
        }
    }

    //调拨单号billno异步验证
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

    //合同额数字验证
    validateNumber(c: FormControl) {
        return c.value > 0 ? null : {validateNumber: true}
    };

    //验证油品调拨单明细中数字类型字段
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