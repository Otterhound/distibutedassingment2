let xmlrpc = require('xmlrpc');
const prompt = require('prompt-sync')({sigint: true});

// Waits briefly to give the XML-RPC server time to start up and start
// listening
setTimeout(function () {

  let quit = false;

  // Creates an XML-RPC client. Passes the host information on where to
  // make the XML-RPC calls.
  let client = xmlrpc.createClient({ host: 'localhost', port: 3000, path: '/'})

  while (!quit) {

    console.log("1) Send client request\n2) Get note with topic\n0) Quit");
    let choice = Number(prompt());

    if (choice === 1) {

      console.log("Give topic");
      let topic = prompt();
      console.log("Give name");
      let name = prompt();
      console.log("Give text");
      let text = prompt();
      let timeStamp = new Date();

      // Sends a method call to the XML-RPC server
      client.methodCall('anAction', [topic, name, text, timeStamp], function (error, value) {
        // Results of the method response
        console.log('Method response for \'anAction\': ' + value)
      })
    }

    if (choice === 2) {
      console.log("Give topic name");
      let topicName = prompt();
      // Sends a method call to the XML-RPC server
      client.methodCall('anReturnTopic', [topicName], function (error, value) {
      // Results of the method response
      console.log('Note data: ' + value)
      })
    }

    if (choice === 0) {
      quit = true;
    }
  }

}, 1000)