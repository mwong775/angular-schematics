import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { CamelCaseFormatter } from '../shared/camelcase-formatter';
import { AddStatements } from '../shared/statements-adder';

const fs = require('fs');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { name, module, container } = _options;
    const camelName = CamelCaseFormatter(name, false);

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
    
    const filePath = `./src/app/${module}/${module}.module.ts`;
    const labels = ['// Components', '// Components'];
    const statements = [`import { ${camelName}Component } from './${container}/${name}/${name}.component';`, `    ${camelName}Component,`];
    AddStatements(filePath, labels, statements, tree);

    // create directories before adding files
    const dir = `./src/app/${module}/${container}/${name}`;
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
