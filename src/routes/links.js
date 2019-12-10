const express = require('express');
const router = express.Router();
const pool = require('../datebase');

router.get('/add' , (request, response) => {
    response.render('links/add');
});

router.post('/add', async (request, response) => {
    const {title, url, description } = request.body;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('INSERT INTO links set ?', [newLink]);
    request.flash(`success`, 'Link saved successfully');
    response.redirect('/links');
});

router.get('/', async (request, response)=> {
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    response.render('links/list', {links});
});

router.get('/delete/:id', async (request, response) => {
    const {id} = request.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    response.redirect('/links');
});

router.get('/edit/:id', async (request, response) => {
    const {id} = request.params;
    const link = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    response.render('links/edit', {link:link[0]});
});

router.post('/edit/:id', async (request,response) => {
    const {id} = request.params;
    const { title, description, url} = request.body;
    const newLink = {
        title,
        description,
        url
    };

    await pool.query('UPDATE links set ? WHERE id = ?' , [newLink, id]);
    response.redirect('/links');
});

module.exports = router;