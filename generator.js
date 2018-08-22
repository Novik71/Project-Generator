const fs = require('fs');
const inquirer = require('inquirer');
const userRootDir = process.cwd();
const { exec, spawn } = require('child_process');
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
                                            fs.readFile(sourceFilePathDeep, 'utf8', (err, deepFile) => {
                                                const writePathDeep = `${destinationPath}/${item}/${deepItem}`;
                                                fs.writeFile(writePathDeep, `${deepFile}`, 'utf8', (err, file) => {
                                                    console.log('Project folder created');
                                                    console.log('Installing npm modules...');
                                                    exec('npm install', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                        console.log('npm package successfully installed');
                                                        console.log('Installing test suite...')
                                                        exec('npm install chai', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                            exec('npm install mocha', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                                console.log('Test suite successfully installed'); 
                                                                inquirer.prompt({
                                                                    name : 'createGit',
                                                                    message : 'Do you want to create a git repo?',
                                                                    type : 'confirm'                                                                                                                                    
                                                                    }).then(answers => {
                                                                        if (answers.createGit === true) {
                                                                            exec('git init ; git add ./ ; git commit -m "first commit"', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout,stderr) => {
                                                                                console.log('Git repo created, with initial commit');
                                                                                exec('code ./index.js', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                                                    console.log('Project Setup Complete!');
                                                                                });
                                                                            })
                                                                        } else {
                                                                            exec('code .', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                                                console.log('Project Setup Complete!');
                                                                        });
                                                                    }
                                                                });                                                             
                                                            });
                                                        });
                                                    });
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




