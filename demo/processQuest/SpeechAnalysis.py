import spacy
from collections import Counter
import pandas as pd
from statistics import median

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

def analyze_text(text, subtlexus_df=None):
    """
    Consolidated analysis of lexical content, syntactic complexity, and noun frequency.
    
    Args:
        text (str): Transcript text.
        subtlexus_df (pd.DataFrame): SUBTLEXus dataset (optional).
    
    Returns:
        dict: Aggregated analysis results.
    """
    doc = nlp(text)
    
    ### Initialize counts and containers
    total_tokens = 0
    total_nouns = 0
    total_verbs = 0
    total_filler_words = 0
    total_open_class_words = 0
    total_closed_class_words = 0
    repetitions = 0
    morpheme_count = 0
    phrase_reps = 0
    
    noun_tags = {"NOUN", "PROPN"}
    verb_tags = {"VERB", "AUX"}
    filler_words_tags = {"INTJ"}
    open_class_tags = noun_tags | {"VERB", "ADJ", "ADV"}
    
    previous_word = None
    tokens_alpha_lower = []
    
    sentences = list(doc.sents)
    subordinating_conjunctions = {"although", "because", "since", "unless", "while", "if", "when", "that", "which", "who"}
    
    embedded_clauses = 0
    total_sentence_words = 0
    total_verbs_doc = 0
    
    nouns_for_frequency = []
    
    ### Loop through sentences and tokens
    for sentence in sentences:
        for token in sentence:
            if not token.is_alpha:
                continue
            
            word = token.text
            tag = token.pos_
            
            # Token counts
            total_tokens += 1
            tokens_alpha_lower.append(word.lower())
            
            # Nouns & verbs
            if tag in noun_tags:
                total_nouns += 1
                nouns_for_frequency.append(word)
            if tag in verb_tags:
                total_verbs += 1
            
            # Filler words
            if tag in filler_words_tags:
                total_filler_words += 1
            
            # Open/closed class words
            if tag in open_class_tags:
                total_open_class_words += 1
            else:
                total_closed_class_words += 1
            
            # Repetitions (immediate)
            if word.lower() == previous_word:
                repetitions += 1
            previous_word = word.lower()
            
            # Morphemes
            base_morphemes = 1
            bound_morphemes = 0
            morph_dict = token.morph.to_dict()
            
            if morph_dict.get("Number") == "Plur":
                bound_morphemes += 1
            if "Tense" in morph_dict:
                if "Past" in morph_dict["Tense"]:
                    bound_morphemes += 1
                if "Pres" in morph_dict["Tense"] and token.tag_ not in ["VBZ", "VBP"]:
                    bound_morphemes += 1
            if morph_dict.get("Degree"):
                bound_morphemes += 1
            if morph_dict.get("Poss"):
                bound_morphemes += 1
            
            for suffix in DERIVATIONAL_SUFFIXES.keys():
                if word.endswith(suffix) and len(word) > len(suffix) + 1:
                    bound_morphemes += 1
            
            total_morphemes = base_morphemes + bound_morphemes
            morpheme_count += total_morphemes
        
        # Syntactic complexity sentence analysis
        sentence_words = len([token for token in sentence if token.is_alpha])
        total_sentence_words += sentence_words
        
    # Embedded clauses & verbs (document-level)
    embedded_clauses = sum(1 for token in doc if token.text.lower() in subordinating_conjunctions)
    total_verbs_doc = total_verbs
    num_sentences = len(sentences)
    
    # Mean length of utterance & verb index
    mean_length_of_utterance = (total_sentence_words / num_sentences) if num_sentences else 0
    verb_index = (total_verbs_doc / num_sentences) if num_sentences else 0
    
    # Open/Closed class ratio
    open_closed_ratio = (total_open_class_words / total_closed_class_words) if total_closed_class_words else 0
    
    # Phrase repetitions
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
    
    repetition_ratio = ((repetitions + phrase_reps) / morpheme_count) if morpheme_count else 0
    
    # Average noun frequency from SUBTLEXus
    median_noun_frequency = None
    if subtlexus_df is not None and not subtlexus_df.empty:
        frequencies = []
        for noun in nouns_for_frequency:
            match = subtlexus_df[subtlexus_df['Word'].str.lower() == noun.lower()]
            freq = match['SUBTLWF'].values[0] if not match.empty else 0
            frequencies.append(freq)
        median_noun_frequency = median(frequencies) if frequencies else 0
    
    total_words = total_open_class_words + total_closed_class_words

    # Results
    return {
        # Lexical content
        "Total Sentences": num_sentences,
        "Total Tokens": total_tokens,
        "Frequency of Nouns": round(total_nouns/total_words, 3),
        "Frequency of Verbs and auxillary verbs": round(total_verbs_doc/total_words, 3),
        "Frequency of Filler Words": round(total_filler_words/total_words, 3),
        "Open-Class Words": round(total_open_class_words/total_words, 3),
        "Closed-Class Words": round(total_closed_class_words/total_words, 3),
        "Open/Closed Class Ratio": round(open_closed_ratio, 3),
        "Total Words": total_open_class_words + total_closed_class_words,
        "Repetition Ratio": round(repetition_ratio, 3),
        
        # Syntactic complexity
        "Mean Length of Utterance (MLU) (Average number of words per sentence)": round(mean_length_of_utterance, 2),
        "Embedded Clauses": embedded_clauses,
        "Verb Index (verbs to utterances ratio)": round(verb_index, 2),
        
        # Average noun frequency
        "Median Noun Frequency": round(median_noun_frequency, 2) if median_noun_frequency is not None else "N/A"
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
    
    # Ensure semantic units are unique
    semantic_units = list(set(semantic_units))

    total_words = len([token for token in doc if token.is_alpha])
    num_semantic_units = len(semantic_units)
    idea_density = num_semantic_units / total_words if total_words else 0
    semantic_efficiency = (
        num_semantic_units / speech_duration if speech_duration and speech_duration > 0 else None
    )

    return {
        "Semantic Units": ", ".join(semantic_units),
        "Semantic Idea Density": round(idea_density, 2),
        "Semantic Efficiency": round(semantic_efficiency, 2)
        if semantic_efficiency is not None else "Duration not provided",
    }

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
