const http = require('http');
const PORT = 3001;


const server = http.createServer((req, res) => {
   res.setHeader("Content-Type","application/json")

    console.log(req.method + " " + req.url)

   if (req.url === "/"  && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify({"message": 'Hello World!',}));
        return;
   } 
   
   if (req.url === '/tasks' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk
    });
    
    req.on('end', () => {
       try{
        res.statusCode = 201
        const data = JSON.parse(body)
        console.log(data)
        res.end(JSON.stringify({ received: data }));

       }catch{
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid JSON'}))
       }
    });
    
    return; 
    }else {
        res.statusCode = 404;
        res.end(JSON.stringify({ "error": "Не найдено" }))
        return;
   }

   
});


server.listen(PORT, () => {
    console.log("Server is running")
})