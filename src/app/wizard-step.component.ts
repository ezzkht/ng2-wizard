import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as _ from 'underscore';

export enum WizardStepState {
    Disabled = -1,
    Hidden = 0,
    Pristine = 1,
    Dirty = 2,
    Completed = 3
}

@Component({
    moduleId: module.id,
    selector: 'wizard-step',
    templateUrl: 'wizard-step.component.html'
})
export class WizardStepComponent {
    @Input() title: string;
    @Input() description: string;
    @Input() isValid: boolean = true;
    @Output() enter: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
    @Output() leave: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
    @Output() firstTimeEnter: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
    @Output() validate: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

    public index: number = -1;
    public state: WizardStepState = WizardStepState.Pristine;
    public isCurrent: boolean = false;

    private stepStates:any = WizardStepState;

    constructor() {
    }
}
