import {Component,Input,OnInit,EventEmitter,ViewChild} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {HomeComponent} from '../../_views/home/home.component';
import { AuthenticationService } from '../../_services/authentication.service';
@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(public app: HomeComponent) {}
    private authenticationService: AuthenticationService;

   
    ngOnInit() {
        this.model = [
            {
                label: '系统设置', icon: 'settings', badgeStyleClass: 'teal-badge',
                items: [
                
                   {label: '用户管理', icon: 'person', routerLink: ['/home/user']},
                    {label: '角色管理', icon: 'people', routerLink: ['/home/role']},
                    {
                        label: '设置主题', icon: 'palette',
                        items: [
                            {label: 'Indigo - Pink', icon: 'brush', command: (event) => {this.changeTheme('indigo')}},
                            {label: 'Brown - Green', icon: 'brush', command: (event) => {this.changeTheme('brown')}},
                            {label: 'Blue - Amber', icon: 'brush', command: (event) => {this.changeTheme('blue')}},
                            {label: 'Blue Grey - Green', icon: 'brush', command: (event) => {this.changeTheme('blue-grey')}},
                            {label: 'Dark - Blue', icon: 'brush', command: (event) => {this.changeTheme('dark-blue')}},
                            {label: 'Dark - Green', icon: 'brush', command: (event) => {this.changeTheme('dark-green')}},
                            {label: 'Green - Yellow', icon: 'brush', command: (event) => {this.changeTheme('green')}},
                            {label: 'Purple - Cyan', icon: 'brush', command: (event) => {this.changeTheme('purple-cyan')}},
                            {label: 'Purple - Amber', icon: 'brush', command: (event) => {this.changeTheme('purple-amber')}},
                            {label: 'Teal - Lime', icon: 'brush', command: (event) => {this.changeTheme('teal')}},
                            {label: 'Cyan - Amber', icon: 'brush', command: (event) => {this.changeTheme('cyan')}},
                            {label: 'Grey - Deep Orange', icon: 'brush', command: (event) => {this.changeTheme('grey')}}
                        ]
                    }
                ]
            },
                {
                label: '基础信息', icon: 'dashboard', badgeStyleClass: 'teal-badge',
                items: [
                    {label: '公司信息', icon: 'assignment', routerLink: ['/home/company']},
                    {label: '仓库信息', icon: 'assignment', routerLink: ['/home/depot']},
                    {label: '数据字典管理', icon: 'person', routerLink: ['/home/dictionary']},
                    {label: '仓库明细管理', icon: 'person', routerLink: ['/home/depotstock']}
                ]
            },

            {
                label: '出入库管理', icon: 'dashboard', badgeStyleClass: 'teal-badge',
                items: [
                     {label: '出入明细表', icon: 'assignment', routerLink: ['/home/depotdetail']},
                    {label: '采购合同', icon: 'assignment', routerLink: ['/home/contract']},
                    {label: '油品移除库管理', icon: 'assignment', routerLink: ['/home/transfer']},
                    {label: '油品回罐管理', icon: 'person', routerLink: ['/home/meteringreturn']},
                    {label: '配送出库管理', icon: 'person', routerLink: ['/home/dispatch']},
                    {label: '油品入库检验单', icon: 'person', routerLink: ['/home/godownentry']},
                    {label: '销售油品提用表', icon: 'person', routerLink: ['/home/sellpickup']}
                ]
            },

            // {
            //     label: 'Themes', icon: 'palette',
            //     items: [
            //         {label: 'Indigo - Pink', icon: 'brush', command: (event) => {this.changeTheme('indigo')}},
            //         {label: 'Brown - Green', icon: 'brush', command: (event) => {this.changeTheme('brown')}},
            //         {label: 'Blue - Amber', icon: 'brush', command: (event) => {this.changeTheme('blue')}},
            //         {label: 'Blue Grey - Green', icon: 'brush', command: (event) => {this.changeTheme('blue-grey')}},
            //         {label: 'Dark - Blue', icon: 'brush', command: (event) => {this.changeTheme('dark-blue')}},
            //         {label: 'Dark - Green', icon: 'brush', command: (event) => {this.changeTheme('dark-green')}},
            //         {label: 'Green - Yellow', icon: 'brush', command: (event) => {this.changeTheme('green')}},
            //         {label: 'Purple - Cyan', icon: 'brush', command: (event) => {this.changeTheme('purple-cyan')}},
            //         {label: 'Purple - Amber', icon: 'brush', command: (event) => {this.changeTheme('purple-amber')}},
            //         {label: 'Teal - Lime', icon: 'brush', command: (event) => {this.changeTheme('teal')}},
            //         {label: 'Cyan - Amber', icon: 'brush', command: (event) => {this.changeTheme('cyan')}},
            //         {label: 'Grey - Deep Orange', icon: 'brush', command: (event) => {this.changeTheme('grey')}}
            //     ]
            // },

           
        ];
    }
   
    changeTheme(theme) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
        let layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');
        
        themeLink.href = 'assets/theme/theme-' + theme +'.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme +'.css';
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="!child.routerLink" 
                    [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
                </a>

                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ? 'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenu {

    @Input() item: MenuItem;
    
    @Input() root: boolean;
    
    @Input() visible: boolean;

    _reset: boolean;
        
    activeIndex: number;

    constructor(public app: HomeComponent) {}
        
    itemClick(event: Event, item: MenuItem, index: number) {        
        if(this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
        
        //avoid processing disabled items
        if(item.disabled) {
            event.preventDefault();
            return true;
        }
        
        //activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;
                
        //execute command
        if(item.command) {
            item.command({originalEvent: event, item: item});
        }

        //prevent hash change
        if(item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }
        
        //hide menu
        if(!item.items) {
            if(this.app.isHorizontal() || this.app.isSlim())
                this.app.resetMenu = true;
            else
                this.app.resetMenu = false;
                
            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }
    
    onMouseEnter(index: number) {
        if(this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = index;
        }
    }
    
    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val:boolean) {
        this._reset = val;

        if(this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }
}