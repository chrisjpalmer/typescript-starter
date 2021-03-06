import * as fs from 'fs';
import * as path from 'path';
import { PropertyDeclaration, ObjectLiteralExpression } from 'ts-simple-ast';
import { replaceAll } from './string.util';
const snake = require('to-snake-case');
const shell = require('shelljs');

export class Name {
  constructor(private name:string) {

  }

  upper() {
    return this.name;
  }

  lower() {
    return toLowerTitleCase(this.name);
  }

  snake() {
    return snakeCase(this.name);
  }

  dot() {
    return dotCase(this.name);
  }
}

export class Route {
  private authenticated:boolean;
  private value:string;
  constructor(route:string) {
    //Replace short prefix
    route = route.replace('@/', 'authenticated/');

    if(route.indexOf('authenticated/') !== -1) {
      this.value = route.split('authenticated/')[1];
      this.authenticated = true;
    } else {
      this.value = route;
      this.authenticated = false;
    }
  }

  /**
   * May be prefixed by authenticated/
   */
  long() {
      if(this.authenticated) {
          return `authenticated/${this.value}`
      }

      return this.value;
  }

  /**
   * Will not be prefixed by authtenicated/
   */
  short() {
      return this.value;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export var templatePath: string = 'up/template';
export var appRoutesPath: string = 'src/app/routes';
var entityPath: string = 'src/database/app';

export function setEntityPath(path: string) {
  entityPath = path;
}

export function getEntityPath() {
  return entityPath;
}

export function snakeCase(input: string): string {
  return snake(input);
}

export function dotCase(input: string): string {
  return replaceAll(snakeCase(input), '_', '.');
}

export function toUpperTitleCase(str: string) {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1);
  });
}

export function toLowerTitleCase(str: string) {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toLowerCase() + txt.substr(1);
  });
}

export function toPlural(str: string) {
  return str + '(s)';
}

export function readFilePromise(fileLocation: string): Promise<string> {
  let fileReadPromise = new Promise<string>((resolve, reject) => {
    fs.readFile(fileLocation, 'utf8', (err, data) => {
      if (err != null) {
        reject(err);
      }

      resolve(data);
    });
  });
  return fileReadPromise;
}
export function makeDirectoryPromise(directoryLocation: string): Promise<void> {
  let makeDirectoryPromise = new Promise<void>((resolve, reject) => {
    fs.mkdir(directoryLocation, err => {
      if (err != null) {
        reject(err);
      }

      resolve();
    });
  });
  return makeDirectoryPromise;
}

export function makeDirectoryRecursive(directoryLocation) {
  shell.mkdir('-p', directoryLocation);
}

export function writeFilePromise(
  fileLocation: string,
  contents: string,
): Promise<void> {
  let writeFilePromise = new Promise<void>((resolve, reject) => {
    fs.writeFile(fileLocation, contents, err => {
      if (err != null) {
        reject(err);
      }

      resolve();
    });
  });
  return writeFilePromise;
}

export function toMap(object: any): Map<string, string> {
  let map = new Map<string, string>();
  Object.keys(object).forEach(key => {
    map.set(key, object[key]);
  });
  return map;
}

export function replaceByObject(input: string, object: any): string {
  let toReplace: Map<string, string> = toMap(object);
  let output = input;
  toReplace.forEach((value, key) => {
    output = replaceAll(output, key, value);
  });

  return output;
}

export function RunFormatterFile(file: string) {
  RunFormatter(`${file}`);
}

export function RunFormatterDir(dir: string) {
  RunFormatter(`${dir}/**/*.ts`);
}

function RunFormatter(filter: string) {
  shell.exec(`node node_modules/prettier/bin-prettier.js --write ${filter}`, {
    async: false,
  });
}
