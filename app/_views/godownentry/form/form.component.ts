import {Component,OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {DataTable} from 'primeng/primeng';

import { Godownentry,GodownentryDetail } from '../../../_domains/godownentry';
import { GodownentryService } from '../../../_services/godownentry.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class GodownentryFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private godownentryService: GodownentryService) {
    }

    

    @ViewChild(DataTable) dt: DataTable;

    title='';

    //日期控件本地化
    en: any;
    godownentryForm: FormGroup;
    godownentry: Godownentry;
    submitted = false;

    //明细列表中选择的detail对象
    selectedDetail = null;

    //合同明细信息输入是否正确
    detailsChecked = true;

    //明细列表数据源
    details = new Array<GodownentryDetail>();

    clabelstr = '创建合同';
    ulabelstr = "修改合同";
    curlstr = frontendUrl + '/#/home/contract/form';
    uurlstr = 'http://localhost:4200/#/home/contract';
    
    ngOnInit() {
        if (this.godownentryService.isUpdate == false) {
            this.title='创建合同';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改合同';
            this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
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
        this.godownentryForm= this.fb.group({
       
            BillNo: [this.godownentry.BillNo, Validators.required ],
        Supplier:[this.godownentry.Supplier,Validators.required],
       Contractno:[this.godownentry.Contractno,Validators.required],

        });
    }

    onSubmit() {
        this.submitted = true;
        //准备判断合同明细输入是否正确
        this.godownentry.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.godownentry.details);
        //验证合同基础信息
       
        if (this.godownentryForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveGodownentry();
                if (!this.godownentryService.isUpdate) {
                    this.godownentryService.add(this.godownentry).then(()=> {this.router.navigateByUrl('/home/godownentry');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增合同成功', detail:'合同号: '+this.godownentry.BillNo});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } else {
                   
                    this.godownentryService.update(this.godownentry).then(()=> {this.router.navigateByUrl('/home/godownentry');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改合同成功', detail:'合同号: '+this.godownentry.BillNo});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                }
            }  
            
        }
    }
    
    prepareSaveGodownentry() {
        const formModel = this.godownentryForm.value;



        this.godownentry.BillNo=formModel.BillNo as string;
        this.godownentry.Contractno=formModel.Contractno as string;
        this.godownentry.Supplier=formModel.Supplier as string;

      
    }

    initCreate(){
        this.godownentry = new Godownentry();
        this.godownentry.BillNo= null;
        this.godownentry.Contractno= '';
        this.godownentry.Supplier= '';
      
        this.addGodownentryDetail();
    }

    //确定选择框的source和target
    initUpdate() {
        this.godownentry = this.godownentryService.updateGodownentry;
        this.details = this.godownentry.details;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //增加合同明细记录
    addGodownentryDetail() {
        let d : GodownentryDetail = new GodownentryDetail();
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
    deleteGodownentryDetail(){
        if (this.selectedDetail) {
            let i = this.details.indexOf(this.selectedDetail);
            this.details.splice(i,1);
            //用来刷新datatable
            this.details=this.details.slice();
            this.selectedDetail = null;
        }
    }

    //合同号contractno异步验证
    checkBillNo(control: AbstractControl): any {
        
         return this.godownentryService.getByBillNo(control.value, this.godownentry.id).then(result=>{
                 if (result.id > 0){
                  return{checkBillNo: true};
           }
                else {return null}
       })
           .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
 //合同额数字验证
 validateNumber(c: FormControl) {
    return c.value > 0 ? null : {validateNumber: true}
};

//验证合同明细中数字类型字段
validateDetailNumber(ds: any): boolean {
    
    for ( let d of ds){
      if (d.quantity!=null) {
        if (isNaN(d.quantity)||(isNaN(d.price))||(isNaN(d.total))) {
            return false
        } else if ((d.quantity < 0)||(d.price < 0)||(d.total < 0))  {
            return false
        }
      }
    }
    return true;
}
            
   
                
    
}