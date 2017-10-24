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

import { Dispatch } from '../../../_domains/dispatch.domain';
import { DispatchService } from '../../../_services/dispatch.service';
import { EventBusService, frontendUrl } from '../../../_services/eventbus.service';

@Component({
    templateUrl: './list.component.html'
})
export class DispatchListComponent implements OnInit {

    public dispatchList:Array<Dispatch>;
    private selectedDispatch = new Dispatch();

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
        private dispatchService: DispatchService,
        private eventbusService: EventBusService,
        private confirmationService: ConfirmationService) {
    }

    //面包屑组件导航相关数据
    labelstr = '配送单管理';
    urlstr = frontendUrl + '/#/home/dispatch';
    
    ngOnInit() {
        this.eventbusService.addCrumb(this.labelstr,this.urlstr);
        //初始化默认分页对象
        this.sort.field='date';
        this.sort.order='desc';
        //订阅搜索流，输入后300毫秒执行查询操作
        this.searchModels.debounceTime(300)
                         //.distinctUntilChanged()
                         .map(model => this.loadPage(model,this.sort,1,this.recordsPerPage).then(()=>this.dt.reset())).subscribe();
    }

    //获取datatable数据，初始化及单击页码时都将调用
    loadLazy(event: LazyLoadEvent) {
        this.loadPage(this.model, this.sort, event.first/this.recordsPerPage+1, this.recordsPerPage);
    } 

    //设置datatable总记录数与当前页的数据集
    loadPage(model, sort, page, per_page): any{
        return this.dispatchService.listOnePage(model,sort,page,per_page).then(result => { this.dispatchList = result['items'];
                   this.totalRecords = result['meta']['total']}).catch((error)=>
                    this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})
            );
    }
    
    //新增按钮事件
    new(): void {
        this.dispatchService.isUpdate=false;
        this.router.navigateByUrl('/home/dispatch/form');
    }
    
    //更新按钮事件
    update(): void {
        if (this.selectedDispatch.id!=null){
            this.dispatchService.isUpdate=true;
            this.dispatchService.initUpdate(this.selectedDispatch)
                .then(result => this.dispatchService.updateDispatch= result)
                .then(() => this.router.navigateByUrl('/home/dispatch/updateform')).catch((error)=>
                this.eventbusService.addMsgs({severity:'error', summary:'程序运行异常', detail:error})); 
        } else {
            this.confirmationService.confirm({
                message: '请选择一个配送单进行修改！',
                accept: () => {
                }
            });
        }
    }
     //审核按钮事件
    audit() :void {
        this.dispatchService.isAudit= true;
        this.update()
    }
    //datatable自定义排序事件处理函数
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
        if (this.selectedDispatch.id!=null){
            this.confirmationService.confirm({
                message: '确定要删除配送单：'+this.selectedDispatch.billno+' 吗？',
                accept: () => {
                    this.dispatchService.delete(this.selectedDispatch.id)
                        .then(()=>  this.loadPage(this.model,this.sort,1,this.recordsPerPage).then(() =>
                        this.eventbusService.addMsgs({severity:'success', summary:'删除配送单成功', detail:'单号: '+this.selectedDispatch.billno}))).then(()=>this.dt.reset())
                }
            });   
        } else {
            this.confirmationService.confirm({
                message: '请选择一个配送单进行删除！',
                accept: () => {
                }
            });
        }
    }
}