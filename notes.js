validate: function (input) {
    if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
    else return 'Project name may only include letters, numbers, underscores and hashes.';
  } // insert as property into inquirer.prompt object