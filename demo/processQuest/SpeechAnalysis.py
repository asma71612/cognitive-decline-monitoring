import spacy
from collections import Counter
import re
import pandas as pd

# Load the model
nlp = spacy.load("en_core_web_lg")

DERIVATIONAL_SUFFIXES = {
    "ly": "Adverbial -ly",
    "ness": "Noun -ness",
    "ment": "Noun -ment",
    "ation": "Noun -ation",
    "ity": "Noun -ity",
    "al": "Adjective -al",
    "ous": "Adjective -ous",
    "ive": "Adjective -ive",
    "ful": "Adjective -ful",
    "less": "Adjective -less",
    "er": "Agentive -er",
}

def lexical_content_with_pos_analysis_spacy(text):
    """
    Analyzes lexical content with part-of-speech tagging, processing sentence by sentence using spaCy.
    """
    doc = nlp(text)

    total_tokens = 0
    total_nouns = 0
    total_verbs = 0
    total_filler_words = 0
    total_open_class_words = 0
    total_closed_class_words = 0
    repetitions = 0
    morpheme_count = 0

    previous_word = None
    tokens_alpha_lower = []  # for phrase repetition detection later

    noun_tags = {"NOUN", "PROPN"}
    verb_tags = {"VERB", "AUX"}
    filler_words_tags = {"INTJ"}
    open_class_tags = noun_tags | {"VERB", "ADJ", "ADV"}

    for sentence in doc.sents:
        # We're going to loop through tokens in the sentence and gather all stats
        sentence_nouns = []
        sentence_verbs = []
        sentence_filler_words = []
        sentence_open_class_words = []
        sentence_closed_class_words = []

        for token in sentence:
            if not token.is_alpha:
                continue

            word = token.text
            tag = token.pos_

            # Token counts
            total_tokens += 1
            tokens_alpha_lower.append(word.lower())

            # Nouns
            if tag in noun_tags:
                total_nouns += 1
                sentence_nouns.append(word)

            # Verbs
            if tag in verb_tags:
                total_verbs += 1
                sentence_verbs.append(word)

            # Filler words
            if tag in filler_words_tags:
                total_filler_words += 1
                sentence_filler_words.append(word)

            # Open/closed class words
            if tag in open_class_tags:
                total_open_class_words += 1
                sentence_open_class_words.append(word)
            else:
                sentence_closed_class_words.append(word)
                total_closed_class_words += 1

            # Repetitions (immediate word repeats)
            if word.lower() == previous_word:
                repetitions += 1
            previous_word = word.lower()

            # Morpheme analysis
            base_morphemes = 1  
            bound_morphemes = 0
            morph_dict = token.morph.to_dict()

            if "Number" in morph_dict and morph_dict["Number"] == "Plur":
                bound_morphemes += 1
            if "Tense" in morph_dict:
                if "Past" in morph_dict["Tense"]:
                    bound_morphemes += 1
                if "Pres" in morph_dict["Tense"] and token.tag_ not in ["VBZ", "VBP"]:
                    bound_morphemes += 1
            if "Degree" in morph_dict:
                bound_morphemes += 1
            if "Poss" in morph_dict:
                bound_morphemes += 1

            for suffix, description in DERIVATIONAL_SUFFIXES.items():
                if word.endswith(suffix) and len(word) > len(suffix) + 1:
                    bound_morphemes += 1

            total_morphemes = base_morphemes + bound_morphemes
            morpheme_count += total_morphemes

        # Debug prints (optional)
        print("nouns: " + ", ".join(sentence_nouns))
        print("verbs: " + ", ".join(sentence_verbs))
        print("filler_words: " + ", ".join(sentence_filler_words))
        print("open_class_words: " + ", ".join(sentence_open_class_words))
        print("closed_class_words: " + ", ".join(sentence_closed_class_words))

    open_closed_ratio = (
        total_open_class_words / total_closed_class_words if total_closed_class_words else 0
    )

    # Phrase repetitions (after collecting all lowercased alpha tokens)
    phrase_reps = 0
    i = 0
    n = len(tokens_alpha_lower)
    while i < n:
        event_detected = False
        for L in range(min(5, (n - i) // 2), 1, -1):
            if tokens_alpha_lower[i:i+L] == tokens_alpha_lower[i+L:i+2*L]:
                phrase_reps += 1
                i += 2 * L
                event_detected = True
                break
        if not event_detected:
            i += 1

    return {
        "Total Sentences": len(list(doc.sents)),
        "Total Tokens": total_tokens,
        "Frequency of Nouns": total_nouns,
        "Frequency of Verbs and auxillary verbs": total_verbs,
        "Frequency of Filler Words": total_filler_words,
        "Open-Class Words": total_open_class_words,
        "Closed-Class Words": total_closed_class_words,
        "Open/Closed Class Ratio": round(open_closed_ratio, 3),
        "Total Words": total_open_class_words + total_closed_class_words,
        "Repetition Ratio": round(((repetitions + phrase_reps) / morpheme_count), 3),
    }

def syntactic_complexity_analysis_spacy(text):
    """
    Analyzes the syntactic complexity of a speech/text sample using spaCy.
    """
    doc = nlp(text)

    sentences = list(doc.sents)
    mean_length_of_utterance = sum(len([token for token in sentence if token.is_alpha]) for sentence in sentences) / len(sentences) if sentences else 0

    subordinating_conjunctions = ["although", "because", "since", "unless", "while", "if", "when", "that", "which", "who"]
    embedded_clauses = sum(1 for token in doc if token.text.lower() in subordinating_conjunctions)

    total_verbs = sum(1 for token in doc if token.pos_ in ["VERB", "AUX"])
    verb_index = total_verbs / len(sentences) if sentences else 0

    return {
        "Total Sentences": len(sentences),
        "Mean Length of Utterance (MLU) (Average number of words per sentence)": round(mean_length_of_utterance, 2),
        "Embedded Clauses": embedded_clauses,
        "Verb Index (verbs to utterances ratio)": round(verb_index, 2),
    }

def analyze_semantic_content_with_word_bank(text, bank, speech_duration, similarity_threshold=0.5):
    """
    Identifies words in the text that are semantically similar to words in a word bank.
    """
    doc = nlp(text)
    semantic_units = []

    # Convert bank words into spaCy tokens
    bank_tokens = [nlp(word) for word in bank]

    for token in doc:
        if token.is_alpha and not token.is_stop:  
            token_vector = token.vector
            max_similarity = max(token.similarity(ref) for ref in bank_tokens)

            if max_similarity >= similarity_threshold:
                semantic_units.append(token.text.lower())

    total_words = len([token for token in doc if token.is_alpha])
    num_semantic_units = len(semantic_units)
    idea_density = num_semantic_units / total_words if total_words else 0
    semantic_efficiency = (
        num_semantic_units / speech_duration if speech_duration and speech_duration > 0 else None
    )

    return {
        "Number of Semantic Units": num_semantic_units,
        "Semantic Idea Density (Semantic Units / Total Words)": round(idea_density, 2),
        "Semantic Efficiency (Semantic Units / Speech Duration)": round(semantic_efficiency, 2)
        if semantic_efficiency is not None else "Duration not provided",
    }

def get_average_noun_frequency(transcript, subtlexus_df):
    """
    Retrieves the frequency of nouns
    from the SUBTLEXus dataset, and returns the average frequency of the nouns.
    """
    def extract_nouns(transcript):
        doc = nlp(transcript)
        nouns = [token.text for token in doc if token.pos_ in ['NOUN', 'PROPN']]
        return nouns

    def get_frequency(word, subtlexus_df):
        word = word.lower()
        match = subtlexus_df[subtlexus_df['Word'].str.lower() == word]
        if not match.empty:
            return match['SUBTLWF'].values[0]
        else:
            return 0
    
    nouns = extract_nouns(transcript)
    frequencies = [get_frequency(noun, subtlexus_df) for noun in nouns]
    average_frequency = sum(frequencies) / len(frequencies) if frequencies else 0
    return round(average_frequency, 2)

def analyze_pauses(json, pause_threshold=0.5):
    """
    Analyze pauses based on the time gaps in the transcript.

    Parameters:
    - json (dict): The AWS Transcribe JSON response
    - pause_threshold (float): Minimum gap (in seconds) to be considered a pause

    Returns:
    - list: List of dict objects containing start and end times of pauses
    """

    # Validate the structure of the JSON
    if not isinstance(json, dict):
        raise ValueError("Expected 'json' to be a dictionary.")

    results = json.get('results')
    if not results or not isinstance(results, dict):
        raise ValueError("Missing or invalid 'results' field in JSON.")

    items = results.get('items')
    if not items or not isinstance(items, list):
        raise ValueError("Missing or invalid 'items' field in 'results'.")

    # filter out only 'pronunciation' items, since punctuation has no timing
    words = []
    for item in items:
        if not isinstance(item, dict):
            continue
        if item.get('type') == 'pronunciation':
            # Validate timing keys
            if 'start_time' not in item or 'end_time' not in item:
                continue
            words.append(item)

    pauses = []

    for i in range(len(words) - 1):
        current_word = words[i]
        next_word = words[i + 1]

        try:
            current_end = float(current_word['end_time'])
            next_start = float(next_word['start_time'])
        except (KeyError, ValueError, TypeError) as e:
            # Skip if the time values are missing or invalid
            continue

        gap = next_start - current_end

        # if the gap exceeds the pause threshold, we record it
        if gap >= pause_threshold:
            pause = {
                'StartTime': round(current_end, 2),
                'EndTime': round(next_start, 2)
            }
            pauses.append(pause)

    return pauses
