const { Router } = require('express');
const axios = require('axios')
const { APY_KEY } = process.env;
const { Videogame, Gender } = require('../db')

const router = Router();

router.get('/videogames', async(req, res, next) =>{
    const {q}=req.query
    if (!q) {
        try {
            const database=Videogame.findAll({
                include: {
                    model:Gender
                }
            })
            const api = await axios.get('https://api.rawg.io/api/platforms?key=a509347024b04d8ab7f0e2a110105e5d')
            Promise.all([database,api])
            .then(result =>{
                const[dataDB,dataAPI]= result
                const resultado = dataDB.concat(dataAPI.data.result)
                res.send (resultado)
            })
        } catch (error) {
            next(error)
        }        
    } else {
        try {
            const database=Videogame.findAll({
                where:{nombre:q}
            })
            const api = await axios.get( `https://api.rawg.io/api/platforms?key=a509347024b04d8ab7f0e2a110105e5d${q}`)
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


router.get('/videogame/:id',async(req,res)=> {
    const {id}=req.params
    const forId =  await axios.get( `https://api.rawg.io/api/platforms?key=a509347024b04d8ab7f0e2a110105e5d`)
    const vd = forId.data.result.filter(p=>p.id===parseInt(id))
    res.json(vd)
})



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
