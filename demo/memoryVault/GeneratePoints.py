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

def compute_total_score(presented: str, recalled: str, hintsUsed: int) -> int:
    presented_words = [word.strip() for word in presented.split(",")]
    recalled_words = [word.strip() for word in recalled.split(",")]

    if len(presented_words) != 3 or len(recalled_words) != 3:
        raise ValueError("Presented and recalled must contain exactly 3 words separated by commas.")

    total_score = sum(compute_points(pw, rw) for pw, rw in zip(presented_words, recalled_words))

    # ensuring score doesn't go below 0
    return max(total_score - hintsUsed, 0)
