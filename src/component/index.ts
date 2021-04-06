import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

const fs = require('fs');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { name, module, container } = _options;

    let camelName = name;
    // e.g. list-style-image to ListStyleImage
    if(name.indexOf('-') != -1) {
        const names = name.split('-');
        for(var i = 0; i < names.length ; i++){
            names[i] = names[i].charAt(0).toUpperCase() + names[i].substr(1);
        }  
        camelName = names.join("");
    }

    const AnimationsFile = `import { trigger, group, query, animateChild, state, style, animate, transition } from '@angular/animations';
export const ${camelName}Animations = [
];
`;

    const CSSFile = `.${name}-container {
    // REMOVE WHEN FINISHING LAYOUT STYLES
    border: 1px solid black;
}`;

    const HTMLFile = `<div class="${name}-container">
${name} works!
</div>`;

    const ComponentFile = `import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ${camelName}Animations } from './${name}.animations';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { FirebaseService } from '../../core/firebase/firebase.service';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { withLatestFrom, take, takeUntil } from 'rxjs/operators';

import { ${camelName}State } from './+state/${name}.state';
import { ${camelName}Selectors } from './+state/${name}.selectors';

import { LoadData, Cleanup } from './+state/${name}.actions';
import { RouterNavigate } from '../../core/store/app.actions';

import { User } from '../../core/store/user/user.model';

/** test */
@Component({
  selector: 'app-${name}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ${camelName}Animations,
})
export class ${camelName}Component implements OnInit, OnDestroy {

  // --------------- ROUTE PARAMS & CURRENT USER ---------


  // --------------- LOCAL UI STATE ----------------------


  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  // --------------- DATA BINDING STREAMS ----------------


  // --------------- EVENT BINDING STREAMS ---------------


  // --------------- OTHER -------------------------------

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private state: ${camelName}State,
    private route: ActivatedRoute,
    private selectors: ${camelName}Selectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService,
  ) {
  }

  ngOnInit() {

    // --------------- EVENT HANDLING ----------------------


    // --------------- LOAD DATA ---------------------------

    // Once everything is set up, load the data for the role.
    this.store.dispatch( new LoadData({
      containerId: this.containerId,
    }) );
  }

  ngOnDestroy() {
    // Unsubscribe subscriptions.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Unsubscribe from firebase connection from load and free up memoized selector values.
    this.store.dispatch( new Cleanup({
      containerId: this.containerId,
    }) );
    this.selectors.cleanup(this.containerId);
  }
}
`;

    const SpecFile = `import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ${camelName}Component } from './${name}.component';

describe('${camelName}Component', () => {
  let component: ${camelName}Component;
  let fixture: ComponentFixture<${camelName}Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ${camelName}Component ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(${camelName}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;
    



    // create directories before adding files
    const dir = `./${module}/${container}/${name}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    tree.create(`${dir}/${name}.animations.ts`, AnimationsFile);
    tree.create(`${dir}/${name}.component.html`, HTMLFile);
    tree.create(`${dir}/${name}.component.scss`, CSSFile);
    tree.create(`${dir}/${name}.component.spec.ts`, SpecFile);
    tree.create(`${dir}/${name}.component.ts`, ComponentFile);
    
    return tree;
  };
}
