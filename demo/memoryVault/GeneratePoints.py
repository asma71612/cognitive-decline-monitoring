# import spacy

# nlp = spacy.load("en_core_web_md")

# def compute_points(presented_word, recalled_word):
#     token1 = nlp(presented_word.lower().strip())
#     token2 = nlp(recalled_word.lower().strip())
#     similarity = token1.similarity(token2) # a value between 0 and 1
#     similarity_percent = similarity * 100

#     if similarity_percent < 50:
#         return 1
#     elif similarity_percent < 70:
#         return 2
#     elif similarity_percent < 95:
#         return 3
#     else:
#         return 4

import spacy

nlp = spacy.load("en_core_web_lg")

def compute_points(presented_word, recalled_word):
    token1 = nlp(presented_word.lower().strip())
    token2 = nlp(recalled_word.lower().strip())
    similarity = token1.similarity(token2)  
    similarity_percent = similarity * 100
    
    if similarity_percent == 100:
        return similarity_percent, 4 # Exact match
    elif similarity_percent < 25:
        return similarity_percent, 0 # Completely unrelated words
    elif similarity_percent < 35:
        return similarity_percent, 1 # Very weak similarity
    elif similarity_percent < 70:
        return similarity_percent, 2 # Weak similarity, but related
    else:
        return similarity_percent, 3 # Very similar, almost exact match 
