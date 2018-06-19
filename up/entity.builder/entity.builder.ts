import { Params } from '../util/util.class';
import {
  templatePath,
  replaceByObject,
  readFilePromise,
  dotCase,
  writeFilePromise,
  toUpperTitleCase,
  getEntityPath,
  RunFormatterFile,
} from '../util/util';
import Project from 'ts-simple-ast';

export async function createEntity(params: Params) {
  const entityIndexPath = `src/database/index.ts`;

  let entityDot = dotCase(params.entityName);
  let entityUpper = toUpperTitleCase(params.entityName);

  //Create the entity class file and save it
  let entityTemplate = await readFilePromise(
    `${templatePath}/entity/entity.template.ts`,
  );
  let entity = replaceByObject(entityTemplate, {
    '${entity.upper}': entityUpper,
  });
  let entityFilepath = `${getEntityPath()}/${entityDot}.entity.ts`;
  await writeFilePromise(entityFilepath, entity);

  //Append the entity to the index.ts file
  let sourceFile = await readFilePromise(entityIndexPath);

  //Add code to export the entity
  sourceFile = sourceFile.replace(
    '/// < import entity >',
    `import { ${entityUpper} } from './app/${entityDot}.entity';\n/// < import entity >`,
  );
  sourceFile = sourceFile.replace(
    '/// < export entity >',
    `export * from './app/${entityDot}.entity';\n/// < export entity >`,
  );
  sourceFile = sourceFile.replace(
    '/// < export entity.token >',
    `export const ${entityUpper}Token = '${entityUpper}';\n/// < export entity.token >`,
  );
  sourceFile = sourceFile.replace(
    '/// < export entity.object >',
    `{ token: ${entityUpper}Token, type: ${entityUpper} },\n/// < export entity.object >`,
  );

  await writeFilePromise(entityIndexPath, sourceFile);
  RunFormatterFile(entityFilepath);
  RunFormatterFile(entityIndexPath);
}
