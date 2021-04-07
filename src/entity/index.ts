import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { CamelCaseFormatter } from '../shared/camelcase-formatter';
import { AddStatements } from '../shared/statements-adder';

const fs = require('fs');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function entity(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { name } = _options;
    const camelName = CamelCaseFormatter(name, false);
    const lowerCamelName = CamelCaseFormatter(name, true);

    const ActionsFile = `import { Action } from '@ngrx/store';
import { LoadAction } from '../app.actions';
import { ${camelName} } from './${camelName}.model';

export enum ${camelName}ActionTypes {
  LOAD = '[${camelName}] load ${lowerCamelName}',
  LOAD_SUCCESS = '[${camelName}] load ${lowerCamelName} success',
  LOAD_FAIL = '[${camelName}] load ${lowerCamelName} fail',
  ADD = '[${camelName}] add ${lowerCamelName}',
  ADD_SUCCESS = '[${camelName}] add ${lowerCamelName} success',
  ADD_FAIL = '[${camelName}] add ${lowerCamelName} fail',
  UPDATE = '[${camelName}] update ${lowerCamelName}',
  UPDATE_SUCCESS = '[${camelName}] update ${lowerCamelName} success',
  UPDATE_FAIL = '[${camelName}] update ${lowerCamelName} fail',
  UPSERT = '[${camelName}] upsert ${lowerCamelName}',
  UPSERT_SUCCESS = '[${camelName}] upsert ${lowerCamelName} success',
  UPSERT_FAIL = '[${camelName}] upsert ${lowerCamelName} fail',
  REMOVE = '[${camelName}] remove ${lowerCamelName}',
  REMOVE_SUCCESS = '[${camelName}] remove ${lowerCamelName} success',
  REMOVE_FAIL = '[${camelName}] remove ${lowerCamelName} fail',
  LOADED = '[${camelName}] loaded',
  ADDED = '[${camelName}] added',
  MODIFIED = '[${camelName}] modified',
  REMOVED  = '[${camelName}] removed',
}

// See Firebase Docs for current constraints on valid queries
export class Load${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.LOAD;
  constructor(
    // property, comparator, value
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (${lowerCamelName}: ${camelName}) => LoadAction[],
  ) {}
}

export class Load${camelName}Success implements Action {
  readonly type = ${camelName}ActionTypes.LOAD_SUCCESS;
  constructor(
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (${lowerCamelName}: ${camelName}) => LoadAction[],
  ) {}
}

export class Load${camelName}Fail implements Action {
  readonly type = ${camelName}ActionTypes.LOAD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class Add${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.ADD;
  constructor(
    public ${lowerCamelName}: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Add${camelName}Success implements Action {
  readonly type = ${camelName}ActionTypes.ADD_SUCCESS;
  constructor(
    public ${lowerCamelName}: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Add${camelName}Fail implements Action {
  readonly type = ${camelName}ActionTypes.ADD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class Update${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.UPDATE;
  constructor(
    public __id: string,
    public changes: Partial<${camelName}>,
    public correlationId?: string,
  ) { }
}

export class Update${camelName}Success implements Action {
  readonly type = ${camelName}ActionTypes.UPDATE_SUCCESS;
  constructor(
    public __id: string,
    public changes: Partial<${camelName}>,
    public correlationId?: string,
  ) {}
}

export class Update${camelName}Fail implements Action {
  readonly type = ${camelName}ActionTypes.UPDATE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class Upsert${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.UPSERT;
  constructor(
    public ${lowerCamelName}: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Upsert${camelName}Success implements Action {
  readonly type = ${camelName}ActionTypes.UPSERT_SUCCESS;
  constructor(
    public ${lowerCamelName}: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Upsert${camelName}Fail implements Action {
  readonly type = ${camelName}ActionTypes.UPSERT_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class Remove${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.REMOVE;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) { }
}

export class Remove${camelName}Success implements Action {
  readonly type = ${camelName}ActionTypes.REMOVE_SUCCESS;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) {}
}

export class Remove${camelName}Fail implements Action {
  readonly type = ${camelName}ActionTypes.REMOVE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class Loaded${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.LOADED;
  constructor(
    public payload: ${camelName}[],
    public correlationId?: string,
  ) {}
}

export class Added${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.ADDED;
  constructor(
    public payload: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Modified${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.MODIFIED;
  constructor(
    public payload: ${camelName},
    public correlationId?: string,
  ) {}
}

export class Removed${camelName} implements Action {
  readonly type = ${camelName}ActionTypes.REMOVED;
  constructor(
    public payload: ${camelName},
    public correlationId?: string,
  ) {}
}

export type ${camelName}Actions =
  Load${camelName} |
  Load${camelName}Success |
  Load${camelName}Fail |
  Add${camelName} |
  Add${camelName}Success |
  Add${camelName}Fail |
  Update${camelName} |
  Update${camelName}Success |
  Update${camelName}Fail |
  Upsert${camelName} |
  Upsert${camelName}Success |
  Upsert${camelName}Fail |
  Remove${camelName} |
  Remove${camelName}Success |
  Remove${camelName}Fail |
  Loaded${camelName} |
  Added${camelName} |
  Modified${camelName} |
  Removed${camelName};`;

    const EffectsFile = `import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { ${camelName} } from './${name}.model';
import { ${camelName}ActionTypes, ${camelName}Actions,
  Load${camelName}, Load${camelName}Success, Load${camelName}Fail,
  Add${camelName}, Add${camelName}Success, Add${camelName}Fail,
  Update${camelName}, Update${camelName}Success, Update${camelName}Fail,
  Upsert${camelName}, Upsert${camelName}Success, Upsert${camelName}Fail,
  Remove${camelName}, Remove${camelName}Success, Remove${camelName}Fail } from './${name}.actions';

@Injectable()
export class ${camelName}Effects {

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Load${camelName}>(${camelName}ActionTypes.LOAD),
      mergeMap((action: Load${camelName}) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new Load${camelName}Success(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new Load${camelName}Fail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Add${camelName}>(${camelName}ActionTypes.ADD),
      mergeMap((action: Add${camelName}) => {
        return this.db.addEntity('${lowerCamelName}s', action.${lowerCamelName}).pipe(
          mergeMap(() => merge(
            of(new Add${camelName}Success(action.${lowerCamelName}, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new Add${camelName}Fail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Update${camelName}>(${camelName}ActionTypes.UPDATE),
      mergeMap((action: Update${camelName}) => {
        return this.db.updateEntity('${lowerCamelName}s', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new Update${camelName}Success(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new Update${camelName}Fail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the upsert action to update database and initiate callbacks. */
  upsert$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Upsert${camelName}>(${camelName}ActionTypes.UPSERT),
      mergeMap((action: Upsert${camelName}) => {
        return this.db.upsertEntity('${lowerCamelName}s', action.${lowerCamelName}).pipe(
          mergeMap((results) => merge(
            of(new Upsert${camelName}Success(action.${lowerCamelName}, action.correlationId)),
            results.type === 'add' ? this.actionsOnAdd(new Add${camelName}(action.${lowerCamelName}, action.correlationId)) : this.actionsOnUpdate(new Update${camelName}(action.${lowerCamelName}.__id, action.${lowerCamelName}, action.correlationId)),
          )),
          catchError((error) => of(new Upsert${camelName}Fail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<Remove${camelName}>(${camelName}ActionTypes.REMOVE),
      mergeMap((action: Remove${camelName}) => {
        return this.db.removeEntity('${lowerCamelName}s', action.__id).pipe(
          mergeMap(() => merge(
            of(new Remove${camelName}Success(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new Remove${camelName}Fail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: Add${camelName}): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: Update${camelName}): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: Remove${camelName}): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}`;

    const ModelFile = `import { firestore } from 'firebase/app';

/** test */
export interface ${camelName} {
  __id: string;
  _createdAt?: firestore.Timestamp;
  _updatedAt?: firestore.Timestamp;
}`;

  const SpecFile = `import { reducer, initialState } from './${name}.reducer';

describe('${camelName} Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});`;

    const ReducerFile = `import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ${camelName} } from './${name}.model';
import { ${camelName}Actions, ${camelName}ActionTypes } from './${name}.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<${camelName}> {
  // additional entities state properties
}

export const adapter: EntityAdapter<${camelName}> = createEntityAdapter<${camelName}>({
  selectId: (${lowerCamelName}: ${camelName}) => ${lowerCamelName}.__id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state: State = initialState,
  action: ${camelName}Actions) {

  switch (action.type) {

    case ${camelName}ActionTypes.ADDED:
      return adapter.upsertOne(action.payload, state);

    case ${camelName}ActionTypes.LOADED:
      return adapter.upsertMany(action.payload, state);

    case ${camelName}ActionTypes.MODIFIED:
      return adapter.updateOne({
        id: action.payload.__id,
        changes: action.payload,
      }, state);

    case ${camelName}ActionTypes.REMOVED:
      return adapter.removeOne(action.payload.__id, state);

    default:
      return state;
  }
}

export const get${camelName}State = createFeatureSelector<State>('${lowerCamelName}');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(get${camelName}State);`;

    const ServiceFile = `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { ${camelName} } from './${name}.model';

@Injectable({
  providedIn: 'root',
})
export class ${camelName}Service {

  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a ${lowerCamelName} from the store. */
  public select${camelName} = <T extends ${camelName}>(
    id: string,
    correlationId: string,
    childrenFn?: (e: ${camelName}) => { [index: string]: Observable<any> },
  ): Observable<T> => {

    return this.cs.selectEntityObj<${camelName}, T>('${lowerCamelName}', id, correlationId, childrenFn);
  }

  /** Select ${lowerCamelName}s from the store. */
  public select${camelName}s = <T extends ${camelName}>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: ${camelName}) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {

    return this.cs.selectEntityList<${camelName}, T>('${lowerCamelName}', queryParams, correlationId, childrenFn);
  }

  /** Get a ${lowerCamelName} directly from the database. */
  public get${camelName} = <T extends ${camelName}>(
    id: string,
    childrenFn?: (e: ${camelName}) => { [index: string]: Observable<any> },
  ): Observable<T> => {

    return this.db.queryObjOnce<${camelName}, T>('${lowerCamelName}s', id, childrenFn);
  }

  /** Get ${lowerCamelName}s directly from the database. */
  public get${camelName}s = <T extends ${camelName}>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: ${camelName}) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {

    return this.db.queryListOnce<${camelName}, T>('${lowerCamelName}s', queryParams, queryOptions, childrenFn);
  }
}`;

    AddStatements('./src/app/core/core.module.ts', ['// Entity Effects'], [`import { ${camelName} } from ./store/${name}/${name}.effects;`], tree);
    AddStatements('/snackbar/snackbar.effects', ['// Entity Effects'], [`${camelName}Effects,`], tree);
    AddStatements('src/app/core/firebase/firebase.mock.service.ts', ['// Entity Models', 'this.mockDBChanges = {'], [`import { ${camelName} } from '../store/${name}/${name}.model';`, `\t\t\t${lowerCamelName}s: new BehaviorSubject<Array<{ type: string, result: ${camelName} }>>\n(this.mockDBService.getInitialDBStateChanges('${lowerCamelName}s')),`], tree);
    AddStatements('src/app/core/store/app.reducer.ts', ['// Entity Reducers'], [`import * as from${camelName} from './${name}/${name}.reducer';`], tree);


    // create directories before adding files
    const dir = `./src/app/core/store/${name}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    tree.create(`${dir}/${name}.actions.ts`, ActionsFile);
    tree.create(`${dir}/${name}.effects.ts`, EffectsFile);
    tree.create(`${dir}/${name}.model.ts`, ModelFile);
    tree.create(`${dir}/${name}.reducer.spec.ts`, SpecFile);
    tree.create(`${dir}/${name}.reducer.ts`, ReducerFile);
    tree.create(`${dir}/${name}.service.ts`, ServiceFile);
    return tree;
  };
}