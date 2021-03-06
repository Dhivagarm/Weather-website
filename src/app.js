const path=require('path')
const express= require('express')
const hbs= require('hbs')


const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

const publicdirectorypath=path.join(__dirname,'../public') 
app.set('view engine','hbs')
// setup handlebars

const path1= path.join(__dirname,'../templates/views')
app.set('views',path1)

const partialspath=path.join(__dirname,'../templates/partials')
hbs.registerPartials(partialspath)

//setup static directory to serve
app.use(express.static(publicdirectorypath))

app.get('/',(req, res)=>{
    res.render('index',{
        title:"weather app",
        name:'Dhivagar M'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:"about",
        name:'Dhivagar M'

    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:"help ",
        name:"Dhivagar M"

    })
})


app.get('/weather',(req, res)=>{
    if(!req.query.address)
    {
        return res.send({
            error:'you must provide a address!'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location}= {}) =>{
        if(error)
        {
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastdata)=>{
            if(error)
            {
                res.send({error})
            }
            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address,

            })
        })
    })


})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404 help',
        name:'Dhivagar M',
        errormessage: 'help article not found',
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Dhivagar M',
        errormessage: 'page not found',
    })
})

app.listen(port,()=>{
    console.log('server is up on port '+port)
})