import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

import { InsertChange } from '@schematics/angular/utility/change';

const fs = require('fs');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function container(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { name, module } = _options;
    let camelName = name;
    // e.g. list-style-image to ListStyleImage
    if(name.indexOf('-') != -1) {
        const names = name.split('-');
        for(var i = 0; i < names.length ; i++){
            names[i] = names[i].charAt(0).toUpperCase() + names[i].substr(1);
        }  
        camelName = names.join("");
    }

    const ActionsFile = `import { Action } from '@ngrx/store';

export enum ${camelName}ActionTypes {
  LOAD_DATA = '[${camelName}] load data',
  CLEANUP = '[${camelName}] cleanup',
}

/** Action for loading required DB data. */
export class LoadData implements Action {
  readonly type = ${camelName}ActionTypes.LOAD_DATA;

  constructor(public payload: {
    containerId: string,
  }) { }
}

/** Action for cleaning up loading subscriptions. */
export class Cleanup implements Action {
  readonly type = ${camelName}ActionTypes.CLEANUP;
  constructor(public payload: {
    containerId: string,
  }) { }
}

export type ${camelName}Actions =
  LoadData |
  Cleanup;
`;

    const EffectsFile = `import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';

import { of, Observable } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { FirebaseService } from '../../../core/firebase/firebase.service';
import { EffectsHelpers } from '../../../core/store/effects.helpers';
import { ${camelName}State } from './${name}.state';

import { ActionFlow, RouterNavigate, LoadAction, Unsubscribe } from '../../../core/store/app.actions';
import { ${camelName}ActionTypes, Cleanup, LoadData } from './${name}.actions';

@Injectable()
export class ${camelName}Effects {

  /** Load data from Firebase. */
  loadData$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadData>(${camelName}ActionTypes.LOAD_DATA),
      mergeMap((action: LoadData) => {

        const loadId = action.payload.containerId;

        return [
        ];
      }),
    ),
  );

  /** Unsubscribe connections from Firebase. */
  cleanup$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Cleanup>(${camelName}ActionTypes.CLEANUP),
      map((action: Cleanup) => new Unsubscribe(action.payload.containerId)),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private state: ${camelName}State,
    private db: FirebaseService,
    private eh: EffectsHelpers,
  ) {}
}
`;

    const SelectorsFile = `import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import { bufferTime, distinctUntilChanged, shareReplay, mergeMap, filter, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ${camelName}Selectors {

  constructor(
    private slRx: EntitySelectorService,
  ) { }

  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
`;

    const StateFile = `import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ${camelName}State {

  // --------------- LOCAL UI STATE ----------------------


  constructor(
  ) { }
}
`;

    const AnimationsFile = `import { trigger, group, query, animateChild, state, style, animate, transition } from '@angular/animations';

export const ${camelName}Animations = [
];
`;

    const HTMLFile = `<div class="${name}-container">
  ${name} works!
</div>`;

    const CSSFile = `.${name}-container {
}`;

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

    const ModuleRoutingFile = `${module}-routing.module.ts`;
    const ModuleFile = `${module}.module.ts`;

    let filePath = `./src/app/${module}/${ModuleRoutingFile}`;
    // insert a new change
    let text = tree.read(filePath); // reads the file from the tree
    if (!text) throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist
    
    let sourceText = text.toString('utf-8');
    let label = '// Containers';
    let index = sourceText.indexOf(label) + label.length;
    // declares import
    const insertChange = new InsertChange(filePath, index, `\nimport { ${camelName}Component } from './${name}/${name}.component';`);
    label = 'const routes: Routes = [';
    index = sourceText.indexOf(label) + label.length;
    // adds container path to list of routes 
    const insertChange2 = new InsertChange(filePath, index, `\n\t{ path: '${name}', component: ${camelName}Component }`);
    const exportRecorder = tree.beginUpdate(filePath);
    exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
    exportRecorder.insertLeft(insertChange2.pos, insertChange2.toAdd);
    tree.commitUpdate(exportRecorder);

    filePath = `./src/app/${module}/${ModuleFile}`;
    // insert a new change
    text = tree.read(filePath); // reads the file from the tree
    if (!text) throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist
    
    sourceText = text.toString('utf-8');
    label = '// Containers';
    index = sourceText.indexOf(label) + label.length;
    // declares imports
    const insertChange3 = new InsertChange(filePath, index, `\nimport { ${camelName}Component } from './${name}/${name}.component';\nimport { ${camelName}Effects } from './${name}/+state/${name}.effects';`);
    label = 'EffectsModule.forFeature([';
    index = sourceText.indexOf(label) + label.length;
    const insertChange4 = new InsertChange(filePath, index, `\n\t\t\t${camelName}Effects,`);
    label = '// Containers';
    let secondHalf = sourceText.slice(index);
    index = index + secondHalf.indexOf(label) + label.length;
    const insertChange5 = new InsertChange(filePath, index, `\n\t\t${camelName}Component,`);
    const exportRecorder2 = tree.beginUpdate(filePath);
    exportRecorder2.insertLeft(insertChange3.pos, insertChange3.toAdd);
    exportRecorder2.insertLeft(insertChange4.pos, insertChange4.toAdd);
    exportRecorder2.insertLeft(insertChange5.pos, insertChange5.toAdd);
    tree.commitUpdate(exportRecorder2);

    // create directories before adding files
    const dir = `./src/app/${module}/${name}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const statePath = `${dir}/+state`;
    if (!fs.existsSync(statePath)){
      fs.mkdirSync(statePath);
  }

    tree.create(`${statePath}/${name}.actions.ts`, ActionsFile);
    tree.create(`${statePath}/${name}.effects.ts`, EffectsFile);
    tree.create(`${statePath}/${name}.model.ts`, '');
    tree.create(`${statePath}/${name}.selectors.ts`, SelectorsFile);
    tree.create(`${statePath}/${name}.state.ts`, StateFile);
    tree.create(`${dir}/${name}.animations.ts`, AnimationsFile);
    tree.create(`${dir}/${name}.component.html`, HTMLFile);
    tree.create(`${dir}/${name}.component.scss`, CSSFile);
    tree.create(`${dir}/${name}.component.spec.ts`, SpecFile);
    tree.create(`${dir}/${name}.component.ts`, ComponentFile);
    return tree;
  };
}
