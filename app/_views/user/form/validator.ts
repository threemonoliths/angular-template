import { AbstractControl, ValidatorFn } from '@angular/forms';
import {Component,OnInit} from '@angular/core';
import { Inject } from '@angular/core';

import { UserService } from '../../../_services/user.service';
import { User } from '../../../_domains/user.domain';
//验证密码输入一致
export function  passwordConfirming(c: AbstractControl) {
    if (c.get('password').value !== c.get('repeat').value) {
        return {passwordConfirming: true} ;
    } else { return null }
}

//test
// export function checkUsername(control: AbstractControl): any {
    
//        //return userService.getByUsername(control.value).then(result => console.log(result)).then(()=>{return{checkUserName: true}})
       
//        new Promise(resolve => {
    
//          //Fake a slow response from server
    
//          setTimeout(() => {
//            if(control.value.toLowerCase() === "admin"){
    
//              resolve({
//                "username taken": true
//              });
    
//            } else {
//              resolve(null);
//            }
//          }, 2000);
    
//        });
//      }


export class UsernameValidator{
    //protected userService: UserService
    constructor(){
       // this.userService=userService;
    }
    static checkUserName(control: AbstractControl): any {
        // return (control: AbstractControl): any => {
        //     console.log(control.value);
            //console.log(this.userService);
            //let control;
            //console.log(control.value);
            //console.log(this.userService);
            return new Promise(resolve => {
                
                     //Fake a slow response from server
                
                     setTimeout(() => {
                       if(control.value.toLowerCase() === "admin"){
                         console.log("hit")
                         //console.log(this.userService);
                         resolve({
                           "checkUserName": true
                         });
                
                       } else {
                         resolve(null);
                       }
                     }, 2000);
                
                   });
            // return userService.getByUsername(control.value).then(result=>{
            //     if (result.id > 0){
            //         console.log(result);
            //         console.log("exists:check OK");
            //         return null;
            //         //return{checkUserName: true};
            //     }
            //     else {return null}
            // })
            // .catch((error)=> {if (error.status== 404){console.log("not exist"); return null}});
        //};
    }
}