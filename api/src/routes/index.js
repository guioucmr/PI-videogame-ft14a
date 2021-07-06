const{BASE_URL, SEARCH_URL, GENRE_URL} = require("../constantes")
const { Router } = require('express');
const router = Router();
const{Op} = require ('sequelize')
const axios = require('axios').default;
const { Videogame, Genre } = require('../db')
const {API_KEY} = process.env


router.get('/videogames', async(req, res, next) =>{
    const {q}=req.query
    if (!q) {
        try {
            const database=Videogame.findAll({
                include: {
                    model:Genre
                }
            })
            const api = await axios.get(`${BASE_URL}`)
            Promise.all([database,api])
            .then(result =>{
                const[dataDB,dataAPI]= result
                const resultado = dataDB.concat(dataAPI.data)
                res.send (resultado)
            })
        } catch (error) {
            next(error)
        }        
    } else {
        try {
            const database=Videogames.findAll({
                where:{nombre:q}
            })
            const api = await axios.get( `${BASE_URL}`)
            Promise.all([database,api])
            .then(result =>{
                const[dataDB,dataAPI]= result
                const resultado = dataDB.concat(dataAPI.data)
                res.send (resultado)
            })
        } catch (error) {
            next(error)
        }
        
    }
})
router.get('/videogames/:id',async(req,res)=> {
    const {id}=req.params
    const forId =  await axios.get( `${BASE_URL}`)
    const videos = forId.data.result.filter(p=>p.id===id)
    res.json(videos)
})
// 
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;