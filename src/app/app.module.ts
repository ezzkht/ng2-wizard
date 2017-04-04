import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { WizardComponent }  from './wizard.component';
import { WizardStepComponent }  from './wizard-step.component';
import { WizardStepTabComponent }  from './wizard-step-tab.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, WizardComponent, WizardStepComponent, WizardStepTabComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
