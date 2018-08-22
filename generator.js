const fs = require('fs');
const inquirer = require('inquirer');
const userRootDir = process.cwd();
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

fs.readdir('./templates', 'utf8', (err, data) => { 
    inquirer.prompt({
        name: 'project-choice',
        type: 'list',
        message: 'Choose a project template',
        choices: data
    })
        .then(answers => {
            const projectChoice = answers['project-choice'];
            const templatePath = `./templates/${projectChoice}`;
            inquirer.prompt({
                name: 'project-name',
                type: 'input',
                message: 'Project name:'
            }).then(answers => {
                const projectName = answers['project-name'];
                const destinationPath = `${userRootDir}/${projectName}`
                fs.mkdir(destinationPath, (err, folder) => {
                    fs.readdir(templatePath, (err, data) => {
                        data.forEach(item => {
                            const sourceFilePath = `${templatePath}/${item}`;
                            fs.stat(sourceFilePath, (err, data) => {
                                if (data.isFile()) {
                                    fs.readFile(sourceFilePath, 'utf8', (err, file) => {
                                        const writePath = `${destinationPath}/${item}`;
                                        fs.writeFile(writePath, file, 'utf8', (err, file) => {
                                            return file;
                                        });                                
                                    });
                                } else if (data.isDirectory()) {
                                  fs.mkdir(`${destinationPath}/${item}`, (err, dir) => {
                                    fs.readdir(`${templatePath}/${item}`, (err, deepContents) => {
                                        deepContents.forEach(deepItem => {
                                            const sourceFilePathDeep = `${templatePath}/${deepItem}`;
                                            console.log(sourceFilePathDeep);
                                            fs.readFile(sourceFilePathDeep, 'utf8', (err, file) => {
                                                const writePath = `${destinationPath}/${deepItem}`;
                                                fs.writeFile(writePath, file, 'utf8', (err, file) => {
                                                    return file;
                                                });                                
                                            });                                      
                                        });
                                    });
                                  });
                                };
                            });                                       
                        });
                    });
                });
            });
        });
    })




