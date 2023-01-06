require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');
const bodyParser = require('body-parser');
const e = require('express');



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const arrLink = []

app.post("/api/shorturl", (req, res) => {
  const link = req.body.url
  // console.log(req.body)
  const parsedUrl = url.parse(link);
  const hostname = parsedUrl.hostname;
  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.error(`DNS lookup failed: ${err.message}`);
    }
  
    console.log(`IP address: ${address}`);
    console.log(`IP family: IPv${family}`);
    if(address == null){
      res.json({error: "invalid url"})
    }
    else{
      const randomNumber = Math.floor(Math.random() * 10000);

      const object = {[randomNumber]: link}
      arrLink.push(object)
      console.log(arrLink)
    
      res.json({original_url: link, short_url: randomNumber})
    }
  });
})


app.get("/api/shorturl/:link", (req, res) => {
  const link = req.params.link
  // console.log(arrLink)

  // const found = arrLink.some(function(object) {
  //   return link in object;
  // });
  // console.log(found)
  
  const value = arrLink.find(function(object) {
    return link in object;
  });

  // console.log(value[link])

  res.redirect(value[link]);

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
