require('dotenv').config({});
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
console.log(process.env);
const {DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DATABASE} = process.env;


//konfigurasi koneksi
const mysql = require('mysql');
const conn = mysql.createConnection({
    host : DB_HOST,
    user : DB_USERNAME,
    password : DB_PASSWORD,
    database : DB_DATABASE
});

// cek koneksi
conn.connect(function (error) {
    if (!!error)console.log(error);
    else console.log('Database terkoneksi');
    
});

//mengatur direktori views
app.set('views', path.join(__dirname,'views'));
app.set('view engine','hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//route untuk homepage
app.get('/',(req,res) => {
    let sql = "SELECT * FROM buku";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('buku_index',{
            title : 'CRUD Operation using Nodejs/ ExpressJS / MySQL',
            results : results
        // res.json({
        //     msg: 'success',
        //     results:results
        
        });
    });
});


//route untuk insert data
app.post('/save',(req,res) => {
    console.log(req.body);
    let data = {judul : req.body.judul, tahun_terbit : req.body.tahun_terbit, penerbit : req.body.penerbit};
    let sql = "INSERT INTO buku SET ?";
    let query = conn.query(sql,data,(err, results) => {
        if (err) throw err;
        res.redirect('/');
        // res.json({
        //         msg: 'success',
        //         results:results
        // });
    });
});

//route untuk update data
app.post('/update',(req,res) => {
    let sql = "UPDATE buku SET judul = '" + req.body.judul +"', tahun_terbit ='" + req.body.tahun_terbit +"', penerbit = '" + req.body.penerbit+"' WHERE id_buku = '" + req.body.id+"'";
    console.log(sql);
    let query = conn.query(sql,(err, results) => {
        if(err) throw err;
        // res.redirect('/');
        res.json({
            msg: 'success',
            results:results
        });
    });
});

//route untuk delete data
app.post('/delete', (req, res) => {
    let sql= "DELETE FROM buku WHERE id_buku = '" +req.body.id+"'";
    let query = conn.query(sql,(err, results) => {
        if(err) throw err;
        // res.redirect('/');
        res.json({
            msg: 'success',
            results:results
        });
    });
});

// get kategori 
app.get('/views/kategori',(req, res) =>{
    const sql = 'SELECT * FROM kategori';
    conn.query(sql,(err, data) => {
        if(err){
            console.log(err);
        }else{
            console.log(JSON.stringify(data));
            res.render('kategori/kategori_index', {
                title : 'kategori',
                kategori : data
            });
            // res.json({
            //     msg:'succes',
            //     kategori : data
            // });

        }
    })
});

//save kategori
app.post('/views/kategori/save', (req,res) => {
    console.log(req);
    const{body} = req;
    const sql = 'INSERT INTO kategori SET kategori=?';
    conn.query(sql,body.kategori,(err, data) =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/views/kategori');
        // }
        //    res.json({
        //         msg:'succes',
        //         kategori : data
            // });
        }
    });

})
// update kategori

app.post('/views/kategori/update', (req,res) =>{
    const{id_kategori, kategori} = req.body;
    const sql = 'UPDATE kategori SET kategori =? WHERE id_kategori=?';
    conn.query(sql, [kategori, id_kategori], (err,data) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/views/kategori');
            // res.json({
            //     msg: 'succes',
            //     kategori : data
            // });
        }
    });
})

//Dalete
app.post('/views/kategori/delete',(req,res) =>{
    const{id} = req.body;
    const sql = "DELETE FROM kategori WHERE id_kategori=?" ;
    conn.query(sql, id,(err,data) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/views/kategori')
            
        }
        // res.json({
        //     msg: 'succes',
        //     kategori : data
        // });

    })
}) 

//server listening
app.listen(3001, () => {
    console.log('server running at port 3001');
});