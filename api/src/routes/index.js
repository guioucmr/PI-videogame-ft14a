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
router.get('/videogames/:id', async (req, res) => {
    let {id} = req.params
    try {
      const response = await axios.get(`${SEARCH_URL}${id}?key=${API_KEY}`)
      const games = {
        name: response.data.name,
        description: response.data.description,
        background_image: response.data.background_image,
        released: response.data.released,
        rating: response.data.rating,
        platforms: response.data.platforms,
        id: response.data.id,
        genres: response.data.genres
      }
      return res.send(games);
      } catch (error) {
      if(error.response?.status === 404) {
        const game = await Videogame.findAll({
          include:{
            model: Genre,
            attributes: ['id','name'],
            through:{
                attributes:[],
            }
          }
        });
        const filtered = await game.filter( e => e.id === id).shift()
        if(filtered) return res.json(filtered);
        return res.statusCode(404)
      }
      return res.status(500).json({error: 'Sorry... id not found'})
    }
  });

  router.get('/genre',async(req,res,next)=> {
    try {
        const forGen =  await axios.get(`${GENRE_URL}`)
        //console.log ("for_gen",forGen)
        const temp = forGen.data.results.map(vg => {
        return vg.name
        })
        //console.log("QUE TRAE", temp)
        let newg = temp.map(string => {
            return string && string.split(', ')
        })
        const cadena = newg.flat()
        const filtrado = cadena.filter((string, i) => {
            return cadena.indexOf(string) === i
        })
        const result = filtrado.map(mio =>{
        return {
            name: mio || 'name not exist'
        }
        }).sort((a, b) => {
            if (a > b) return 1
            if (a < b) return -1
            return 0
        })
        if(!result.length){
            await Genre.bulkCreate(result)
        }
        return res.send(result)
    
            
        } catch (error) {next(error)
            }
    })


//   router.get('/genre', async (req, res) => {
//     try {
//         const genres = await Genre.findAll()
//         res.send(genres)
//     } catch (error) {
//         console.log(error)
//     }
//});

    router.post('/videogame', async (req, res) => {
        let {name, description, released, rating, platforms, genres} = req.body
        
          if(!name || !description || !platforms) {
            return res.status(400).json({error: 'Sorry... all parameters are required'})
          }
          let newGame = await Videogame.create({
            name: name,
            description: description,
            released: released,
            rating: rating,
            platforms: platforms,
          })
          console.log(newGame)
          await newGame.setGenres(genres)
          return res.send(newGame);
      });

// 
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;