import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../_domains/user.domain';
import { Role } from '../../../_domains/role.domain';
import { UserService } from '../../../_services/user.service';
import { RoleService } from '../../../_services/role.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
import { passwordConfirming, UsernameValidator } from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class UserFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private userService: UserService,
        private roleService: RoleService) {
    }

    title='';

    sourceRoles: Role[];
    targetRoles: Role[];

    userForm: FormGroup;
    user: User;
    submitted = false;

    clabelstr = '创建用户';
    // ulabelstr = "修改用户";
    curlstr = frontendUrl + '/#/home/user/form';
    // uurlstr = 'http://localhost:4200/#/home/user';
    
    ngOnInit() {
        if (this.userService.isUpdate == false) {
            this.title='创建用户';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改用户'
            //this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
    }

    createForm() {
        this.userForm = this.fb.group({
            username: [this.user.username, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('^[a-zA-Z][a-zA-Z0-9_]*$')]), this.checkUserName.bind(this)],
            email: [this.user.email, Validators.required ],
            fullname: this.user.fullname,
            position: this.user.position,
            password: [this.user.password,Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(6),
                                                               Validators.pattern('[a-zA-Z0-9]*$')]), this.checkPassword.bind(this)],
            repeat: [this.user.password, Validators.required]
              }, 
            {validator: passwordConfirming}
        );
    }

    onSubmit() {
        this.submitted = true;
        if (this.userForm.valid){
            this.prepareSaveUser();
            if (!this.userService.isUpdate) {
                this.userService.add(this.user).then(()=> {this.router.navigateByUrl('/home/user');
                        this.eventbusService.addMsgs({severity:'success', summary:'新增用户成功', detail:'用户名称: '+this.user.username});})
                        .catch((error)=>
                        this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            } else {
                this.userService.update(this.user).then(()=> {this.router.navigateByUrl('/home/user');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改用户成功', detail:'用户名称: '+this.user.username});})
                    .catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
            }
        }
    }
    
    prepareSaveUser() {
        const formModel = this.userForm.value;
        this.user.username = formModel.username as string;
        this.user.password = formModel.password as string;
        this.user.email = formModel.email as string;
        this.user.fullname = formModel.fullname as string;
        this.user.position = formModel.position as string;
        this.user.roles = this.targetRoles;
      }

    initCreate(){
        this.user = new User();
        this.user.id = null;
        this.user.username = '';
        this.user.email = '';
        this.user.fullname = '';
        this.user.password = '';
        this.user.position = '';
        this.roleService.list().then(result => this.sourceRoles = result);
        this.targetRoles = new Array<Role>();
    }

    //确定选择框的source和target
    initUpdate() {
        this.user = this.userService.updateUser;
        this.targetRoles = this.user.roles;
        this.roleService.list().then(result => this.sourceRoles = minus(result,this.targetRoles))
            .catch((error)=>
            this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error}));
    }

    //用户名username异步验证
    checkUserName(control: AbstractControl): any {
        return this.userService.getByUsername(control.value, this.user.id).then(result=>{
                if (result.id > 0){
                    return{checkUserName: true};
                }
                else {return null}
            })
            .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
     
    
    //用户名username异步验证
    checkPassword(control: AbstractControl): any {
        return this.userService.getByUsername(control.value, this.user.id).then(result=>{
                if (result.id > 0){
                    return{checkPassword: true};
                }
                else {return null}
            })
            .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
    }
     
    
}