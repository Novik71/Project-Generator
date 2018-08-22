The task is to build a project generator. The goal is to be able to use the terminal command `$generate my_new_project` and it should create a directory with the project's name in your current location, then fill it with the necessary files to start a basic JS project.
These should include:

* an index.js
* a spec folder
* an index.spec.js
* a package.json set up with the basic dependencies and scripts
* a README.md file
* an eslint config file
* a .gitignore file
* a git repo initialised
  In order to do this you will need to utilise the **File System** module available in Node. Only use the asynchronous methods - any ending in 'sync' are not allowed.

A big part of problem solving is reading documentation and establishing what you will need and how to use it - here is the [documention for Node's File System module](https://nodejs.org/api/fs.html). You'll also have to research how to install your program on your computer to make the generate command globally available from your terminal.

**Advanced Features**

* Configure your generator to automatically run npm install when used, installing all the packages listed in the package.json.
* If called like so: generate [project name][github http], it should automatically add the github http as a remote.
* It should perform an inital commit with the message 'initial commit' and push it to your github on the link provided.
* Explore how you could add interactivity purely with Node, i.e. ask the user to input the name of the project on the console or select between a choice of project templates.
