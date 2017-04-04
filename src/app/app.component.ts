import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WizardConfig } from './wizard.component';
import { WizardStepComponent, WizardStepState } from './wizard-step.component';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    private wizardConfig: WizardConfig = <WizardConfig>{
        showActionBar: true,
        showStepLabels: true,
        showStepsBar: true,
        vertical: false,
        editMode: false
    }

    private model: any = {
        name: '',
        username: '',
        password: '',
        securityGroup: ''
    };

    constructor() {
    }

    onFinish() {
        alert("done :)");
    }

    onValidateUserDetails(step: WizardStepComponent, form: NgForm) {
        //debugger;
        form.form.updateValueAndValidity();
    }

    onRolesStepFirstTimeEnter(step: WizardStepComponent) {
        alert('Welcome to the ' + step.title + ' step.');
    }
}
