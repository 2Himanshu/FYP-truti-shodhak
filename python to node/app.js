const { PythonShell } = require('python-shell');

// Define a function to suggest closest word
function suggestClosestWord(inputWord, vectorizer, callback) {
    let options = {
        scriptPath: '.', // Current directory
        args: [inputWord, JSON.stringify(vectorizer)]
    };

    PythonShell.run('suggest_closest_word.py', options, (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        // Parse the result and pass it to the callback function
        const closestWords = JSON.parse(result);
        callback(null, closestWords);
    });
}

// Load the model from the .pkl file
const { PythonShell } = require('python-shell');

// Load the model from the .pkl file
const options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: '/path/to/your/python/scripts',
  args: ['spell_checker_model.pkl']
};

PythonShell.run('load_model.py', options, function (err, results) {
  if (err) throw err;
  // Results is an array consisting of messages collected during execution
  // Extract the vectorizer and any other necessary components from the loaded model
  const loaded_model = results[0]; // Assuming the loaded model is the first element
  const vectorizer = loaded_model[0]; // Assuming the vectorizer is the first element of the loaded model tuple

  // Example usage
  const inputWord = "कीपग";
  suggestClosestWord(inputWord, vectorizer, (err, closestWords) => {
    if (err) {
      console.error('Error suggesting closest word:', err);
      return;
    }
    console.log(`Input Word: ${inputWord}`);
    console.log("Closest Words:");
    closestWords.forEach(({ word, similarity }) => {
      console.log(`${word}: Similarity = ${similarity}`);
    });
  });
});
