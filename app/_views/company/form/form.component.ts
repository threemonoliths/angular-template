import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Company } from '../../../_domains/company.domain';
import { Role } from '../../../_domains/role.domain';
import { CompanyService } from '../../../_services/company.service';

import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';

import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class CompanyFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private companyService: CompanyService
        ) {
    }

    title='';

   
    companyForm: FormGroup;
    company: Company;
    submitted = false;

    clabelstr = '创建公司信息';
    ulabelstr = "修改公司信息";
    curlstr = frontendUrl + '/#/home/company/form';
    uurlstr = 'http://localhost:4200/#/home/company';
    
    ngOnInit() {
        if (this.companyService.isUpdate == false) {
            this.title='创建公司信息';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改公司信息';
            // this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
    }

    createForm() {
        this.companyForm = this.fb.group({
            companyname: [this.company.companyname, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')]), this.checkCompanyName.bind(this)],
            companyiddr: [this.company.companyiddr, Validators.required ],
            legalperson: [this.company.legalperson, Validators.required ],
            bank: [this.company.bank, Validators.required ],
            accountnumber: [this.company.accountnumber, Validators.required ],
            zipcode: [this.company.zipcode, Validators.required ],
            dutyparagraph: [this.company.dutyparagraph, Validators.required],
            kind: [this.company.kind, Validators.required]
              }, 
            
        );
    }

    onSubmit() {
        this.submitted = true;
        if (this.companyForm.valid){
            this.prepareSaveCompany();
            if (!this.companyService.isUpdate) {
                this.companyService.add(this.company).then(()=> {this.router.navigateByUrl('/home/company');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增公司信息成功', detail:'公司名称: '+this.company.companyname});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                this.companyService.update(this.company).then(()=> {this.router.navigateByUrl('/home/company');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改公司信息成功', detail:'公司名称: '+this.company.companyname});})
                    .catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            }
        }
    }
    
    prepareSaveCompany() {
        const formModel = this.companyForm.value;
        this.company.companyname = formModel.companyname as string;
        this.company.companyiddr = formModel.companyiddr as string;
        this.company.legalperson = formModel.legalperson as string;
        this.company.bank = formModel.bank as string;
        this.company.accountnumber = formModel.accountnumber as string;
        this.company.zipcode = formModel.zipcode as string;
        this.company.dutyparagraph = formModel.dutyparagraph as string;
        this.company.kind = formModel.kind as string;
      }

    initCreate(){
        this.company = new Company();
        this.company.id = null;
        this.company.companyname = '';
        this.company.companyiddr = '';
        this.company.legalperson = '';
        this.company.bank = '';
        this.company.zipcode = '';
        this.company.accountnumber = '';
        this.company.dutyparagraph = '';
        this.company.kind = '';
       
    }

    //确定选择框的source和target
    initUpdate() {
        this.company = this.companyService.updateCompany;
        // this.targetRoles = this.user.roles;
        // this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
        //     .catch((error)=>
        //     this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //用户名username异步验证
    checkCompanyName(control: AbstractControl): any {
        return this.companyService.getByCompanyname(control.value, this.company.id).then(result=>{
                if (result.id > 0){
                    return{checkCompanyName: true};
                }
                else {return null}
            })
            .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
                
    
}