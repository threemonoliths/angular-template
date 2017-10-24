import {Component,OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {DataTable} from 'primeng/primeng';

import { Contract, ContractDetail } from '../../../_domains/contract.domain';
import { ContractService } from '../../../_services/contract.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class ContractFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private contractService: ContractService) {
    }

    

    @ViewChild(DataTable) dt: DataTable;

    title='';

    //日期控件本地化
    en: any;
    contractForm: FormGroup;
    contract: Contract;
    submitted = false;

    //明细列表中选择的detail对象
    selectedDetail = null;

    //合同明细信息输入是否正确
    detailsChecked = true;

    //明细列表数据源
    details = new Array<ContractDetail>();

    clabelstr = '创建合同';
    // ulabelstr = "修改合同";
    curlstr = frontendUrl + '/#/home/contract/form';
    // uurlstr = 'http://localhost:4200/#/home/contract';

    //审核变量
    editable = true;
    yesorno=true;
    
    
    ngOnInit() {
        if (this.contractService.isUpdate == false) {
            this.title='创建合同';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else if (!this.contractService.isAudit) {
            this.title='修改合同';
            this.initUpdate();
        } else {
            this.title='审计合同';
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
        this.contractForm = this.fb.group({
            contractno: [this.contract.contractno, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9]*$')])],
            signdate: [this.contract.signdate, Validators.required ],
            signplace: [this.contract.signplace, Validators.required],
            totalprice: [this.contract.totalprice, Validators.compose([Validators.required,this.validateNumber])],
            firstparty: [this.contract.firstparty, Validators.required],
            secondparty: [this.contract.secondparty, Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
        //准备判断合同明细输入是否正确
        this.contract.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.contract.details);
        //验证合同基础信息
        if (this.contractForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveContract();
                if (!this.contractService.isUpdate) {
                    this.contractService.add(this.contract).then(()=> {this.router.navigateByUrl('/home/contract');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增合同成功', detail:'合同号: '+this.contract.contractno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } 
              else{
                    this.contractService.update(this.contract).then(()=> {this.router.navigateByUrl('/home/contract');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改合同成功', detail:'合同号: '+this.contract.contractno});})
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
        this.contract.details = this.details;
        this.detailsChecked = this.validateDetailNumber(this.contract.details);
        //验证合同基础信息
        if (this.contractForm.valid){
            
            //验证合同明细的数字类型字段
            if (this.detailsChecked){
                this.prepareSaveContract();
                if (!this.contractService.isUpdate) {
                    this.contractService.update(this.contract).then(()=> {this.router.navigateByUrl('/home/contract');
                        this.eventbusService.addMsgs({severity:'success', summary:'修改合同成功', detail:'合同号: '+this.contract.contractno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                } 
                    else{
                    this.contractService.update(this.contract).then(()=> {this.router.navigateByUrl('/home/contract');
                        this.eventbusService.addMsgs({severity:'success', summary:'审核合同成功', detail:'合同号: '+this.contract.contractno});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
                }
            }  
            
        }
   }
    prepareSaveContract() {
        const formModel = this.contractForm.value;
        this.contract.contractno = formModel.contractno as string;
        this.contract.signdate = formModel.signdate as string;
        this.contract.signplace = formModel.signplace as string;
        this.contract.totalprice = formModel.totalprice as number;
        this.contract.firstparty = formModel.firstparty as string;
        this.contract.secondparty = formModel.secondparty as string;
        this.contractService.isAudit=false;
    }

    initCreate(){
         this.editable=true;
        this.contract = new Contract();
        this.contract.id = null;
        this.contract.contractno = '';
        this.contract.signdate = '';
        this.contract.signplace = '';
        this.contract.totalprice = null;
        this.contract.firstparty = '';
        this.addContractDetail();
    }

    //确定选择框的source和target
    initUpdate() {
        this.contract = this.contractService.updateContract;
        this.details = this.contract.details;
        this.contractService.isAudit = false;
        
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //增加合同明细记录
    addContractDetail() {
        let d : ContractDetail = new ContractDetail();
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
    deleteContractDetail(){
        if (this.selectedDetail) {
            let i = this.details.indexOf(this.selectedDetail);
            this.details.splice(i,1);
            //用来刷新datatable
            this.details=this.details.slice();
            this.selectedDetail = null;
        }
    }

    //合同号contractno异步验证
    checkContractno(control: AbstractControl): any {
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
          
            console.log(d)
            if (isNaN(d.quantity)||(isNaN(d.price))||(isNaN(d.total))) {
                console.log("false")
                return false
            } else if ((d.quantity < 0)||(d.price < 0)||(d.total < 0))  {
                console.log("false")
                return false
            }
          
        }
        console.log("true")
        return true;
    }
                
    
}