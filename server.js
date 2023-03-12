const xmlrpc = require('xmlrpc');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Creates an XML-RPC server to listen to XML-RPC method calls
let server = xmlrpc.createServer({ host: 'localhost', port: 3000 })

// Handle methods not found
server.on('NotFound', function(method, params) {
    console.log('Method ' + method + ' does not exist');
})

// Handle method calls by listening for events with the method call name
server.on('anAction', function (err, params, callback) {
    console.log('Method call params for \'anAction\': ' + params)

    try {
        let topicExits = false;
        
        // Reads database and converts it to json
        const databaseXml = fs.readFileSync('db.xml', "utf8");
        const parser = new XMLParser();
        const json = parser.parse(databaseXml);

        // Check if topic alredy exits
        json.data.note.forEach(note => {

            // Append data to existing topic
            if (note.topic === params[0]) {
                note.title = params[1];
                note.text = params[2];
                note.timestamp = params[3];
                topicExits = true;
            }
        });

        // Creates new note
        if (!topicExits) {
            const note = {
                topic: params[0],
                title: params[1],
                text: params[2],
                timestamp: params[4]
            }
            json.data.note.push(note);
        }

        // Converts json to xml and write it to database
        const builder = new XMLBuilder();
        const jsontoxml = builder.build(json);
        fs.writeFileSync("db.xml", jsontoxml);

    } catch (err) {
        console.error(err);
    }

  // Send a method response with a value
    callback(null, 'aResult')
})

server.on('anReturnTopic', function (err, params, callback) {
    console.log('Method call params for \'anReturnTopic\': ' + params)

    let returnData;

    try {
        // Reads database and converts it to json
        const databaseXml = fs.readFileSync('db.xml', "utf8");
        const parser = new XMLParser();
        const json = parser.parse(databaseXml);

        // Check if topic exits
        json.data.note.forEach(note => {
            // Data found
            if (note.topic === params[0]) {
                const builder = new XMLBuilder();
                returnData = builder.build(note);
            }
        });

    } catch (err) {
        console.error(err);
    }

    // Send a method response with a value
    callback(null, returnData);
})

console.log('XML-RPC server listening on port 3000');