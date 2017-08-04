var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');

app.use(express.static('dist'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.listen(3000);

app.get('/', function(req, res) {

    var crawlDatas = [];
    var errors = '';
    var productURL1 = '';
    var productURL2 = '';
    res.render('index', {
        crawlDatas: crawlDatas,
        errors: errors,
        productURL1: productURL1,
        productURL2: productURL2
    });
})
app.post('/compare', function(req, res) {
    var crawlDatas = [];
    var errors = '';
    var productURL1 = req.body.producturl1;
    var productURL2 = req.body.producturl2;
    var urls = [productURL1, productURL2];
    if(productURL1 && productURL2) {
        
        Promise.all(urls.map(function (url) {
            return new Promise((resolve, reject) => {
                getProductDetail(url, function(returnObj) {
                    resolve(returnObj);
                });
            });
        })).then(function (result) {
            if(result[0]['sku'] == '' && result[0]['title'] == '')
            {
                errors = 'Product 1 URL wrong';
            }
            if(result[1]['sku'] == '' && result[1]['title'] == '')
            {
                errors = 'Product 2 URL wrong';
            }
            if((result[1]['sku'] == '' && result[1]['title'] == '') && (result[0]['sku'] == '' && result[0]['title'] == ''))
            {
                errors = 'Product URL wrong';
            }
            res.render('index', {
                crawlDatas: result,
                errors: errors,
                productURL1: productURL1,
                productURL2: productURL2
            });
        }).catch(function (err) {
            console.log(err);
        });

    }   
    


})

function getProductDetail(url, callback) {
    request(url , function(error, response, html) {
        var returnObj = {}
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var spec = '';
            $('table.specification-table td:nth-child(2)').each(function(i, element){
                var temp = $(this).text();
                spec += temp + '</br>';
            });
            var title = $('#prod_title').text();
            returnObj.sku = spec;
            returnObj.title = title;
        } else {
            errors.push(error);
           
        }

         callback(returnObj);
        return returnObj;
    })
    
}