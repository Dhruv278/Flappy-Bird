const express=require('express');
const app=express();
const path=require('path')
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));

app.get('/',(req,res)=>{
    res.status(200).render('main')
})
const port =process.env.PORT||5000;
app.listen(5000,()=>{
    console.log("Serevr is running");
})
