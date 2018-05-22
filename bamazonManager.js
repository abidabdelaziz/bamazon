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
            choices: ['View products for sale','View Low Inventory','Add to Inventory','Add New Product']
          }
        ]).then (answers => {
            
            MangTool[answers['menu options']]()  
      });  
  }

  MangTool={
    ['View products for sale']: 
        function(){
            console.log( "Searching inventory...\n");
            connection.query( "SELECT * FROM products",
            function (err,res){ if (err) throw err;       
             console.log(res);
            }
        )
        connection.end()},
   
    ['View Low Inventory']: 
        function(){
          console.log("Searching low inventory...\n")
          connection.query( "SELECT * FROM products WHERE stock_quantity < 5",
          function (err,res){ if (err) throw err;       
           console.log(res);
          }
      );
        connection.end()
        },
    ['Add New Product']: 
        function(){
          console.log("Product prompt...\n")
            inquirer.prompt([
              {
                message: "Enter Product",
                type:"input",
                name: "productName"
              },
              {
                message: "Enter Department",
                type:"input",
                name: "prodDep"
              },
              {
                message: "Enter Price",
                type:"input",
                name: "prodPrice"
              },
              {
                message: "Enter Quantity",
                type:"input",
                name: "prodQuan"
              }
            ]).then (answers => {
              
                connection.query("INSERT INTO products SET ?",
              
                  { product_name : answers.productName,
                    department_name : answers.prodDep,
                    price : parseInt(answers.prodPrice),
                    stock_quantity : parseInt(answers.prodQuan),
                    product_sales: 0
                  }, 
                  function(err,res){
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted.\n");
                  }     
                );
                  connection.query("INSERT INTO departments (department_name) SELECT department_name FROM products WHERE NOT EXISTS (SELECT department_name FROM departments WHERE departments.department_name = products.department_name)",

                  function(err,res){console.log(res)}
                
                  );

        connection.end()         
        }); 
        },
    ['Add to Inventory']: 
        function(){

          console.log("Updating inventory...\n")
          inquirer.prompt([
            {
              message: "Which item_id?",
              type:"input",
              name: "itemId"
            },
            {
              message: "How many to add?",
              type: "input",
              name: "prodQuan"
            }
          ]).then( answers =>{ 

            connection.query("UPDATE products SET stock_quantity = stock_quantity +" + answers.prodQuan +" WHERE ?",
        
              [
                {item_id: parseInt(answers.itemId)}
              ],
                function(err,res){
                  if (err) throw err;
                  console.log(res.affectedRows + " products updated.\n")
                }
            ) 
            connection.end()
          });}
}