import Project, { ObjectLiteralExpression } from 'ts-simple-ast';
import { Name, Route } from './util/util';

export async function AddControllerToModule(
  name:Name,
  route:Route,
) {
  let project = new Project();
  let moduleFile = project.addExistingSourceFile(`src/app/app.module.ts`);
  moduleFile.addImportDeclaration({
    namedImports: [`${name.upper()}Controller`],
    moduleSpecifier: `./routes/${route.long()}/${name.dot()}.controller`,
  });

  let appModuleClass = moduleFile.getClassOrThrow('AppModule');
  let appModuleDecorator = appModuleClass.getDecoratorOrThrow('Module');
  let args = appModuleDecorator.getArguments();
  let moduleConfig = <ObjectLiteralExpression>args[0];

  addToControllersArray(moduleConfig, name, route);

  await project.save();
}

export function addToControllersArray(
  moduleConfig: ObjectLiteralExpression,
  name:Name,
  route:Route,
) {
  let controllersConfig = moduleConfig.getPropertyOrThrow('controllers');
  let originalStatement = controllersConfig.getText();
  let closingArrayBracket = originalStatement.indexOf(']');
  let topArrayExpression = originalStatement.substr(0, closingArrayBracket);
  let bottomArrayExpression = originalStatement.substr(
    closingArrayBracket,
    originalStatement.length - closingArrayBracket,
  );

  //Form the new statement
  let newStatement =
`${topArrayExpression}
\t\t// /${route.long()}
\t\t${name.upper()}Controller,
${bottomArrayExpression}`;
  controllersConfig.replaceWithText(newStatement);
}

export async function AddServiceToModule(
  name:Name,
) {
  let project = new Project();
  let moduleFile = project.addExistingSourceFile(`src/app/app.module.ts`);
  moduleFile.addImportDeclaration({
    namedImports: [`${name.upper()}Service`],
    moduleSpecifier: `./services/${name.dot()}.service`,
  });

  let appModuleClass = moduleFile.getClassOrThrow('AppModule');
  let appModuleDecorator = appModuleClass.getDecoratorOrThrow('Module');
  let args = appModuleDecorator.getArguments();
  let moduleConfig = <ObjectLiteralExpression>args[0];

  addToProvidersArray(moduleConfig, name);

  await project.save();
}

export function addToProvidersArray(
  moduleConfig: ObjectLiteralExpression,
  name: Name
) {
  let providersConfig = moduleConfig.getPropertyOrThrow('providers');
  let originalStatement = providersConfig.getText();
  let comma = '';

  if (originalStatement.indexOf('[]') === -1) {
    comma = ',';
  }

  let closingArrayBracket = originalStatement.indexOf(']');
  let topArrayExpression = originalStatement.substr(0, closingArrayBracket);
  let bottomArrayExpression = originalStatement.substr(
    closingArrayBracket,
    originalStatement.length - closingArrayBracket,
  );
  let newStatement =
    topArrayExpression +
    comma +
    `${name.upper()}Service.Service` +
    bottomArrayExpression;
  providersConfig.replaceWithText(newStatement);
}