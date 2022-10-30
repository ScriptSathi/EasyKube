import { stringify } from 'yaml';
import * as fs from 'fs-extra';

export class FileGenerator {

    public templateName: string;
    public directoryWhereToSavedFile: string;
    public filePath: string;

    constructor(templateName: string, pathToSavedFile: string){
        this.directoryWhereToSavedFile = pathToSavedFile;
        this.templateName = templateName;
    }

    public async generateYaml(data: {[key: string]: string}): Promise<void> {
        const yaml = stringify(data);
        if (! fs.existsSync(this.directoryWhereToSavedFile)){
            await fs.ensureDir(this.directoryWhereToSavedFile);
        }
        this.filePath = `${this.directoryWhereToSavedFile}/${this.templateName}.yaml`;
        await fs.writeFile(this.filePath, yaml);
    }
}
