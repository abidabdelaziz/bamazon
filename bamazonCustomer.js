var mysql= require("mysql");
var inquirer= require("inquirer");
var itemId_input
var prodQuan_input
var cost

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
    showInvent()
  })



 function showInvent(){

  console.log( "Selecting...\n");
  connection.query( "SELECT * FROM products",
    function (err,res){
      if (err) throw err;
        
      console.log(res);
        inquirer.prompt([
          {
            message: "Enter ID",
            type:"input",
            name: "itemId"
          },
          {
            message: "How many?",
            type:"input",
            name: "prodQuan"
          }
        ]).then (answers => {
            console.log(answers.itemId,answers.prodQuan );

            itemId_input= answers.itemId
            prodQuan_input=parseInt(answers.prodQuan)
          checkInv();
      }); 
    })
}

function checkInv(){
  console.log("Checking Inventory...\n")
  
  connection.query( "SELECT * FROM products WHERE item_id = " + itemId_input,
  function(err,res){
    if (err) throw err;
    cost = res[0].price;
   (prodQuan_input<=res[0].stock_quantity) ? updateInv(prodQuan_input,itemId_input,cost) : console.log("Insufficent quantity!")
    console.log(res[0].stock_quantity, prodQuan_input);

  })
  
}

function updateInv(prodQuan_input,itemId_input){

    console.log("Updating inventory...\n")
    connection.query("UPDATE products SET stock_quantity = stock_quantity -" + prodQuan_input +" WHERE ?",
      [
        {item_id: itemId_input}
      ],
        function(err,res){
          console.log(res.affectedRows + " products updated.\n")
        }
    ) 
    console.log( " Your total comes to " + cost*prodQuan_input + "$, thank you come again!") 
    connection.query("UPDATE products SET product_sales = product_sales +" +cost*prodQuan_input+" WHERE ?",
      [
        {item_id: itemId_input}
      ],
        function(err,res){
          console.log(res.affectedRows + " products updated.\n")
        }
    )
    connection.end()
}

