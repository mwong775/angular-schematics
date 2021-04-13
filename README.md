# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

Used to generate modules, containers, components, and entities for Angular projects.

### Usage

1. Clone this repository.
2. Run `npm install -g @angular-devkit/schematics-cli` to install globally
3. Run `npm install`, `npm run build` & `npm link`
4. Run `npm link angular-schematic` in the Angular project directory
5. Run `ng generate angular-schematic:<schematic>` to generate files (`schematic` = module, container, component, or entity)

### Developing

1. Steps 1-2 above
2. Run `npm install`
3. Run `schematics .:<schematic> --dry-run=false` to test/debug generations (`--debug=false` also works, `schematic` = module, container, component, or entity)

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Important Notes

When generating a component: If the project has an import error for `waitForAsync` in `<component-name>.component.spec.ts`, update all instances to `async`.

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 
