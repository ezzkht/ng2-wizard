import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as _ from 'underscore';

import { WizardStepComponent, WizardStepState } from './wizard-step.component';

@Component({
    moduleId: module.id,
    selector: 'wizard-step-tab',
    templateUrl: 'wizard-step-tab.component.html'
})
export class WizardStepTabComponent {

    @Input() step: WizardStepComponent;
    @Input() showLabels: boolean = true;
    @Output() stepClicked: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
    
    private stepStates: any = WizardStepState;

    constructor() {
    }

    private onStepClicked() {
        this.stepClicked.emit(this.step);
    }
}
