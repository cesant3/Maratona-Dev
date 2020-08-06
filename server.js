//configurando o server
const express = require("express")
const server = express()

//configurar o server para apresentar arquivos estáticos
server.use(express.static("public"))

//habilitar body do form
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o bd
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'ces25879',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configurar a apresentação da pagina
server.get("/", function(req, res){
    db.query(`SELECT * FROM "donors"`, function(err, result){
        if(err) return res.send("erro de bd.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("TODOS OS CAMPOS SÃO OBRIGATÓRIOS!!")
    }

    //insiro os valores no bd
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    
    db.query(query, values, function(err){
        if (err) return res.send("erro no bd")

        return res.redirect("/")
    })

})

//ligar o server e acessar através da porta 3000
server.listen(3000,function(){
    console.log("iniciei o servidor")
})