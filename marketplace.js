const http = require("http");
const url = require("url");
const fs = require("fs");
const productList = require("./data/productlist.js");
/*
const header = () => {
  return (`<header><h1>Header : Welcome to Marketplace </h1></header>`)
}
*/
const header = (message) => {
  return `<header><h1>${message} </h1></header>`;
};
const footer = () => {
  return `<footer><h6> &copy; 2026 Marketplace | All Rights Reserved  </h6></footer>`;
};
const navigation = () => {
  return `
 <a href="/"> Home</a> | 
 <a href="/electronics"> Electronics</a> | 
 <a href="/cloths"> Clothing</a> | 
 <a href="/jwellery"> Jwellery</a> | 
 <a href="/toys"> Toys</a>
 `;
};

http.createServer((req, res) => {
    const address = url.parse(req.url, true);
    //console.log(address);
    const path = address.pathname;
    const dynamicpath = path.replace("/", "");
    const pathbrandName = address.query.brand;
    /*
    console.log(
      `Selected path is :: ${dynamicpath} && brandname is :: ${pathbrandName} `,
    );*/

    res.writeHead(200, "Everything looks good on server", {
      "content-type": "text/html",
    });

    res.write(header("Welcome to the Global Marketplace! "));
    res.write(navigation());
    res.write(`<br><br>`);
    if (dynamicpath === "" || dynamicpath === "home") {
      productList.forEach((product) => {
        res.write(`<li>${product.name} - ${product.brand} -${product.price}</li>`);
      });
      res.write(`<br><br>`);
      fs.readFile("./content/aboutus.txt", (err, data) => {
        if (err) {
          res.write("Something is Wrong ....");
          return;
        } else {
          res.write(`
                    <div>
                    ${data}
                    </div>
                `);
        }
        res.write(footer());
        res.end();
      });
    } else if (
      dynamicpath === "electronics" ||
      dynamicpath === "cloths" ||
      dynamicpath === "jwellery" ||
      dynamicpath === "toys"
    ) {
      res.write(`<h4>Selected Category: ${dynamicpath.toUpperCase()}</h4>`);
      let matchFound = false;
       productList.forEach((product) => {
            const isCategoryMatch = product.category === dynamicpath;
            const isBrandMatch = !pathbrandName || pathbrandName.toLowerCase() === product.brand.toLowerCase();

            if (isCategoryMatch && isBrandMatch) {
                matchFound = true;
                res.write(`
                    <div>
                        <h3>${product.name}</h3> 
                        <p>Brand: ${product.brand} | Price: ${product.price}</p>
                    </div>
                `);
            }
        });

        if (!matchFound) {
            res.write("<p>404: We don't sell that here!</p>");
        }
        //res.end();
    } 

    //http://127.0.0.1:3035/cloths?brand=Levis
    //http://127.0.0.1:3035/electronics?brand=Philips

    fs.readFile("./content/terms.txt", (err, data) => {
      if (err) {
        res.write("Something is Wrong ....");
        return;
      } else {
        res.write(`
                    <br><br>
                    <div>
                    ${data}
                    </div>
                `);
      }
      res.write(footer());
      res.end();
    });
  })
  .listen(3035, () => console.log("Listening on port 3035"));
