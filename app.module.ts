import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Sandbox
import { SandboxRoutingModule } from './_sandbox-routing.module';

// General Modules
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DataAsComponentsModule } from './data-as-components/data-as-components.module';

// Feature Modules
import { TestModuleModule } from './test-module/test-module.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AdminModule } from './admin/admin.module';
import { RoleModule } from './role/role.module';
import { MainModule } from './main/main.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CoreModule,
    SandboxRoutingModule,
    // Shared Modules
    SharedModule,
    DataAsComponentsModule,
    // Feature Modules
		TestModuleModule,
    OnboardingModule,
    AdminModule,
    RoleModule,
    MainModule,
    // Routing Module
    AppRoutingModule,
    // Animation Module
    BrowserAnimationsModule,
  ],
  exports: [ ],
  providers: [ ],
  bootstrap: [AppComponent],
})
export class AppModule { }
