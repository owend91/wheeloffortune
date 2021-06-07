const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require("mongoose");

require('dotenv').config();

const mainUrl = "https://wheeloffortuneanswer.com/"
// const categoryUrls = []

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const puzzleSchema = new mongoose.Schema({
    category: String,
    puzzle: String,
  });
  const WheelPuzzle = new mongoose.model("WheelPuzzle", puzzleSchema);
  

getCategoryUrls()
.then( (urls) => {
    // console.log(urls)
    populatePuzzles(urls)
    .then( puzzles => {
        var i = 0;
        for(puzzle of puzzles){
            if(puzzle.category && puzzle.puzzle && puzzle.category !== '' && puzzle.category !== ''){
                new WheelPuzzle({
                    category : puzzle.category,
                    puzzle : puzzle.puzzle
                }).save( err => {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log(`${i} saved`)
                    }
                    i++;
                });
            }
        }
    });
});

async function getCategoryUrls() {
    const categoryUrls = axios.get(mainUrl)
    .then( response => {
        // console.log(response.data)
        const $ = cheerio.load(response.data);
        let urls = []
        $('.tablepress-id-73 tbody tr').each((i, elem) => {
            const categoryUrl = $('tr td a', elem).attr('href');
            // console.log(categoryUrl);
            urls.push(categoryUrl);
            
        });
        return urls;
        
    })
    .catch(error => console.log(error));
    return categoryUrls;
    
}

async function populatePuzzles(urls){
    let promiseArray = urls.map(url => (axios.get(url).catch(error => console.log(error))));
    return Promise.all(promiseArray)
    .then(results => {
        const puzzles = [{}]
        for(result of results){
            
            const $ = cheerio.load(result.data);
            let category = '';
            const tables = $('.tablepress')
            let tableId = ''
            tables.each((i, elem) => {
                if(elem.attribs.id !== 'tablepress-73'){
                    category = $('thead tr th.column-1', elem).text()
                    tableId = elem.attribs.id;
                } 
            });
            $(`#${tableId} tbody tr`).each ((i, elem) => {
                const puzzle = $('td.column-1', elem).text();
                
                puzzles.push({
                    category: category,
                    puzzle: puzzle
                })

            });
            
            // console.log(table)
        }
        return puzzles

    });
    // console.log(urls);
    // for (url of urls){
    //     console.log(url);
    // }

}