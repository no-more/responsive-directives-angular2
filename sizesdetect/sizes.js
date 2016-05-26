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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var core_1 = require('@angular/core');
require('rxjs/add/operator/share');
var Rx_1 = require('rxjs/Rx');
var BootstrapConfig = (function () {
    function BootstrapConfig(lg, md, sm, xs) {
        this.lg = lg;
        this.md = md;
        this.sm = sm;
        this.xs = xs;
    }
    //Call this method in bootstrap init application   
    BootstrapConfig.prototype.Config = function (newConfig) {
        //Assign new config to ResponsiveState
        BootstrapConfig._config = newConfig;
    };
    // => Default config if user not configure custom sizes
    BootstrapConfig.DEFAULT_CONFIG = {
        lg: { min: 1200 },
        md: { min: 992, max: 1199 },
        sm: { min: 768, max: 991 },
        xs: { max: 767 }
    };
    BootstrapConfig._config = BootstrapConfig.DEFAULT_CONFIG;
    BootstrapConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object, Object, Object, Object])
    ], BootstrapConfig);
    return BootstrapConfig;
}());
exports.BootstrapConfig = BootstrapConfig;
var ResponsiveState = (function () {
    function ResponsiveState() {
        var _this = this;
        this.sizeObserver = function () {
            _this.width = _this.getWidth();
            try {
                return _this.width;
            }
            catch (error) {
            }
        };
        this.sizeOperations = function () {
            _this.width = _this.getWidth();
            try {
                if (BootstrapConfig._config.lg.min <= _this.width) {
                    return 'lg';
                }
                else if (BootstrapConfig._config.md.max >= _this.width && BootstrapConfig._config.md.min <= _this.width) {
                    return 'md';
                }
                else if (BootstrapConfig._config.sm.max >= _this.width && BootstrapConfig._config.sm.min <= _this.width) {
                    return 'sm';
                }
                else if (BootstrapConfig._config.xs.max >= _this.width) {
                    return 'xs';
                }
            }
            catch (error) {
            }
        };
        this.elementoObservar = Rx_1.Observable.fromEvent(window, 'resize').map(this.sizeOperations).share();
        this.anchoObservar = Rx_1.Observable.fromEvent(window, 'resize').map(this.sizeObserver).share();
    }
    ResponsiveState.prototype.getDeviceSizeInitial = function () {
        return this.sizeOperations();
    };
    ResponsiveState.prototype.getWidth = function () {
        return window.innerWidth;
    };
    return ResponsiveState;
}());
exports.ResponsiveState = ResponsiveState;
/*
 * DEVICES DIRECTIVES
 * @Desktops / @Tablets / @Mobiles
 */
