const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));

// console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use('/public', express.static('public'));


// Set the view engine to use EJS templates
app.set('view engine', 'ejs');

// Define a route to render the index.ejs template
app.get('/', (req, res) => {
    // Define a variable to pass to the template
    const message = "translate whatever you want";
    res.render('index', { message });
});

app.use(express.static('public'));
app.post('/translate', (req, res) => {
    // Access form data from request body
    const inputValue = req.body.inputValue;
    const inputLanguage = req.body.inputLanguage;

    // Process form data
    // console.log(`You entered: ${inputValue}, language: ${inputLanguage}`);
    // You can use the input value as needed in your script
    // For example, you can send a response to the client or store the data in a database
    async function getResponse(input, targetLanguage) {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Translate following text into ${targetLanguage}:\n\n ${input}\n`,
            temperature: 0.3,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        // console.log(response['data']);
        const translation = response['data']['choices'][0]['text'];
        const language = targetLanguage;
        console.log("input: ", inputValue);
        console.log("translation: ", translation);
        // Render the index.ejs template and pass the variable as context
        res.render('translate', { inputValue, translation, language });
    }
    getResponse(inputValue, inputLanguage);
    // Send response to inputLanguage
    // res.send(`enter: ${inputValue}, Language: ${inputLanguage}`);
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});