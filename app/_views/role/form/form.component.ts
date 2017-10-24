import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Role, Permission } from '../../../_domains/role.domain';
import { RoleService } from '../../../_services/role.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
import { minus } from '../../../_utils/array';
//import { passwordConfirming, forbiddenNameValidator} from './validator';

@Component({
    templateUrl: './form.component.html'
})
export class RoleFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private roleService: RoleService) {
    }

    sourcePermissions: Permission[];
    targetPermissions: Permission[];

    roleForm: FormGroup;
    role: Role;
    submitted = false;

    clabelstr = '创建角色';
    //ulabelstr = "修改角色";
    curlstr = frontendUrl + '/#/home/role/form';
    //uurlstr = 'http://localhost:4200/#/home/role';
    
    ngOnInit() {
        console.log("ngOnInit");
        if (this.roleService.isUpdate == false) {
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            //this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        
        this.createForm();
        // this.activeRoute.params.subscribe(
        //     params => { console.log(params) }
        // );
    }

    createForm() {
        console.log("createForm");
        this.roleForm = this.fb.group({
            rolename: [this.role.rolename, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('^[a-zA-Z][a-zA-Z0-9_]*$')])],        
              });
    }

    onSubmit() {
        console.log("onSubmit");
        this.submitted = true;
        if (this.roleForm.valid){
            if (!this.roleService.isUpdate) {
                this.role = this.prepareSaveRole();
                this.roleService.add(this.role).then(()=> {this.router.navigateByUrl('/home/role');
                    this.eventbusService.addMsgs({severity:'success', summary:'新增角色成功', detail:'角色名称: '+this.role.rolename});})
            } else {
                this.prepareUpdateRole();
                this.roleService.update(this.role).then(()=> {this.router.navigateByUrl('/home/role');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改角色成功', detail:'角色名称: '+this.role.rolename});})
            }
        }
    }
    
    prepareSaveRole(): Role {
        console.log("prepareSaveRole");
        const formModel = this.roleForm.value;
        const saveRole: Role = {
          id: null,
          rolename: formModel.rolename as string,
          permissions: this.targetPermissions,
        };
        return saveRole;
    }

    prepareUpdateRole() {
        const formModel = this.roleForm.value;
        this.role.rolename = formModel.rolename as string;
        this.role.permissions = this.targetPermissions;
    }
    
    //创建页面打开时执行
    initCreate(){
        console.log("initCreate");
        this.role = new Role();
        this.role.rolename = '';
        this.roleService.getAllPermissions().then(result => this.sourcePermissions = result);
        this.targetPermissions = new Array<Permission>();
    
    }

    //修改页面打开时，确定权限选择框的source和target
    initUpdate() {
        console.log("initUpdate");
        this.role = this.roleService.updateRole;
        this.targetPermissions = this.role.permissions;
        this.roleService.getAllPermissions().then(result => this.sourcePermissions = minus(result,this.targetPermissions));

    }
    //用户名username异步验证
    checkRoleName(control: AbstractControl): any {
        return this.roleService.getByRolename(control.value).then(result=>{
                if (result.id > 0){
                    return{checkRoleName: true};
                }
                else {return null}
            })
            .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
}