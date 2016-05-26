/**
 * Responsive Devices Detect Directives for Angular 2
 *
 * @created_by Manu Cutillas
 * @created_at May 23, 2016
 * @updated_at May 26, 2016
 * @version_0.1.1
 * 
 * Dependencies:
 * @angular/core : "2.0.0-rc.1"
 * rxjs: "5.0.0-beta.6"
 *
 * @more_info http://kalypso.agency
 *            https://github.com/ManuCutillas
 *            https://www.npmjs.com/~manucutillas
 * 
 * @description : Responsive Detect Directives for Angular 2
 *
 */

/*
CUSTOM SIZES IN GLOBAL APP

Set this code in the initial app component.
//import {BootstrapConfig } from 'responsive-directives-angular2';

@Component({
  selector: 'my-app',
  viewProviders: [NameListService],
  templateUrl: 'app/components/app.component.html',
  providers:[BootstrapConfig],
  directives: [ROUTER_DIRECTIVES, MenuComponent,FooterComponent]
})

export class AppComponent {
 
  private static MY_NEW_BOOTSTRAP_CONFIG = {
		lg: { min: 40 },
    md: { min: 22, max: 39 },
    sm: { min: 18, max: 21 },
    xs: { max: 17 }
	};
  
  constructor(private myNewBootstrapConfig:BootstrapConfig){
    this.myNewBootstrapConfig.Config(AppComponent.MY_NEW_BOOTSTRAP_CONFIG);
  }
}

bootstrap(AppComponent, [

]);

*/

import {Injectable, Directive, Input, TemplateRef, ViewContainerRef, ElementRef,OnInit} from '@angular/core';
import 'rxjs/add/operator/share';
import {Observable, Observer} from  'rxjs/Rx';

//	Default config
export interface BOOTSTRAP_SIZES {
	lg:any,
    md:any,
    sm:any,
    xs:any
}

@Injectable()
export class BootstrapConfig implements BOOTSTRAP_SIZES {
    
    private user_configuration:any;
    // => Default config if user not configure custom sizes
	public static DEFAULT_CONFIG:BOOTSTRAP_SIZES = {
		lg: { min: 1200 },
        md: { min: 992, max: 1199 },
        sm: { min: 768, max: 991 },
        xs: { max: 767 }
	};
    
     public static _config = BootstrapConfig.DEFAULT_CONFIG;
     
     constructor(public lg:any,public md:any, public sm:any, public xs:any){}
     
    //Call this method in bootstrap init application   
    Config(newConfig:any){
        //Assign new config to ResponsiveState
        BootstrapConfig._config = newConfig;
    }
}

export class ResponsiveState {
    elementoObservar: Observable<any>;
    anchoObservar:Observable<any>;
    width: any;
    
    constructor() {
       this.elementoObservar = Observable.fromEvent(window, 'resize').map(this.sizeOperations).share();
       this.anchoObservar = Observable.fromEvent(window, 'resize').map(this.sizeObserver).share();
    }

    getDeviceSizeInitial(){
        return this.sizeOperations();
    }
    
    sizeObserver = (): any => {
        this.width = this.getWidth();
        try {
            return this.width;
        } catch (error) {
            //console.error('size operations error :', error);
        }
    }

    sizeOperations = (): any => {
        this.width = this.getWidth();
        try {
            if (BootstrapConfig._config.lg.min <= this.width) {
                return 'lg';  
            } else if (BootstrapConfig._config.md.max >= this.width && BootstrapConfig._config.md.min <= this.width) {
                return 'md';   
            } else if (BootstrapConfig._config.sm.max >= this.width && BootstrapConfig._config.sm.min <= this.width) {
                return 'sm';   
            } else if (BootstrapConfig._config.xs.max >= this.width) {
                return 'xs';
            }
        } catch (error) {
            //console.error('size operations error :', error);
        }
    }
    getWidth(){
       return window.innerWidth;
    }
}

/*
 * DEVICES DIRECTIVES
 * @Desktops / @Tablets / @Mobiles
 */

/*======== DESKTOPS STATES =========*/
@Directive({
    selector: '[isDesktop]',
    providers: [ResponsiveState]
})
export class IsDesktop {
    private sizeLG: string = 'lg';
    private sizeMD: string = 'md';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) { 
        if(this.initialDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
    }
    @Input() set isDesktop(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.sizeMD || valor == this.sizeLG) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    
    initialDeviceSize() {
        let initialDevice: string = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'lg' || initialDevice == 'md') {
            return true;
        } else {
            return false;
        }
    }
}

/*======== TABLETS STATES =========*/
@Directive({
    selector: '[isTablet]',
    providers: [ResponsiveState]
})
export class IsTablet {
    private sizeSM: string = 'sm';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) { 
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
    }
    @Input() set isTablet(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.sizeSM) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'sm') {
            return true;
        } else {
            return false;
        }
    }
}

/*======== MOBILE STATES =========*/
@Directive({
    selector: '[isMobile]',
    providers: [ResponsiveState]
})
export class IsMobile {
    private sizeXS: string = 'xs';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) { 
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
    }
    @Input() set isMobile(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.sizeXS) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'xs') {
            return true;
        } else {
            return false;
        }
    }
}


