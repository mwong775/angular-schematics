import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';

export interface IHash {
  [details: string] : number;
}

export function AddStatements(filePath: string, labels: string[], statements: string[], tree: Tree) {
    let text = tree.read(filePath); // reads the file from the tree
    if (!text) {
      throw new SchematicsException(`${filePath} does not exist.`); // throw an error if the file doesn't exist
    }
    let sourceText = text.toString('utf-8');
    let index = 0;
    const exportRecorder = tree.beginUpdate(filePath);
    let labelMap : IHash = {};
    for (let i = 0; i < labels.length; i++) {
      // sourceText = sourceText.slice(index);
      if (labelMap[labels[i]] === undefined)
          labelMap[labels[i]] = 0;
      labelMap[labels[i]]++;
      let count = labelMap[labels[i]];
      index = getPosition(sourceText, labels[i], count) + labels[i].length;
      // declares import
      const insertChange = new InsertChange(filePath, index, `\n${statements[i]}`);
      exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
    }
    tree.commitUpdate(exportRecorder); 
  
  }

  function getPosition(string: string, subString: string, index: number) {
    return string.split(subString, index).join(subString).length;
  }