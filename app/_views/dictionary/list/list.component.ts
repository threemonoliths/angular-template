import {Component,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/debounceTime';

import {ConfirmationService} from 'primeng/primeng';
import {LazyLoadEvent} from 'primeng/primeng';
import {DataTable} from 'primeng/primeng';

import { Dictionary} from '../../../_domains/dictionary.domain';
import { DictionaryService } from '../../../_services/dictionary.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';

@Component({
    templateUrl: './list.component.html'
})
export class DictionaryListComponent implements OnInit {

    public dictionaryList:Array<Dictionary>;
    private selectedDictionary = new Dictionary();

    @ViewChild(DataTable) dt: DataTable;

    //datatable每页显示条目数、总条目数
    recordsPerPage = 15;
    totalRecords = 0;

    //datatable排序对象
    sort: any = new Object();

    //搜索框ngModel，保存查询参数
    model: any = new Object();
    //每当在输入框输入时（keyup），向流中发送搜索model
    private searchModels = new Subject<any>();
    search(): void {
        this.searchModels.next(this.model);
    }


    
      constructor(public router: Router,
        public activeRoute: ActivatedRoute,
        private dictionaryService: DictionaryService,
        private eventbusService: EventBusService,
        private confirmationService: ConfirmationService) {
      }
    //面包屑组件导航相关数据
      labelstr = '数据字典管理';
      urlstr = frontendUrl + '/#/home/dictionary';
    
      ngOnInit() {
        this.eventbusService.addCrumb(this.labelstr,this.urlstr);
        this.sort.field='Code';
        this.sort.order='asc';
         this.searchModels.debounceTime(300)
                         //.distinctUntilChanged()
                         .map(model => this.loadPage(model,this.sort,1,this.recordsPerPage).then(()=>this.dt.reset())).subscribe();
      }

      loadLazy(event: LazyLoadEvent) {
        this.loadPage(this.model, this.sort, event.first/this.recordsPerPage+1, this.recordsPerPage);
      } 

      //设置datatable总记录数与当前页的数据集
      loadPage(model, sort, page, per_page): any{
        return this.dictionaryService.listOnePage(model,sort,page,per_page).then(result => { this.dictionaryList = result['items'];
                   this.totalRecords = result['meta']['total']}).catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})
            );
    }
    
      public newDictionary(): void {
        this.dictionaryService.isUpdate=false;
        this.router.navigateByUrl('/home/dictionary/form');
      }

  
      //更新按钮事件
    updateDictionary(): void {
        if (this.selectedDictionary.id!=null){
            this.dictionaryService.isUpdate=true;
            this.dictionaryService.initUpdate(this.selectedDictionary)
                .then(result => this.dictionaryService.updateDictionary = result)
                .then(() => this.router.navigateByUrl('/home/dictionary/updateform')).catch((error)=>
                this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})); 
        } else {
            this.confirmationService.confirm({
                message: '请选择一个字典进行修改！',
                accept: () => {
                }
            });
        }
    }
    

    mySort(event){
      this.sort.field=event.field;
      let ord = event.order;
      if (ord==-1) {
        this.sort.order = 'desc'
      } else {
        this.sort.order = 'asc'
      }
      this.loadPage(this.model, this.sort, 1, this.recordsPerPage);
    }

    
     delete(): void {
        if (this.selectedDictionary.id!=null){
            this.confirmationService.confirm({
                message: '确定要删除字典：'+this.selectedDictionary.Code+' 吗？',
                accept: () => {
                    this.dictionaryService.delete(this.selectedDictionary.id)
                        .then(()=>  this.loadPage(this.model,this.sort,1,this.recordsPerPage).then(() =>
                        this.eventbusService.addMsgs({severity:'success', summary:'删除字典成功', detail:'编号: '+this.selectedDictionary.Code}))).then(()=>this.dt.reset())
                }
            });   
        } else {
            this.confirmationService.confirm({
                message: '请选择一个字典进行删除！',
                accept: () => {
                }
            });
        }
    }
      
}