/*======== DESKTOPS STATES =========*/
var IsDesktop = (function () {
    function IsDesktop(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.sizeLG = 'lg';
        this.sizeMD = 'md';
        this.noRepeat = 0;
        if (this.initialDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(IsDesktop.prototype, "isDesktop", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.sizeMD || valor == _this.sizeLG) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    IsDesktop.prototype.initialDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'lg' || initialDevice == 'md') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], IsDesktop.prototype, "isDesktop", null);
    IsDesktop = __decorate([
        core_1.Directive({
            selector: '[isDesktop]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], IsDesktop);
    return IsDesktop;
}());
exports.IsDesktop = IsDesktop;
/*======== TABLETS STATES =========*/
var IsTablet = (function () {
    function IsTablet(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.sizeSM = 'sm';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(IsTablet.prototype, "isTablet", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.sizeSM) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    IsTablet.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'sm') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], IsTablet.prototype, "isTablet", null);
    IsTablet = __decorate([
        core_1.Directive({
            selector: '[isTablet]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], IsTablet);
    return IsTablet;
}());
exports.IsTablet = IsTablet;
/*======== MOBILE STATES =========*/
var IsMobile = (function () {
    function IsMobile(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.sizeXS = 'xs';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(IsMobile.prototype, "isMobile", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.sizeXS) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    IsMobile.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'xs') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], IsMobile.prototype, "isMobile", null);
    IsMobile = __decorate([
        core_1.Directive({
            selector: '[isMobile]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], IsMobile);
    return IsMobile;
}());
exports.IsMobile = IsMobile;
/*
 *
 * Bootstrap standard screen sizes directives
 * LG / MD / SM / XS
 */
/*======== LG STATES =========*/
var LG = (function () {
    function LG(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.state = 'lg';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(LG.prototype, "lg", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.state) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    LG.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'lg') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], LG.prototype, "lg", null);
    LG = __decorate([
        core_1.Directive({
            selector: '[lg]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], LG);
    return LG;
}());
exports.LG = LG;
/*======== MD STATES =========*/
var MD = (function () {
    function MD(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.state = 'md';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(MD.prototype, "md", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.state) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    MD.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'md') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], MD.prototype, "md", null);
    MD = __decorate([
        core_1.Directive({
            selector: '[md]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], MD);
    return MD;
}());
exports.MD = MD;
/*======== SM STATES =========*/
var SM = (function () {
    function SM(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.state = 'sm';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(SM.prototype, "sm", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.state) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    SM.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'sm') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], SM.prototype, "sm", null);
    SM = __decorate([
        core_1.Directive({
            selector: '[sm]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], SM);
    return SM;
}());
exports.SM = SM;
/*======== XS STATES =========*/
var XS = (function () {
    function XS(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.state = 'xs';
        this.noRepeat = 0;
        if (this.initalDeviceSize()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.noRepeat = 1;
        }
    }
    Object.defineProperty(XS.prototype, "xs", {
        set: function (element) {
            var _this = this;
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _this.state) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    XS.prototype.initalDeviceSize = function () {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == 'xs') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], XS.prototype, "xs", null);
    XS = __decorate([
        core_1.Directive({
            selector: '[xs]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], XS);
    return XS;
}());
exports.XS = XS;
/*======== MULTIPLE SIZES STATES =========*/
/* show */
var ShowItBootstrap = (function () {
    function ShowItBootstrap(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.noRepeat = 0;
        this.callInit = 0;
    }
    Object.defineProperty(ShowItBootstrap.prototype, "showItBootstrap", {
        set: function (_grid_state) {
            var _this = this;
            if (this.callInit == 0) {
                this.init(_grid_state);
                this.callInit = 1;
            }
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _grid_state[0] || valor == _grid_state[1]) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    ShowItBootstrap.prototype.init = function (_grid_state) {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == _grid_state[0] || initialDevice == _grid_state[1]) {
            if (this.noRepeat == 0) {
                this.noRepeat = 1;
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        }
        else {
            this.noRepeat = 0;
            this.viewContainer.clear();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ShowItBootstrap.prototype, "showItBootstrap", null);
    ShowItBootstrap = __decorate([
        core_1.Directive({
            selector: '[showItBootstrap]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], ShowItBootstrap);
    return ShowItBootstrap;
}());
exports.ShowItBootstrap = ShowItBootstrap;
/* hide */
var HideItBootstrap = (function () {
    function HideItBootstrap(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.noRepeat = 0;
        this.callInit = 0;
    }
    Object.defineProperty(HideItBootstrap.prototype, "hideItBootstrap", {
        set: function (_grid_state) {
            var _this = this;
            if (this.callInit == 0) {
                this.init(_grid_state);
                this.callInit = 1;
            }
            this._responsiveState.elementoObservar.subscribe(function (valor) {
                if (valor == _grid_state[0] || valor == _grid_state[1]) {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
                else {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    HideItBootstrap.prototype.init = function (_grid_state) {
        var initialDevice = this._responsiveState.getDeviceSizeInitial();
        if (initialDevice == _grid_state[0] || initialDevice == _grid_state[1]) {
            this.noRepeat = 0;
            this.viewContainer.clear();
        }
        else {
            if (this.noRepeat == 0) {
                this.noRepeat = 1;
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], HideItBootstrap.prototype, "hideItBootstrap", null);
    HideItBootstrap = __decorate([
        core_1.Directive({
            selector: '[hideItBootstrap]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], HideItBootstrap);
    return HideItBootstrap;
}());
exports.HideItBootstrap = HideItBootstrap;
/*======== CUSTOM SIZES =========*/
/* show */
var ShowItSizes = (function () {
    function ShowItSizes(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.noRepeat = 0;
        this.callInit = 0;
    }
    Object.defineProperty(ShowItSizes.prototype, "showItSizes", {
        set: function (_grid_state) {
            var _this = this;
            if (this.callInit == 0) {
                this.init(_grid_state);
                this.callInit = 1;
            }
            this._responsiveState.anchoObservar.subscribe(function (size) {
                if (size >= _grid_state.min && size <= _grid_state.max) {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
                else {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    ShowItSizes.prototype.init = function (_grid_state) {
        var width = this._responsiveState.getWidth();
        if (width >= _grid_state.min && width <= _grid_state.max) {
            if (this.noRepeat == 0) {
                this.noRepeat = 1;
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        }
        else {
            this.noRepeat = 0;
            this.viewContainer.clear();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], ShowItSizes.prototype, "showItSizes", null);
    ShowItSizes = __decorate([
        core_1.Directive({
            selector: '[showItSizes]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], ShowItSizes);
    return ShowItSizes;
}());
exports.ShowItSizes = ShowItSizes;
/* hide */
var HideItSizes = (function () {
    function HideItSizes(templateRef, viewContainer, _responsiveState) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this._responsiveState = _responsiveState;
        this.noRepeat = 0;
        this.callInit = 0;
    }
    Object.defineProperty(HideItSizes.prototype, "hideItSizes", {
        set: function (_grid_state) {
            var _this = this;
            if (this.callInit == 0) {
                this.init(_grid_state);
                this.callInit = 1;
            }
            this._responsiveState.anchoObservar.subscribe(function (size) {
                if (size >= _grid_state.min && size <= _grid_state.max) {
                    _this.noRepeat = 0;
                    _this.viewContainer.clear();
                }
                else {
                    if (_this.noRepeat == 0) {
                        _this.noRepeat = 1;
                        _this.viewContainer.createEmbeddedView(_this.templateRef);
                    }
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    HideItSizes.prototype.init = function (_grid_state) {
        var width = this._responsiveState.getWidth();
        if (width >= _grid_state.min && width <= _grid_state.max) {
            this.noRepeat = 0;
            this.viewContainer.clear();
        }
        else {
            if (this.noRepeat == 0) {
                this.noRepeat = 1;
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], HideItSizes.prototype, "hideItSizes", null);
    HideItSizes = __decorate([
        core_1.Directive({
            selector: '[hideItSizes]',
            providers: [ResponsiveState]
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef, ResponsiveState])
    ], HideItSizes);
    return HideItSizes;
}());
exports.HideItSizes = HideItSizes;
//# sourceMappingURL=sizes.js.map