/*
 *
 * Bootstrap standard screen sizes directives
 * LG / MD / SM / XS
 */

/*======== LG STATES =========*/
@Directive({
    selector: '[lg]',
    providers: [ResponsiveState]
})
export class LG {
    private state: string = 'lg';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) { 
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
    }
    @Input() set lg(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.state) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'lg') {
            return true;
        } else {
            return false;
        }

    }
}

/*======== MD STATES =========*/
@Directive({
    selector: '[md]',
    providers: [ResponsiveState]
})
export class MD {
    private state: string = 'md';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) { 
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
    }
    @Input() set md(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.state) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }
        });
    }
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'md') {
            return true;
        } else {
            return false;
        }

    }
}

/*======== SM STATES =========*/
@Directive({
    selector: '[sm]',
    providers: [ResponsiveState]
})
export class SM {

    private state: string = 'sm';
    private noRepeat: number = 0;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
     }
    @Input() set sm(element: any) {

        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.state) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'sm') {
            return true;
        } else {
            return false;
        }

    }
}

/*======== XS STATES =========*/
@Directive({
    selector: '[xs]',
    providers: [ResponsiveState]
})
export class XS {
    private state: string = 'xs';
    private noRepeat: number = 0;
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {
        if(this.initalDeviceSize()){
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.noRepeat = 1;   
        }
     }
    @Input() set xs(element: any) {
        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == this.state) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }
        });
    }
    initalDeviceSize() {
        let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'xs') {
            return true;
        } else {
            return false;
        }

    }
}


/*======== MULTIPLE SIZES STATES =========*/
/* show */
@Directive({
    selector: '[showItBootstrap]',
    providers: [ResponsiveState]
})
export class ShowItBootstrap {
    private noRepeat: number = 0;
    private callInit: number = 0;
    
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {}
   
     
   @Input() set showItBootstrap(_grid_state: string) {
       if(this.callInit == 0){
             this.init(_grid_state);  
              this.callInit = 1;
       }
        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == _grid_state[0] || valor == _grid_state[1]) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }

        });
    }
    
    init(_grid_state:string){
         let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
            if (initialDevice == _grid_state[0] || initialDevice == _grid_state[1]) {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.noRepeat = 0;
                this.viewContainer.clear();
            }
    } 
}

/* hide */
@Directive({
    selector: '[hideItBootstrap]',
    providers: [ResponsiveState]
})
export class HideItBootstrap {
    private noRepeat: number = 0;
    private callInit: number = 0;
    
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {}
   
     
   @Input() set hideItBootstrap(_grid_state: string) {
       if(this.callInit == 0){
             this.init(_grid_state);  
              this.callInit = 1;
       }
        this._responsiveState.elementoObservar.subscribe((valor:any) => {
            if (valor == _grid_state[0] || valor == _grid_state[1]) {
                   this.noRepeat = 0;
                   this.viewContainer.clear();
            } else {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            }

        });
    }
    
    init(_grid_state:string){
         let initialDevice: any = this._responsiveState.getDeviceSizeInitial();
            if (initialDevice == _grid_state[0] || initialDevice == _grid_state[1]) {
                 this.noRepeat = 0;
                 this.viewContainer.clear();
            } else {
               
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            }
    } 
}

/*======== CUSTOM SIZES =========*/
/* show */
@Directive({
    selector: '[showItSizes]',
    providers: [ResponsiveState]
})
export class ShowItSizes {
    private noRepeat: number = 0;
    private callInit: number = 0;
    
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {}
   
     
   @Input() set showItSizes(_grid_state: any) {
       if(this.callInit == 0){
             this.init(_grid_state);  
              this.callInit = 1;
       }
        this._responsiveState.anchoObservar.subscribe((size:any) => {
            if ( size >= _grid_state.min && size <= _grid_state.max) {
               if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
               }
            } else {
                   this.noRepeat = 0;
                   this.viewContainer.clear();
            }
        });
    }
    
    init(_grid_state:any){
         let width: any = this._responsiveState.getWidth();
            if ( width >= _grid_state.min && width <= _grid_state.max) {
               if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
               }
            } else {
                   this.noRepeat = 0;
                   this.viewContainer.clear();
            }
    } 
}

/* hide */
@Directive({
    selector: '[hideItSizes]',
    providers: [ResponsiveState]
})
export class HideItSizes {
    private noRepeat: number = 0;
    private callInit: number = 0;
    
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _responsiveState: ResponsiveState
    ) {}
   
   @Input() set hideItSizes(_grid_state: any) {
       if(this.callInit == 0){
             this.init(_grid_state);  
              this.callInit = 1;
       }
        this._responsiveState.anchoObservar.subscribe((size:any) => {
            if ( size >= _grid_state.min && size <= _grid_state.max) {
                   this.noRepeat = 0;
                   this.viewContainer.clear();
            } else {
                   if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
               }
            }
        });
    }
    
    init(_grid_state:any){
         let width: any = this._responsiveState.getWidth();
            if ( width >= _grid_state.min && width <= _grid_state.max) {
                   this.noRepeat = 0;
                   this.viewContainer.clear();
            } else {
                if (this.noRepeat == 0) {
                    this.noRepeat = 1;
                    this.viewContainer.createEmbeddedView(this.templateRef);
               }
            }
    } 
}