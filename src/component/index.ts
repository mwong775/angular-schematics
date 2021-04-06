import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';

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

    const ComponentFile = `import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ${camelName}Animations } from './${name}.animations';

/** test */
@Component({
  selector: 'app-${name}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ${camelName}Animations,
})
export class ${camelName}Component implements OnInit {

  // --------------- INPUTS AND OUTPUTS ---------


  // --------------- LOCAL UI STATE ----------------------


    constructor() { }

    ngOnInit() {
    }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------


  // --------------- OTHER -------------------------------

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
    
    let filePath = `./${module}/${module}.module.ts`;
    // insert a new change
    let text = tree.read(filePath); // reads the file from the tree
    if (!text) throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist

    let sourceText = text.toString('utf-8');
    let label = '// Components';
    let index = sourceText.indexOf(label) + label.length;
    // declares import
    const insertChange = new InsertChange(filePath, index, `\nimport { ${camelName}Component } from './${container}/${name}/${name}.component';`);
    let secondHalf = sourceText.slice(index);
    index = index + secondHalf.indexOf(label) + label.length;
    // adds import to list
    const insertChange2 = new InsertChange(filePath, index, `\n\t\t${camelName}Component,`);
    const exportRecorder = tree.beginUpdate(filePath);
    exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
    exportRecorder.insertLeft(insertChange2.pos, insertChange2.toAdd);
    tree.commitUpdate(exportRecorder);


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
