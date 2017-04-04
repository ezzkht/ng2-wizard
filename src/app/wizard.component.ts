import {
    Component, OnInit, Input, Output, EventEmitter, ElementRef, ContentChildren, QueryList, AfterContentInit
} from '@angular/core';
import * as _ from 'underscore';

import { WizardStepComponent, WizardStepState } from './wizard-step.component';

export interface WizardConfig {
    showStepsBar: boolean;
    showMiniControl: boolean;
    showActionBar: boolean;
    showStepLabels: boolean;
    editMode: boolean;
    vertical: boolean;
    nextLabel: string;
    previousLabel: string;
    finishLabel:string;
}

@Component({
    moduleId: module.id,
    selector: 'wizard',
    templateUrl: 'wizard.component.html'
})
export class WizardComponent implements OnInit, AfterContentInit {
    @Input() config: WizardConfig;
    @Output() finish: EventEmitter<any> = new EventEmitter<any>();
    @Output() stepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

    @ContentChildren(WizardStepComponent)
    private stepsChildren: QueryList<WizardStepComponent>;

    private defaultConfig: WizardConfig = {
        showStepsBar: true,
        showMiniControl: true,
        showActionBar : true,
        showStepLabels : true,
        editMode : false,
        vertical : false,
        nextLabel: 'Next',
        previousLabel: 'Prev',
        finishLabel: 'Finish'
    };

    private stepStates:any = WizardStepState;
    private steps: WizardStepComponent[] = [];
    private currentStepIndex: number = -1;
    private currentStep: WizardStepComponent = null;

    constructor() {
    }

    ngOnInit() {
        this.config = _.extend(this.defaultConfig, this.config);
    }

    ngAfterContentInit() {
        this.steps = this.stepsChildren.toArray();

        if (this.steps.length !== 0) {
            let index: number = 0;

            this.steps.forEach(step => {
                this.setupStep(step, index++);
            });

            // Preselect the first step
            this.currentStep = this.steps[0];
            this.steps[0].isCurrent = true;
            this.currentStepIndex = this.steps[0].index;
            this.setStepState(this.steps[0], WizardStepState.Dirty);
        }
    }

    private setupStep(step: WizardStepComponent, index: number) {
        step.index = index;
        this.setStepState(step, WizardStepState.Pristine);
    }

    private setStepState(step: WizardStepComponent, newState: WizardStepState) {
        step.state = newState;
        //step.class = (step.state === WizardStepState.Pristine) ? "disabled" : (step.state === WizardStepState.Completed) ? "done" : "selected";

        //if (step.enter && typeof step.enter === 'function')
        //    step.enter({ step: step });
    }

    private getStepsCount() {
        return this.steps.length;
    }

    private isAllValid() {
        return this.steps.length;
    }

    private jumpToStep(step: WizardStepComponent) {
        //step.element.addClass("animated");
        //step.element.addClass("slideInUp");
        //$animate.enter(step.element, this.element);
        //$animate.leave(this.currentStep.element, this.element);

        if (this.currentStep) {
            this.setStepState(this.currentStep, WizardStepState.Completed);
            this.currentStep.isCurrent = false;
            this.currentStep.leave.emit(this.currentStep);
        }

        // If first time entering this tep, then fire the event
        if (step.state == WizardStepState.Pristine)
            step.firstTimeEnter.emit(step);

        this.currentStep = step;
        this.currentStep.isCurrent = true;
        this.currentStepIndex = this.steps.indexOf(step);
        this.setStepState(this.currentStep, WizardStepState.Dirty);
        this.currentStep.enter.emit(this.currentStep);
        this.stepChanged.emit(this.currentStep);
    }

    private canJumpToStep(index: number, manualJump: boolean = false) {
        // In edit mode, user can jump to any step
        if (!this.config.editMode) {
            // Manual jumping to steps thru the steps bar is restricted to completed steps only
            if (manualJump && this.steps[index].state === WizardStepState.Pristine)
                return false;

            for (let i = 0; i < index; i++) {
                if (this.steps[i].state === WizardStepState.Pristine)
                    return false;
            }
        }

        return true;
    }

    private isFirstStep() {
        return this.currentStepIndex === 0;
    }

    private isLastStep() {
        return this.currentStepIndex === this.steps.length - 1;
    }


    private canEnterStep(step: WizardStepComponent) {
        return true;
        /*// If no validation function is provided, allow the user to enter the step
        if (step.enter === undefined)
            return true;

        // If a boolean value is provided instead of a function, return that value
        //if (typeof step.enter === 'boolean')
        //    return step.enter;

        // Check to see if the provided function is a promise which needs to be returned
        let enter: any = step.enter(step);

        if (enter !== undefined && typeof enter.then === 'function') {
            return new Promise((resolve, reject) => {
                enter.then((res:any) => resolve(res))
            });
            
            //let defer = $q.defer();
            //enter.then(function (response) {
            //    defer.resolve(response);
            //});
            //return defer.promise;
        } else {
            return enter === true;
    }*/
    }

    private canLeaveStep(step: WizardStepComponent) {
        step.validate.emit(step);
        
        return this.config.editMode || step.isValid;

        /*// If no validation function is provided, allow the user to leave the step
        if (step.leave === undefined)
            return true;

        // If a boolean value is provided instead of a function, return that value
        if (typeof step.leave === 'boolean')
            return step.leave;

        // Check to see if the provided function is a promise which needs to be returned
        let leave = step.leave(step);
        if (leave !== undefined && typeof leave.then === 'function') {
            return new Promise((resolve, reject) => {
                leave.then((res:any) => resolve(res))
            });

            //let defer = $q.defer();
            //leave.then(function (response) {
            //    defer.resolve(response);
            //});
            //return defer.promise;
        } else {
            return leave === true;
    }*/
    }

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    private onStepClicked(step: WizardStepComponent) {
        // Do nothing if user clicked the current step
        if (step !== this.currentStep && this.canJumpToStep(step.index, true)) {
            // If user is going back, allow that action without checking
            if (step.index < this.currentStepIndex) {
                if (this.canEnterStep(step))
                    this.jumpToStep(step);
            } else {
                if (this.canLeaveStep(this.currentStep) && this.canEnterStep(step))
                    this.jumpToStep(step);
            }
        }
    }

    private onNext() {
        // Check if it's not the last step
        if (!this.isLastStep()) {
            let targetStep = this.steps[this.currentStepIndex + 1];
            if (this.canEnterStep(targetStep) && this.canLeaveStep(this.currentStep)) {
                this.jumpToStep(targetStep);
            }
        }
    }

    private onPrev() {
        // Check if it's not the first step
        if (!this.isFirstStep()) {
            let targetStep = this.steps[this.currentStepIndex - 1];
            if (this.canEnterStep(targetStep)) {
                this.jumpToStep(targetStep);
            }
        }
    }

    private onFinish() {
        if (this.isLastStep() && this.canLeaveStep(this.currentStep)) {
            this.finish.emit();
        }
    }
}

