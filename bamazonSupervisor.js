var mysql= require("mysql");
var inquirer= require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err){

    if (err) throw err ;
    console.log( " connected as " + connection.threadId + "\n");
    showMenu()
  })

  function showMenu(){
        console.log( "Menu...\n");
            inquirer.prompt([
            {
                message: "What would you like to do?",
                type:"list",
                name: "menu options",
                choices: ['View product sales by department','Create New Department']
            }
            ]).then (answers => {
                
                MangTool[answers['menu options']]()  
        });  
    }


mangTool={

    ['View product sales by department']:
        function(){

            
        },
    ['Create New Department']: function(){}
}
