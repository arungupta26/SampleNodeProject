const fs                        = require('fs');
const https                     = require('https');

const apiKey                    = 'dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf'

const dictionaryEndPoint        = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+apiKey+'&lang=en-ru&text=';

const MINIMUM_WORD_LENGTH       = 2
const LIMIT_COUNT               = 10

var wordVsCountMap              = {};
var result                      = {};

var tempCounter = 0

var appendWordDetails= (word) =>{    
    https.get(dictionaryEndPoint+word, (resp) => {
        let data = '';
      
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        resp.on('end', () => {
            data =JSON.parse(data);
            var details = result[word] ;
            details['details'] = data["def"];
            result[word] = details;
            if(++tempCounter== LIMIT_COUNT)
                console.log(JSON.stringify(result));
        });
      
      }).on("error", (err) => {
        console.error("Error: " + err.message);
      });

}



var readStream = fs.createReadStream('input.txt', 'utf8');

readStream.on('data', function(chunk) {  
var res = chunk.split(" ");

   res.forEach(element => {
       if(wordVsCountMap[element])
        wordVsCountMap[element] +=1;
       else
        wordVsCountMap[element] = 1;
   });

}).on('end', function() {

    
var t = Object.entries(wordVsCountMap)
                .filter(a=> a[0].length>=MINIMUM_WORD_LENGTH)
                .sort((a,b)=> b[1]-a[1])
                .slice(0,LIMIT_COUNT);

t.forEach(ele=>{
        var wordDetails = {};
        wordDetails['count'] = ele[1];
        result[ele[0]] = wordDetails;

        appendWordDetails(ele[0])
    });
});







