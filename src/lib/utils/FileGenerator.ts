import { stringify } from 'yaml';
import * as fs from 'fs-extra';

export class FileGenerator {

    public templateName: string;
    public pathToSavedFile: string;

    constructor(templateName: string, pathToSavedFile: string){
        this.pathToSavedFile = pathToSavedFile;
        this.templateName = templateName;
    }

    public async generateYaml(data: {[key: string]: string}): Promise<void> {
        const yaml = stringify(data);
        await fs.writeFile(this.pathToSavedFile, yaml);
    }
}
