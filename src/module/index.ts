import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

import { InsertChange } from '@schematics/angular/utility/change';
import { CamelCaseFormatter } from '../shared/camelcase-formatter';

const fs = require('fs');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function module(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularConfig = 'angular.json';
	
    // Let's make sure we're in an angular workspace
    if (!tree.exists(angularConfig))
        throw new SchematicsException('???This is not an Angular worksapce! Try again in an Angular project.');
        
    const { name } = _options;
    let camelName = CamelCaseFormatter(name, false);
    let lowerCamelName = CamelCaseFormatter(name, true);
 
    const ModuleRoutingFile = `import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Containers

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ${camelName}RoutingModule { }
`;

    const ModuleSpecFile = `import { ${camelName}Module } from './${name}.module';
    
describe('${camelName}Module', () => {
    let ${lowerCamelName}Module: ${camelName}Module;

beforeEach(() => {
    ${lowerCamelName}Module = new ${camelName}Module();
});

it('should create an instance', () => {
    expect(${lowerCamelName}Module).toBeTruthy();
});
});
`;

    const ModuleFile =`import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { ${camelName}RoutingModule } from './${name}-routing.module';

// Containers

// Components

/** undefined */
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ${camelName}RoutingModule,
        EffectsModule.forFeature([
        ]),
    ],
    declarations: [
        // Containers
        // Components
    ],
})
export class ${camelName}Module { }`;

    const filePath = 'src/app/app.module.ts';
    // insert a new change
    let text = tree.read(filePath); // reads the file from the tree
    if (!text) throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist

    let sourceText = text.toString('utf-8');
    let label = '// Feature Modules';
    let index = sourceText.indexOf(label) + label.length;
    // declares import
    const insertChange = new InsertChange(filePath, index, `\nimport { ${camelName}Module } from './${name}/${name}.module';`);
    let secondHalf = sourceText.slice(index);
    index = index + secondHalf.indexOf(label) + label.length;
    // adds import to list
    const insertChange2 = new InsertChange(filePath, index, `\n\t\t${camelName}Module,`);
    const exportRecorder = tree.beginUpdate(filePath);
    exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
    exportRecorder.insertLeft(insertChange2.pos, insertChange2.toAdd);
    tree.commitUpdate(exportRecorder);
    
    // create directory before adding files
    const dir = `./src/app/${name}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    tree.create(`${dir}/${name}-routing.module.ts`, ModuleRoutingFile);
    tree.create(`${dir}/${name}.module.spec.ts`, ModuleSpecFile);
    tree.create(`${dir}/${name}.module.ts`, ModuleFile);
    return tree;
    };
}
