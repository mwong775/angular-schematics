# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

Used to generate modules, containers, components, and entities.

### Usage

1. Clone this repository.
2. Run `npm install -g @angular-devkit/schematics-cli` to install globally
3. Run `npm install` & `npm link`
4. Run `npm link angular-schematic` in project directory
5. Run `ng generate angular-schematic:<type>` to generate files (`type` = module, container, component, or entity)

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 