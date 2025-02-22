import spacy

nlp = spacy.load("en_core_web_lg")

def compute_points(presented_word, recalled_word):
    token1 = nlp(presented_word.lower().strip())
    token2 = nlp(recalled_word.lower().strip())
    similarity = token1.similarity(token2)  
    similarity_percent = similarity * 100
    
    if similarity_percent == 100:
        return 4 # Exact match
    elif similarity_percent < 25:
        return 0 # Completely unrelated words
    elif similarity_percent < 35:
        return 1 # Very weak similarity
    elif similarity_percent < 70:
        return 2 # Weak similarity, but related
    else:
        return 3 # Very similar, almost exact match 
