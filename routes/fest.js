const express = require('express');
const router = express.Router();

const Fest = require('../model/fest')

router.get('/addFest', (req, res, next) => {
    console.log('hola from form ')
    res.render('index/form')
})

router.post('/addFest', async (req, res, next) => {
    const { fest_name, fest_place, fest_date, fest_date_end, fest_genre } = req.body;
    const openair = Boolean(req.body.openair)
    const newFest = await new Fest({
        text: fest_name,
        start_date: fest_date,
        end_date: fest_date_end
        //    place:  fest_place,
        //    genre: fest_genre,
        //    openAir: openair
    })
    const x = await newFest.save()
    console.log(x.start_date)
    res.redirect('schedule')
})

router.get('/schedule', (req, res, next) => {
    // Fest.find({})
    //     .then(results => {
    //         for (let i = 0; i < results.length; i++) {
    //             results[i].id = results[i]._id;
    //             delete results[i]._id
    //         }
    // console.log(results)
    res.render('index/schedule')

    // })
    // .catch(error => {
    // console.log(error)
    // })

});

router.get('/data', (req, res, next) => {
    console.log('get /data route')
    Fest.find()
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                results[i].id = results[i]._id;
                delete results[i].id
            }
            console.log(results)
            res.send(results)
        })
        .catch(error => {
            console.log(error)
        })
});

router.post('/data', async (req, res, next) => {
    let data = req.body;
    let mode = data["!nativeeditor_status"];
    let sid = data.id;
    let tid = sid;


    delete data["!nativeeditor_status"];
    delete data.id

    if (mode == "inserted")
        new Fest(data)
            .save()
            .then(result => {
                update_response(result)
            })

    else if (mode == "updated")
        Fest.findByIdAndUpdate(sid, data, update_response);
    else if (mode == "deleted")
        Fest.findByIdAndDelete(sid, data, update_response);

    else
        res.send("Not supported operation");


    function update_response(result) {
        if (mode == "inserted"){
            console.log('dupa')
        console.log(result + " from updateresposne insterd")
        tid = result._id}

        res.send({ action: mode, sid: sid, tid: tid });
    }


});

// router.put('/data/:id', (req, res, next) => {
//     const { text, start_date, end_date } = req.body
//     const id = req.params.id;
//     console.log(`our id from put route ${id}`)
//     let b;
//     const newFest = {
//         text, start_date, end_date
//     }
//     const xxx= Fest.findOneAndUpdate(text, newFest, {new: true})
//         .then(x => {

//             console.log(`our result from query update ${x}`)
//         res.send(x)
//         })
//         .catch(err => console.log(err))

//     console.log(xxx)

// Fest.findOneAndUpdate(id, newFest)
//     .then(updatedFest => {
//         console.log(`Succesfully updated Your fest, now its : ${updatedFest}`)
//     })
//     .catch(err => {
//         console.log('there was some problems with update ...')
//     })
// console.log('our shir from update route')
// console.log(id, text, start_date, end_date)
// });

// router.delete('/data/:id', (req, res, next) => {
//     const id = req.params;
//     console.log(id + ' thats from delete route')
//     Fest.findOne(id).then(result => console.log(result))
//         .then(result => console.log(result))
// })

module.exports = router