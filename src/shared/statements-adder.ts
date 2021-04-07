import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';

export function AddStatements(filePath: string, labels: string[], statements: string[], tree: Tree) {
    let text = tree.read(filePath); // reads the file from the tree
    if (!text) {
      throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist
    }
    let sourceText = text.toString('utf-8');
    let index = 0;
    const exportRecorder = tree.beginUpdate(filePath);
    for (let i = 0; i < labels.length; i++) {
      if (i)
        sourceText = sourceText.slice(index);
      index = index + sourceText.indexOf(labels[i]) + labels[i].length;
      // declares import
      const insertChange = new InsertChange(filePath, index, `\n${statements[i]}`);
      exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
    }
    tree.commitUpdate(exportRecorder); 
  
  }