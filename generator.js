const fs = require('fs');
const inquirer = require('inquirer');
const userRootDir = process.cwd();
const progRootDir = '/home/turiya/Google Drive/Coding/Northcoders 12-Week Course/Block2/Project Generator'
const { exec, spawn } = require('child_process');

fs.readdir(`${progRootDir}/templates`, 'utf8', (err, templates) => { 
    inquirer.prompt({
        name: 'project-choice',
        type: 'list',
        message: 'Choose a project template',
        choices: templates
    })
        .then(answers => {
            const projectChoice = answers['project-choice'];
            const templatePath = `${progRootDir}/templates/${projectChoice}`;
            inquirer.prompt({
                name: 'project-name',
                type: 'input',
                message: 'Project name:'
            }).then(answers => {
                const projectName = answers['project-name'];
                destinationPath = `${userRootDir}/${projectName}`
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
                                      if (err) throw err;
                                    fs.readdir(`${templatePath}/${item}`, (err, deepContents) => {
                                        if (err) throw err;
                                        deepContents.forEach(deepItem => {
                                            const sourceFilePathDeep = `${templatePath}/${deepItem}`;
                                            fs.readFile(sourceFilePathDeep, 'utf8', (err, deepFile) => {
                                                if (err) throw err;
                                                const writePathDeep = `${destinationPath}/${item}/${deepItem}`;
                                                fs.writeFile(writePathDeep, `${deepFile}`, 'utf8', (err, file) => {
                                                    if (err) throw err;
                                                    console.log('Project folder created');
                                                    console.log('Installing npm modules...');
                                                    exec('npm install', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                        if (err) throw err;
                                                        console.log('npm package successfully installed');
                                                        console.log('Installing test modules...')
                                                        exec('npm install chai', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                            if (err) throw err;
                                                            exec('npm install mocha', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
                                                                if (err) throw err;
                                                                console.log('Test modules successfully installed'); 
                                                                inquirer.prompt({
                                                                    name : 'createGit',
                                                                    message : 'Create a git repository for this project?',
                                                                    type : 'confirm'                                                                                                                                    
                                                                    }).then(answers => {
                                                                        if (answers.createGit === true) {
                                                                            exec('git init ; git add ./ ; git commit -m "first commit"', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout,stderr) => {
                                                                                if (err) throw err;
                                                                                console.log('Git repo created, with initial commit');
                                                                                inquirer.prompt({
                                                                                    name : 'addRemote',
                                                                                    message : 'Add a github remote origin?',
                                                                                    type : 'confirm'  
                                                                                }).then(answers => {
                                                                                    if (answers.addRemote === true) {
                                                                                        console.log('Please go to https://github.com/new to create a new repo');
                                                                                        inquirer.prompt({
                                                                                            name : 'getRemoteUrl',
                                                                                            message : 'Paste your github URL here to connect:',
                                                                                            type : 'input'
                                                                                        }).then(answers => {
                                                                                            console.log(answers);
                                                                                            const gitUrl = answers.getRemoteUrl
                                                                                            exec(`git remote add origin ${gitUrl}`, { cwd : destinationPath, encoding : 'utf8'}, (err, stdout, stderr) => {
                                                                                                if (err) throw err;
                                                                                                console.log('Github connected');
                                                                                                quitAndOpenProject();
                                                                                            })
                                                                                        })
                                                                                    } else quitAndOpenProject();
                                                                                })
                                                                            });
                                                                        } else quitAndOpenProject();
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



function quitAndOpenProject () {
    exec('code .', { cwd : destinationPath, encoding : 'utf8' }, (err, stdout, stderr) => {
        if (err) throw err;
        console.log('Project Setup Complete!');
    });
};