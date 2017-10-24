import {Component,OnInit,ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {DataTable} from 'primeng/primeng';
import { MeteringReturn,MeteringReturnDetail} from '../../../_domains/meteringreturn.domain';
import { MeteringReturnService } from '../../../_services/meteringreturn.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
import { minus } from '../../../_utils/array';
//import { passwordConfirming, forbiddenNameValidator} from './validator';

@Component({
    templateUrl: './form.component.html'
})
export class MeteringReturnFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private meteringreturnService: MeteringReturnService) {
    }

    @ViewChild(DataTable) dt: DataTable;
   title='';

    //日期控件本地化
    en: any;
    meteringreturnForm: FormGroup;
    meteringreturn: MeteringReturn;
    submitted = false;

   //明细列表中选择的detail对象
    selectedDetail = null;

    //合同明细信息输入是否正确
    detailsChecked = true;

    //明细列表数据源
    details = new Array<MeteringReturnDetail>();

    clabelstr = '创建油品回罐单';
    ulabelstr = "修改油品回罐";
    curlstr = frontendUrl + '/#/home/meteringreturn/form';
    uurlstr = 'http://localhost:4200/#/home/meteringreturn';
    //审核变量
    editable = true;
    yesorno=true;
    ngOnInit() {
        if (this.meteringreturnService.isUpdate == false) {
            this.title='创建油品回罐单';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } 
       else if (!this.meteringreturnService.isAudit) {
            this.title='修改油品回罐单';
            //this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        } else {
            this.title='审核油品回罐单';
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
        console.log("createForm");
        this.meteringreturnForm = this.fb.group({
            billno: [this.meteringreturn.billno, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')])],  
            billdate: [this.meteringreturn.billdate, Validators.required ],
            stockman: [this.meteringreturn.stockman, Validators.required],
            accountingclerk: [this.meteringreturn.accountingclerk, Validators.required],  
              });
    }

    onSubmit() {
        this.submitted = true;
        //准备判断回罐单明细输入是否正确
        this.meteringreturn.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.meteringreturn.details);
       // 验证回罐单基础信息
       if (this.meteringreturnForm.valid){
            
            //验证回罐单明细的数字类型字段
        if (this.detailsChecked){
             this.prepareSaveMeteringReturn();
           if (!this.meteringreturnService.isUpdate) {
                this.meteringreturnService.add(this.meteringreturn).then(()=> {this.router.navigateByUrl('/home/meteringreturn');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增油品回灌单成功', detail:'单号: '+this.meteringreturn.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                 this.meteringreturnService.update(this.meteringreturn).then(()=> {this.router.navigateByUrl('/home/meteringreturn');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改油品回灌单成功', detail:'单号号: '+this.meteringreturn.billno});})
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
        this.meteringreturn.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.meteringreturn.details);
        //验证合同基础信息
        if (this.meteringreturnForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveMeteringReturn();
                if (!this.meteringreturnService.isUpdate) {
                    this.meteringreturnService.update(this.meteringreturn).then(()=> {this.router.navigateByUrl('/home/meteringreturn');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改油品回罐单成功', detail:'单号: '+this.meteringreturn.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } 
                    else{
                    this.meteringreturnService.update(this.meteringreturn).then(()=> {this.router.navigateByUrl('/home/meteringreturn');
                        this.eventbusService.addMsgs({severity:'success', summary:'审核油品回灌单成功', detail:'单号: '+this.meteringreturn.billno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                }
            }  
            
        }
   }
    prepareSaveMeteringReturn() {
        const formModel = this.meteringreturnForm.value;
         this.meteringreturn.billno =formModel.billno as string;
         this.meteringreturn.billdate= formModel.billdate as string;
         this.meteringreturn.stockman= formModel.stockman as string;
         this.meteringreturn.accountingclerk=formModel.accountingclerk as string;
    }

    
    //创建页面打开时执行
    initCreate(){
        this.meteringreturn = new MeteringReturn();
        this.meteringreturn.id= null;
        this.meteringreturn.billno='';
        this.meteringreturn.billdate='';
        this.meteringreturn.stockman='';
        this.meteringreturn.accountingclerk='';
        this.addMeteringReturnDetail();
    }

    //修改页面打开时，确定权限选择框的source和target
    initUpdate() {
        this.meteringreturn = this.meteringreturnService.updateMeteringReturn;
         this.details = this.meteringreturn.details;
          this.meteringreturnService.isAudit = false;
        // this.targetRoles = this.user.roles;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    
    //增加合同明细记录
    addMeteringReturnDetail(){
        let d : MeteringReturnDetail = new MeteringReturnDetail();
        console.log(this.details);
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
    deleteMeteringReturnDetail(){
        console.log("delete detail")
        
        if (this.selectedDetail) {
            let i = this.details.indexOf(this.selectedDetail);
            console.log(this.details);
            this.details.splice(i,1);
            console.log(this.details);
            //用来刷新datatable
            this.details=this.details.slice();
            this.selectedDetail = null;
        }
    }


     //单号billno异步验证
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

    //验证合同明细中数字类型字段
    validateDetailNumber(ds: any): boolean {
        
        for ( let d of ds){
          if (d.quantity!=null) {
            if (isNaN(d.quantity)||(isNaN(d.stockplace))){
                return false
            } else if ((d.quantity < 0)||(d.stockplace < 0)) {
                return false
            }
          }
        }
        return true;
    }
}