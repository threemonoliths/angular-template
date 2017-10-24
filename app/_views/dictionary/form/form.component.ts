import {Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Dictionary} from '../../../_domains/dictionary.domain';
import { DictionaryService } from '../../../_services/dictionary.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';
//import { passwordConfirming, forbiddenNameValidator} from './validator';
import { minus } from '../../../_utils/array';

@Component({
    templateUrl: './form.component.html'
})
export class DictionaryFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public activeRoute: ActivatedRoute,
        private eventbusService: EventBusService,
        private dictionaryService: DictionaryService) {
    }

    title='';
    dictionaryForm: FormGroup;
    dictionary:  Dictionary;
    submitted = false;

    clabelstr = '创建字典';
    ulabelstr = "修改字典";
    curlstr = frontendUrl + 'http://localhost:4200/#/home/dictionary/form';
    uurlstr = 'http://localhost:4200/#/home/dictionary';
    
    ngOnInit() {
        if (this.dictionaryService.isUpdate == false) {
            this.title='创建字典';
            this.eventbusService.addCrumb(this.clabelstr,this.curlstr);
            this.initCreate();
        } else {
            this.title='修改字典';
            // this.eventbusService.addCrumb(this.ulabelstr,this.uurlstr);
            this.initUpdate();
        }
        this.createForm();
    }

    createForm() {
        
        this.dictionaryForm = this.fb.group({
            Code: [this.dictionary.Code, Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(4),
                                                               Validators.pattern('[a-zA-Z0-9_]*$')])],
            Name: [this.dictionary.Name, Validators.required ],
            Key:[this.dictionary.Key, Validators.required ],
            Parm:[this.dictionary.Parm, Validators.required ],
            Value: [this.dictionary.Value, Validators.compose([Validators.required,this.validateNumber])],
            Seq: [this.dictionary.Seq, Validators.compose([Validators.required,this.validateNumber])]
           
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.dictionaryForm.valid){
            this.prepareSaveDictionary();
            if (!this.dictionaryService.isUpdate) {
            this.dictionaryService.add(this.dictionary).then(()=> {this.router.navigateByUrl('/home/dictionary');
                this.eventbusService.addMsgs({severity:'success', summary:'新增字典成功', detail:'字典编码: '+this.dictionary.Code});});
            } else {
                this.dictionaryService.update(this.dictionary).then(()=> {this.router.navigateByUrl('/home/dictionary');
                    this.eventbusService.addMsgs({severity:'success', summary:'修改字典成功', detail:'字典编码: '+this.dictionary.Code});})
            }
        }
    }
    
    prepareSaveDictionary() {
        const formModel = this.dictionaryForm.value;
        this.dictionary.Code= formModel.Code as string;
        this.dictionary.Name = formModel.Name as string;
        this.dictionary.Key = formModel.Key as string;
        this.dictionary.Parm = formModel.Parm as string;
        this.dictionary.Value = formModel.Value  as number;
        this.dictionary.Seq = formModel.Seq as number;
      }

    initCreate(){
        this.dictionary = new Dictionary();
        this.dictionary.id = null;
        this.dictionary.Code= '';
        this.dictionary.Name= '';
        this.dictionary.Key= '';
        this.dictionary.Parm = '';
        this.dictionary.Value= null;
        this.dictionary.Seq=null;
    }

    //确定选择框的source和target
    initUpdate() {
        this.dictionary= this.dictionaryService.updateDictionary;
    }

    //字典Code异步验证
    checkCode(control: AbstractControl): any {
         return null 
    }

     //合计值、序列数字验证
    validateNumber(c: FormControl) {
        return c.value > 0 ? null : {validateNumber: true}
    };

}