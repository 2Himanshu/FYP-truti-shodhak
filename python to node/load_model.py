from translate import Translator
from flask import Flask, request, jsonify
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from translate import Translator
from trutishodhak_language_tool import LanguageTool

app = Flask(__name__)
CORS(app)

# Load the model from the .pkl file
with open('spell_checker_model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Extract the vectorizer and any other necessary components from the loaded model
vectorizer = loaded_model[0]  # Assuming the vectorizer is the first element of the tuple
X = loaded_model[1]  # Assuming X is the second element of the tuple

with open('train.txt', 'r', encoding='utf-8') as dataset_file:
    dataset = [line.strip() for line in dataset_file]

# Function to suggest closest word
def suggest_closest_word(input_word, vectorizer, X, dataset, num_suggestions=1):
    input_vector = vectorizer.transform([input_word])
    similarities = cosine_similarity(input_vector, X)
    closest_word_indices = similarities.argsort()[:, -num_suggestions:][0][::-1]
    closest_words = [(dataset[idx], similarities[0, idx]) for idx in closest_word_indices]
    return closest_words

def count_words(sentence):
    words = sentence.split()
    return len(words)

def translate_to_english(text):
    translator = Translator(from_lang="hi", to_lang="en")
    translated_text = translator.translate(text)
    return translated_text

def translate_to_hindi(text):
    translator = Translator(from_lang="en", to_lang="hi")
    translated_text = translator.translate(text)
    return translated_text

def correct_grammar(text):
    tool = LanguageTool('en-US')
    matches = tool.correct(text)
    return matches

@app.route('/suggest', methods=['POST'])
def suggest():
    input_word = request.json.get('input_sentence')
    no_of_wrds=count_words(input_word)
    if no_of_wrds==1:
        closest_words = suggest_closest_word(input_word, vectorizer, X, dataset, num_suggestions=8)
        response = jsonify({'closest_words': closest_words})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        english_translation = translate_to_english(input_word)
        corrected_text = correct_grammar(english_translation)
        closest_words = [[translate_to_hindi(corrected_text),0.9]]
        response = jsonify({'closest_words': closest_words})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

if __name__ == '__main__':
    app.run(debug=True)
