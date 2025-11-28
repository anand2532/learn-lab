// Course content data - separated for better organization

export interface CourseSegment {
  title: string;
  content: string;
  code?: string;
  has3D?: boolean;
  hasPipeline?: boolean;
}

export interface Subtopic {
  id: string;
  title: string;
  content: string;
  code?: string;
  has3D?: boolean;
  completed?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  subtopics?: Subtopic[];
  content?: string;
  code?: string;
  has3D?: boolean;
  hasPipeline?: boolean;
  completed?: boolean;
}

export interface CourseData {
  title: string;
  description: string;
  topics: Topic[];
  pipelineSteps: Array<{
    id: string;
    title: string;
    description: string;
    color: string;
  }>;
  segments: Record<string, CourseSegment>;
}

export const courseContent: Record<string, CourseData> = {
  "course-1": {
    title: "From Words to Vectors",
    description: "Understanding how machines understand text",
    topics: [
      {
        id: "intro",
        title: "Introduction",
        description: "Get started with word embeddings and understand the fundamentals",
        completed: true,
        hasPipeline: true,
        subtopics: [
          {
            id: "intro-overview",
            title: "What are Word Embeddings?",
            content: `# What are Word Embeddings?

Word embeddings are a type of word representation that allows words with similar meaning to have a similar representation. They are a distributed representation for text that is perhaps one of the key breakthroughs for the impressive performance of deep learning methods on challenging natural language processing problems.

## Key Concepts

### Dense Vectors
Each word is represented as a dense vector (typically 100-300 dimensions) instead of sparse one-hot vectors.

### Semantic Similarity
Words with similar meanings are close in vector space. This allows us to perform mathematical operations on words!

### Context Awareness
Embeddings capture contextual relationships between words based on their usage patterns.

## Mathematical Foundation

Word embeddings map each word $w_i$ in vocabulary $V$ to a dense vector in $\\mathbb{R}^d$:

$$E: V \\rightarrow \\mathbb{R}^d$$

where $d$ is the embedding dimension (typically 100-300). For a vocabulary of size $|V|$, we learn an embedding matrix:

$$W \\in \\mathbb{R}^{|V| \\times d}$$

Each row $W_i$ represents the embedding vector for word $w_i$.

\`\`\`3d:type=embedding-space,title=Word Embedding Space,description=Interactive 3D visualization showing how semantically similar words cluster together in the embedding space
\`\`\`

## Why Do We Need Word Embeddings?

Traditional NLP approaches used sparse representations:
- **One-hot encoding**: Creates very high-dimensional vectors
- **Bag of Words**: Loses word order and context
- **TF-IDF**: Better but still sparse

> **Key Insight**: The curse of dimensionality means that as the vocabulary size $|V|$ grows, one-hot vectors become extremely sparse. For $|V| = 100,000$ words, each vector has 99,999 zeros!

Word embeddings solve these problems by:
1. Reducing dimensionality from $|V|$ to $d$ where $d \\ll |V|$
2. Capturing semantic relationships through similarity metrics like cosine similarity
3. Preserving context information through distributional semantics`,
            code: `# Example: Understanding word embeddings
import numpy as np

# Traditional one-hot encoding
words = ["cat", "dog", "bird"]
vocab_size = len(words)

# One-hot vectors (sparse, high-dimensional)
one_hot_cat = [1, 0, 0]
one_hot_dog = [0, 1, 0]
one_hot_bird = [0, 0, 1]

print("One-hot encoding:")
print(f"Cat: {one_hot_cat}")
print(f"Dog: {one_hot_dog}")
print(f"Bird: {one_hot_bird}")

# Word embeddings (dense, semantic)
# In practice, these are learned from data
word_embeddings = {
    "cat": [0.2, 0.8, 0.1],
    "dog": [0.3, 0.7, 0.2],
    "bird": [0.1, 0.2, 0.9]
}

print("\nWord embeddings (dense, semantic):")
for word, embedding in word_embeddings.items():
    print(f"{word}: {embedding}")`,
            has3D: true,
            completed: true,
          },
          {
            id: "intro-pipeline",
            title: "Word to Vector Pipeline",
            content: `# Word to Vector Pipeline

Understanding the complete pipeline from raw text to word vectors is crucial for mastering word embeddings.

## Pipeline Overview

The process of converting words to vectors involves several key steps:

\`\`\`mermaid
flowchart LR
    A[Raw Text] --> B[Tokenization]
    B --> C[Vocabulary Building]
    C --> D[One-Hot Encoding]
    D --> E[Neural Network]
    E --> F[Dense Embeddings]
    F --> G[Vector Space]
    
    style A fill:#3b82f6
    style G fill:#10b981
    style E fill:#f59e0b
\`\`\`

## Step-by-Step Process

### 1. Text Input
Raw text corpus containing sentences and documents.

### 2. Tokenization
Split text into individual words or tokens. This involves:
- Lowercasing
- Removing punctuation
- Handling special cases

### 3. Vocabulary Building
Create a dictionary of all unique words in the corpus. Each word gets a unique index.

### 4. One-Hot Encoding (Initial)
Convert words to one-hot vectors for input to the neural network.

### 5. Neural Network Training
Train a shallow neural network (Word2Vec) to learn relationships between words.

### 6. Dense Embeddings
Extract the learned dense vectors from the hidden layer.

### 7. Vector Space
Words are now represented in a continuous vector space where similar words are close together.`,
            code: `# Word to Vector Pipeline Example
def word_to_vector_pipeline(text):
    """
    Simplified pipeline showing the transformation process
    """
    # Step 1: Tokenization
    tokens = text.lower().split()
    print(f"Step 1 - Tokens: {tokens}")
    
    # Step 2: Build vocabulary
    vocab = {word: idx for idx, word in enumerate(set(tokens))}
    print(f"Step 2 - Vocabulary: {vocab}")
    
    # Step 3: One-hot encoding
    one_hot = {}
    for word in vocab:
        vector = [0] * len(vocab)
        vector[vocab[word]] = 1
        one_hot[word] = vector
        print(f"Step 3 - {word}: {vector}")
    
    # Step 4: In practice, neural network learns embeddings
    # Here we simulate with random embeddings
    import numpy as np
    np.random.seed(42)
    embeddings = {}
    for word in vocab:
        # Simulated dense embedding (3D for visualization)
        embeddings[word] = np.random.rand(3).tolist()
        print(f"Step 4 - {word} embedding: {embeddings[word]}")
    
    return tokens, vocab, one_hot, embeddings

# Example
text = "the cat sat on the mat"
tokens, vocab, one_hot, embeddings = word_to_vector_pipeline(text)`,
            completed: true,
          },
        ],
      },
      {
        id: "why-vectors",
        title: "Why Word Vectors?",
        description: "Understanding the motivation and benefits of word embeddings",
        completed: true,
        subtopics: [
          {
            id: "why-problems",
            title: "Problems with Traditional Methods",
            content: `# Problems with Traditional Methods

Traditional NLP methods face several fundamental challenges that word embeddings solve.

## 1. Curse of Dimensionality

The curse of dimensionality states that as the number of dimensions increases, the volume of the space increases exponentially, making data sparse.

For one-hot encoding with vocabulary size $|V|$:
- Vector dimension: $|V|$
- Non-zero elements: 1
- Sparsity: $\\frac{|V|-1}{|V|} \\approx 1$ for large $|V|$

**Example**: For $|V| = 100,000$ words, each vector has 99,999 zeros!

### Mathematical Comparison

**One-Hot Encoding**:
$$\\vec{w}_{\\text{one-hot}} = [0, 0, \\ldots, 1, \\ldots, 0]^T \\in \\{0,1\\}^{|V|}$$

**Word Embedding**:
$$\\vec{w}_{\\text{embedding}} = [e_1, e_2, \\ldots, e_d]^T \\in \\mathbb{R}^d$$

where $d \\ll |V|$ (typically $d = 100-300$).

## 2. No Semantic Relationships

In one-hot encoding, the distance between any two distinct words is identical:

$$||\\vec{w}_i - \\vec{w}_j||_2 = \\sqrt{2} \\quad \\forall i \\neq j$$

This means "king" and "queen" are as distant as "king" and "apple", despite their semantic relationship!

## 3. Context Loss

Traditional methods like Bag of Words (BoW) lose word order and context:

**BoW**: "Dog bites man" $\\equiv$ "Man bites dog"

Word embeddings, through distributional semantics, capture context:
$$P(w|\\text{context}) \\approx f(\\vec{w}, \\{\\vec{c}_i\\})$$`,
            code: `# Comparing one-hot vs word embeddings
import numpy as np

# One-hot encoding (sparse)
vocab = ["king", "queen", "man", "woman", "apple"]
vocab_size = len(vocab)

def one_hot(word):
    idx = vocab.index(word)
    vector = [0] * vocab_size
    vector[idx] = 1
    return vector

# Word embeddings (dense, semantic)
# These are simplified examples - real embeddings are learned
word_embeddings = {
    "king": [0.5, 0.3, 0.1],
    "queen": [0.5, 0.3, 0.2],
    "man": [0.4, 0.2, 0.1],
    "woman": [0.4, 0.2, 0.2],
    "apple": [0.1, 0.8, 0.9]
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare similarities
king = word_embeddings["king"]
queen = word_embeddings["queen"]
apple = word_embeddings["apple"]

print("One-hot encoding distances:")
print(f"King-Queen: {np.linalg.norm(np.array(one_hot('king')) - np.array(one_hot('queen'))):.3f}")
print(f"King-Apple: {np.linalg.norm(np.array(one_hot('king')) - np.array(one_hot('apple'))):.3f}")

print("\nWord embedding similarities:")
print(f"King-Queen similarity: {cosine_similarity(king, queen):.3f}")
print(f"King-Apple similarity: {cosine_similarity(king, apple):.3f}")`,
            completed: true,
          },
          {
            id: "why-benefits",
            title: "Benefits of Word Vectors",
            content: `# Benefits of Word Vectors

Word vectors provide several key advantages over traditional methods.

## 1. Dense Representation

Space complexity reduction:
- **One-hot**: $O(|V|)$ per word
- **Embedding**: $O(d)$ per word where $d \\ll |V|$

Storage savings: For $|V| = 100,000$ and $d = 300$, we save $\\frac{100,000 - 300}{100,000} = 99.7\\%$ space!

## 2. Semantic Similarity

Words with similar meanings cluster together in embedding space. The distance between vectors reflects semantic distance:

$$\\text{distance}(\\vec{w}_i, \\vec{w}_j) \\propto -\\text{semantic\_similarity}(w_i, w_j)$$

## 3. Mathematical Operations

The famous word analogy:

$$\\vec{w}_{\\text{king}} - \\vec{w}_{\\text{man}} + \\vec{w}_{\\text{woman}} \\approx \\vec{w}_{\\text{queen}}$$

This works because embeddings capture relationships as geometric transformations in vector space.

\`\`\`mermaid
graph TB
    A[King] -->|Man Relationship| B[Queen]
    C[Man] -->|Gender| D[Woman]
    A -.->|Vector Arithmetic| E[King - Man + Woman]
    E -->|≈| B
    
    style A fill:#ef4444
    style B fill:#ec4899
    style E fill:#10b981
\`\`\`

## 4. Transfer Learning

Pre-trained embeddings capture general linguistic knowledge and can be fine-tuned for specific tasks, reducing training time and data requirements.

\`\`\`3d:type=embedding-space,title=Semantic Relationships in 3D,description=Visualizing how word relationships form geometric patterns in embedding space
\`\`\``,
            code: `# Demonstrating word vector benefits
import numpy as np

# Simulated word embeddings showing semantic relationships
embeddings = {
    "king": np.array([0.5, 0.3, 0.1]),
    "queen": np.array([0.5, 0.3, 0.2]),
    "man": np.array([0.4, 0.2, 0.1]),
    "woman": np.array([0.4, 0.2, 0.2]),
    "prince": np.array([0.5, 0.25, 0.15]),
    "princess": np.array([0.5, 0.25, 0.18])
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 1. Semantic similarity
print("1. Semantic Similarity:")
print(f"King-Queen: {cosine_similarity(embeddings['king'], embeddings['queen']):.3f}")
print(f"King-Man: {cosine_similarity(embeddings['king'], embeddings['man']):.3f}")
print(f"King-Prince: {cosine_similarity(embeddings['king'], embeddings['prince']):.3f}")

# 2. Word arithmetic (king - man + woman ≈ queen)
result = embeddings['king'] - embeddings['man'] + embeddings['woman']
print("\n2. Word Arithmetic:")
print(f"King - Man + Woman = {result}")
print(f"Similarity to Queen: {cosine_similarity(result, embeddings['queen']):.3f}")

# 3. Finding similar words
def find_most_similar(target, embeddings_dict, top_n=3):
    similarities = []
    for word, vec in embeddings_dict.items():
        if word != target:
            sim = cosine_similarity(embeddings_dict[target], vec)
            similarities.append((word, sim))
    return sorted(similarities, key=lambda x: x[1], reverse=True)[:top_n]

print("\n3. Most Similar Words:")
for word, sim in find_most_similar('king', embeddings):
    print(f"  {word}: {sim:.3f}")`,
            has3D: true,
            completed: true,
          },
        ],
      },
      {
        id: "one-hot",
        title: "One-Hot Encoding",
        description: "Understanding the simplest word representation method",
        completed: true,
        subtopics: [
          {
            id: "one-hot-basics",
            title: "One-Hot Encoding Basics",
            content: `# One-Hot Encoding Basics

One-hot encoding is the simplest way to represent words as vectors. Each word is represented as a binary vector where only one element is 1 and all others are 0.

## How It Works

1. Create a vocabulary of all unique words
2. Assign each word a unique index
3. Create a vector where only the word's index position is 1

## Example

For vocabulary: ["cat", "dog", "bird"]
- "cat" → [1, 0, 0]
- "dog" → [0, 1, 0]
- "bird" → [0, 0, 1]

## Mathematical Representation

For vocabulary $V = \\{w_1, w_2, \\ldots, w_{|V|}\\}$, the one-hot encoding of word $w_i$ is:

$$\\vec{v}_i = [0, 0, \\ldots, 1, \\ldots, 0]^T$$

where the 1 is at position $i$.

## Properties

- **Sparsity**: Only one non-zero element
- **Orthogonality**: All vectors are orthogonal (dot product = 0)
- **High Dimensionality**: Dimension equals vocabulary size`,
            code: `# One-Hot Encoding Implementation
def create_one_hot_encoding(corpus):
    # Build vocabulary
    words = set()
    for sentence in corpus:
        words.update(sentence.lower().split())
    
    vocab = sorted(list(words))
    vocab_to_idx = {word: idx for idx, word in enumerate(vocab)}
    
    def encode(sentence):
        vector = [0] * len(vocab)
        for word in sentence.lower().split():
            if word in vocab_to_idx:
                vector[vocab_to_idx[word]] = 1
        return vector
    
    return encode, vocab

# Example usage
corpus = [
    "the cat sat on the mat",
    "the dog played in the park",
    "the bird flew in the sky"
]

encode, vocab = create_one_hot_encoding(corpus)

print("Vocabulary:", vocab)
print("\nOne-hot encoding for 'the cat sat':")
print(encode("the cat sat"))
print("\nOne-hot encoding for 'the dog':")
print(encode("the dog"))`,
            completed: true,
          },
          {
            id: "one-hot-limitations",
            title: "Limitations of One-Hot Encoding",
            content: `# Limitations of One-Hot Encoding

While simple, one-hot encoding has significant limitations that motivate the need for word embeddings.

## 1. High Dimensionality

Vector size = vocabulary size. For large vocabularies (100K+ words), this creates extremely high-dimensional vectors.

**Storage**: $O(|V|)$ per word
**Memory**: For 1M words, each vector is 1M dimensions!

## 2. No Relationships

All words are equally distant. The distance between "king" and "queen" is the same as "king" and "apple":

$$||\\vec{v}_{\\text{king}} - \\vec{v}_{\\text{queen}}||_2 = ||\\vec{v}_{\\text{king}} - \\vec{v}_{\\text{apple}}||_2 = \\sqrt{2}$$

## 3. Sparse Representation

Mostly zeros, inefficient storage:
- **Density**: $\\frac{1}{|V|}$ (only one 1, rest zeros)
- **For $|V| = 100,000$**: 99.999% zeros!

## 4. No Semantics

Cannot capture:
- Word meaning
- Context
- Relationships
- Similarity

## 5. Curse of Dimensionality

As vocabulary grows, the space becomes increasingly sparse, making it harder to find patterns and relationships.

## When to Use

One-hot encoding is still useful for:
- Small vocabularies (< 1000 words)
- Simple classification tasks
- As a baseline for comparison
- When interpretability is crucial`,
            code: `# Demonstrating one-hot encoding limitations
import numpy as np

vocab = ["king", "queen", "man", "woman", "prince", "princess", "apple", "orange"]
vocab_size = len(vocab)

def one_hot(word):
    idx = vocab.index(word)
    vector = [0] * vocab_size
    vector[idx] = 1
    return np.array(vector)

# Problem 1: High dimensionality
print("Problem 1: High Dimensionality")
print(f"Vocabulary size: {vocab_size}")
print(f"Vector dimension: {vocab_size}")
print(f"Storage per word: {vocab_size * 4} bytes (assuming float32)")

# Problem 2: No relationships
print("\nProblem 2: No Semantic Relationships")
king_vec = one_hot("king")
queen_vec = one_hot("queen")
apple_vec = one_hot("apple")

print(f"Distance(king, queen): {np.linalg.norm(king_vec - queen_vec):.3f}")
print(f"Distance(king, apple): {np.linalg.norm(king_vec - apple_vec):.3f}")
print("→ Same distance despite semantic relationship!")

# Problem 3: Sparsity
print("\nProblem 3: Sparsity")
sparsity = (vocab_size - 1) / vocab_size
print(f"Sparsity: {sparsity * 100:.2f}%")
print(f"Non-zero elements: 1 out of {vocab_size}")

# Problem 4: No mathematical operations
print("\nProblem 4: No Meaningful Operations")
# One-hot vectors don't support meaningful arithmetic
result = king_vec - one_hot("man") + one_hot("woman")
print(f"King - Man + Woman (one-hot): {result}")
print("→ Doesn't give meaningful result!")`,
            completed: true,
          },
        ],
      },
      {
        id: "word2vec",
        title: "Word2Vec Overview",
        description: "Introduction to Word2Vec architecture and training",
        completed: false,
        subtopics: [
          {
            id: "word2vec-intro",
            title: "Word2Vec Introduction",
            content: `# Word2Vec Overview

Word2Vec is a popular technique for learning word embeddings. It was introduced by Mikolov et al. at Google in 2013.

## Key Innovation

Word2Vec learns word embeddings by predicting words from their context, or context from words. This simple idea produces high-quality embeddings.

## Two Main Architectures

### 1. Continuous Bag of Words (CBOW)
- Predicts the target word from context
- Faster training
- Better for frequent words

### 2. Skip-gram
- Predicts context from target word
- Better for rare words
- More accurate overall

## Key Ideas

1. **Distributional Hypothesis**: Words that appear in similar contexts have similar meanings
2. **Neural Network**: Uses a shallow neural network to learn embeddings
3. **Negative Sampling**: Efficient training technique
4. **Hierarchical Softmax**: Alternative to negative sampling

## Advantages

- Fast training
- Good quality embeddings
- Pre-trained models available
- Works well with small datasets

## Training Process

1. Take a large corpus of text
2. Create training pairs (word, context)
3. Train neural network to predict context
4. Extract embeddings from hidden layer`,
            code: `# Word2Vec Concept Demonstration
# This is a simplified explanation of how Word2Vec works

# Simplified vocabulary
vocab = ["king", "queen", "man", "woman", "prince", "princess"]

# Context window example
# "The king and queen" - king and queen are context for each other
context_pairs = [
    ("king", "queen"),
    ("man", "woman"),
    ("prince", "princess"),
    ("king", "man"),
    ("queen", "woman")
]

# Word2Vec learns that words appearing in similar contexts
# should have similar embeddings
print("Context pairs that Word2Vec learns from:")
for word1, word2 in context_pairs:
    print(f"{word1} <-> {word2}")

# After training, similar words will have similar vectors
# This allows for semantic operations like:
# king - man + woman ≈ queen

print("\nKey insight: Words in similar contexts → Similar embeddings")`,
            completed: false,
          },
          {
            id: "word2vec-architecture",
            title: "Word2Vec Architecture",
            content: `# Word2Vec Architecture

Understanding the neural network architecture behind Word2Vec.

## Network Structure

Word2Vec uses a shallow (2-layer) neural network:

\`\`\`mermaid
graph LR
    A[Input Layer<br/>One-Hot] -->|W| B[Hidden Layer<br/>Embeddings]
    B -->|W'| C[Output Layer<br/>Softmax]
    C --> D[Context Prediction]
    
    style A fill:#3b82f6
    style B fill:#10b981
    style C fill:#f59e0b
\`\`\`

## Components

### Input Layer
- One-hot encoded word vector
- Size: $|V|$ (vocabulary size)

### Hidden Layer
- Linear transformation: $\\vec{h} = W^T \\vec{x}$
- Size: $d$ (embedding dimension, typically 100-300)
- **This is where embeddings are learned!**

### Output Layer
- Softmax over vocabulary
- Predicts context words (Skip-gram) or target word (CBOW)

## Weight Matrices

- **$W$**: Input-to-hidden weights ($|V| \\times d$)
  - Each row is an embedding vector
- **$W'$**: Hidden-to-output weights ($d \\times |V|$)
  - Used for prediction

## Training Objective

Maximize the probability of predicting correct context words:

$$\\mathcal{L} = \\sum_{(w, c) \\in D} \\log P(c | w)$$

where $D$ is the set of (word, context) pairs.`,
            code: `# Word2Vec Architecture Visualization
import numpy as np

# Simplified example
vocab_size = 10000  # Vocabulary size
embedding_dim = 300  # Embedding dimension

# Weight matrices
W = np.random.randn(vocab_size, embedding_dim)  # Input to hidden
W_prime = np.random.randn(embedding_dim, vocab_size)  # Hidden to output

print("Word2Vec Architecture:")
print(f"Input layer size: {vocab_size} (vocabulary size)")
print(f"Hidden layer size: {embedding_dim} (embedding dimension)")
print(f"Output layer size: {vocab_size} (vocabulary size)")
print(f"\nWeight matrix W shape: {W.shape}")
print(f"Weight matrix W' shape: {W_prime.shape}")

# Forward pass example
def forward_pass(word_idx, W, W_prime):
    # One-hot input
    x = np.zeros(vocab_size)
    x[word_idx] = 1
    
    # Hidden layer (embedding)
    h = W[word_idx]  # Direct lookup (matrix multiplication with one-hot)
    
    # Output layer
    logits = W_prime.T @ h
    probs = np.exp(logits) / np.sum(np.exp(logits))  # Softmax
    
    return h, probs

# Example: Get embedding for word at index 0
embedding, probs = forward_pass(0, W, W_prime)
print(f"\nEmbedding vector shape: {embedding.shape}")
print(f"Embedding sample (first 5 values): {embedding[:5]}")`,
            completed: false,
          },
        ],
      },
      {
        id: "skip-gram",
        title: "Skip-gram Model",
        description: "Deep dive into the Skip-gram architecture",
        completed: false,
        subtopics: [
          {
            id: "skip-gram-basics",
            title: "Skip-gram Basics",
            content: `# Skip-gram Model

The Skip-gram model predicts surrounding context words given a target word. It's particularly effective for learning word representations.

## Architecture

The Skip-gram model uses a shallow neural network with:

1. **Input Layer**: One-hot encoded target word $\\vec{x} \\in \\{0,1\\}^{|V|}$
2. **Hidden Layer**: Linear transformation (embedding lookup) to get $\\vec{h} = W^T\\vec{x} \\in \\mathbb{R}^d$
3. **Output Layer**: Softmax over vocabulary to predict context words

### Mathematical Formulation

Given a target word $w_t$ and context window of size $C$, we want to predict context words $w_{t-c}, \\ldots, w_{t+c}$ (excluding $w_t$).

The objective is to maximize:

$$\\mathcal{L} = \\frac{1}{T}\\sum_{t=1}^{T} \\sum_{-c \\leq j \\leq c, j \\neq 0} \\log P(w_{t+j} | w_t)$$

where $P(w_{t+j} | w_t)$ is computed using softmax:

$$P(w_O | w_I) = \\frac{\\exp(\\vec{v}'_{w_O}^T \\vec{v}_{w_I})}{\\sum_{w=1}^{|V|} \\exp(\\vec{v}'_{w}^T \\vec{v}_{w_I})}$$

Here:
- $\\vec{v}_{w_I}$: input embedding (hidden layer)
- $\\vec{v}'_{w_O}$: output embedding (output layer)
- $|V|$: vocabulary size

\`\`\`mermaid
graph LR
    A[One-Hot Input] -->|W| B[Hidden Layer<br/>d dimensions]
    B -->|W'| C[Output Layer<br/>|V| dimensions]
    C --> D[Softmax]
    D --> E[Context Words]
    
    style A fill:#3b82f6
    style B fill:#10b981
    style C fill:#f59e0b
    style D fill:#ef4444
\`\`\`

## Training Process

1. Take a target word (e.g., "king")
2. Sample context words from a window (e.g., ±2 words)
3. Train the model to predict these context words
4. Update embeddings using backpropagation

### Example Training Pair

Sentence: "The quick brown fox jumps"

For target word "brown" with window size $c = 2$:
- Context words: "quick", "fox", "jumps"
- Training pairs: (brown, quick), (brown, fox), (brown, jumps)`,
            code: `# Skip-gram Model Concept
# Simplified explanation of skip-gram training

def create_skip_gram_pairs(sentence, window_size=2):
    """
    Create (target, context) pairs for skip-gram training
    """
    words = sentence.lower().split()
    pairs = []
    
    for i, target in enumerate(words):
        # Get context words within window
        start = max(0, i - window_size)
        end = min(len(words), i + window_size + 1)
        
        for j in range(start, end):
            if j != i:  # Don't include target as context
                pairs.append((target, words[j]))
    
    return pairs

# Example
sentence = "the quick brown fox jumps over the lazy dog"
pairs = create_skip_gram_pairs(sentence, window_size=2)

print("Skip-gram training pairs:")
print(f"Total pairs: {len(pairs)}")
print("\nFirst 10 pairs:")
for target, context in pairs[:10]:
    print(f"({target}, {context})")

print("\nFor target word 'brown':")
brown_pairs = [p for p in pairs if p[0] == 'brown']
for target, context in brown_pairs:
    print(f"  Predict: {context} given {target}")`,
            completed: false,
          },
          {
            id: "skip-gram-negative-sampling",
            title: "Negative Sampling",
            content: `# Negative Sampling

Computing softmax over $|V|$ is expensive. Negative sampling approximates this efficiently.

## The Problem

Standard softmax requires computing:

$$P(w_O | w_I) = \\frac{\\exp(\\vec{v}'_{w_O}^T \\vec{v}_{w_I})}{\\sum_{w=1}^{|V|} \\exp(\\vec{v}'_{w}^T \\vec{v}_{w_I})}$$

This requires $O(|V|)$ operations per training example, which is expensive for large vocabularies.

## Negative Sampling Solution

Instead of computing full softmax, we:
1. Sample positive example (actual context word)
2. Sample $K$ negative examples (random words)
3. Train binary classifier to distinguish positive from negatives

### Objective Function

$$\\log P(w_O | w_I) = \\log \\sigma(\\vec{v}'_{w_O}^T \\vec{v}_{w_I}) + \\sum_{k=1}^{K} \\mathbb{E}_{w_k \\sim P_n(w)}[\\log \\sigma(-\\vec{v}'_{w_k}^T \\vec{v}_{w_I})]$$

where:
- $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ (sigmoid function)
- $K$: number of negative samples (typically 5-20)
- $P_n(w)$: noise distribution (usually unigram distribution $\\frac{3}{4}$)

## Advantages

- **Efficiency**: $O(K + 1)$ instead of $O(|V|)$
- **Speed**: Makes training $\\frac{|V|}{K+1}$ times faster!
- **Quality**: Produces similar quality embeddings

## Hyperparameters

- **Window Size** ($c$): Typically 5-10
- **Embedding Dimension** ($d$): 100-300
- **Negative Samples** ($K$): 5-20
- **Learning Rate** ($\\alpha$): 0.01-0.05

### Training Complexity

- **Without negative sampling**: $O(|V|)$ per training example
- **With negative sampling**: $O(K + 1)$ per training example

For $|V| = 100,000$ and $K = 5$, this is $\\frac{100,000}{6} \\approx 16,667$ times faster!`,
            code: `# Negative Sampling Example
import numpy as np
import random

# Simplified vocabulary
vocab = ["king", "queen", "man", "woman", "prince", "princess", "apple", "orange", "cat", "dog"]
vocab_size = len(vocab)
vocab_to_idx = {word: idx for idx, word in enumerate(vocab)}

# Unigram distribution (simplified - in practice, use actual word frequencies)
word_freq = {word: 1.0 for word in vocab}  # Equal frequency for simplicity
total_freq = sum(word_freq.values())
unigram_dist = {word: freq / total_freq for word, word_freq in word_freq.items()}

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def negative_sampling(target_word, context_word, vocab, vocab_to_idx, K=5):
    """
    Simulate negative sampling training step
    """
    target_idx = vocab_to_idx[target_word]
    context_idx = vocab_to_idx[context_word]
    
    # Positive example
    print(f"Positive: ({target_word}, {context_word})")
    
    # Sample K negative examples
    negative_words = []
    while len(negative_words) < K:
        # Sample from unigram distribution
        word = random.choices(list(vocab), weights=list(unigram_dist.values()))[0]
        if word != context_word and word not in negative_words:
            negative_words.append(word)
    
    print(f"Negative samples (K={K}):")
    for neg_word in negative_words:
        print(f"  ({target_word}, {neg_word})")
    
    return negative_words

# Example
print("Negative Sampling Example:")
print("=" * 50)
negative_sampling("king", "queen", vocab, vocab_to_idx, K=5)

print("\n" + "=" * 50)
print("Key Insight:")
print(f"Instead of computing softmax over {vocab_size} words,")
print(f"we only compute {5 + 1} sigmoid operations!")
print(f"Speedup: ~{vocab_size // 6}x faster")`,
            completed: false,
          },
        ],
      },
      {
        id: "cbow",
        title: "CBOW Model",
        description: "Understanding the Continuous Bag of Words model",
        completed: false,
        subtopics: [
          {
            id: "cbow-basics",
            title: "CBOW Basics",
            content: `# Continuous Bag of Words (CBOW)

CBOW predicts the target word from surrounding context words. It's faster to train than Skip-gram but slightly less accurate.

## Architecture

1. **Input Layer**: Average of context word embeddings
2. **Hidden Layer**: Linear transformation
3. **Output Layer**: Softmax over vocabulary (predicts target word)

## Training Process

1. Take context words (e.g., "quick", "brown", "fox", "jumps")
2. Average their embeddings
3. Predict the target word (e.g., "the")
4. Update embeddings using backpropagation

## Example

Sentence: "The quick brown fox jumps"
- Context: ["quick", "brown", "fox", "jumps"]
- Target: "the"

## Mathematical Formulation

For context words $\\{w_{t-c}, \\ldots, w_{t-1}, w_{t+1}, \\ldots, w_{t+c}\\}$, we compute:

$$\\vec{h} = \\frac{1}{2c} \\sum_{-c \\leq j \\leq c, j \\neq 0} \\vec{v}_{w_{t+j}}$$

Then predict target word $w_t$:

$$P(w_t | \\text{context}) = \\frac{\\exp(\\vec{v}'_{w_t}^T \\vec{h})}{\\sum_{w=1}^{|V|} \\exp(\\vec{v}'_{w}^T \\vec{h})}$$

## Advantages

- Faster training
- Better for frequent words
- More efficient with large datasets

## When to Use

- Large datasets
- When training speed is important
- For frequent words`,
            code: `# CBOW Model Concept
# Simplified explanation of CBOW training

def create_cbow_pairs(sentence, window_size=2):
    """
    Create (context, target) pairs for CBOW training
    """
    words = sentence.lower().split()
    pairs = []
    
    for i, target in enumerate(words):
        # Get context words within window
        start = max(0, i - window_size)
        end = min(len(words), i + window_size + 1)
        
        context = [words[j] for j in range(start, end) if j != i]
        
        if context:  # Only add if context exists
            pairs.append((context, target))
    
    return pairs

# Example
sentence = "the quick brown fox jumps over the lazy dog"
pairs = create_cbow_pairs(sentence, window_size=2)

print("CBOW training pairs:")
print(f"Total pairs: {len(pairs)}")
print("\nFirst 5 pairs:")
for context, target in pairs[:5]:
    print(f"Context: {context} -> Target: {target}")

print("\nFor target word 'brown':")
brown_pairs = [p for p in pairs if p[1] == 'brown']
for context, target in brown_pairs:
    print(f"  Predict: {target} from context: {context}")`,
            completed: false,
          },
        ],
      },
      {
        id: "implementation",
        title: "Implementation",
        description: "Practical implementation of Word2Vec",
        completed: false,
        subtopics: [
          {
            id: "implementation-gensim",
            title: "Using Gensim",
            content: `# Word2Vec Implementation with Gensim

Gensim is a popular library for topic modeling and word embeddings. It provides a simple interface for training Word2Vec models.

## Key Steps

1. **Prepare Corpus**: Tokenize and preprocess text
2. **Train Model**: Use Word2Vec class from Gensim
3. **Use Embeddings**: Access word vectors and find similar words

## Hyperparameters

- **vector_size**: Embedding dimension (default: 100)
- **window**: Context window size (default: 5)
- **min_count**: Minimum word frequency (default: 5)
- **sg**: Skip-gram (1) or CBOW (0)
- **workers**: Number of threads

## Applications

- Find similar words
- Word arithmetic (king - man + woman = queen)
- Document similarity
- Feature extraction for ML models`,
            code: `# Word2Vec Implementation Example
# Note: This requires gensim library
# Install with: pip install gensim

from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence

# Sample corpus
sentences = [
    ["the", "king", "lives", "in", "a", "palace"],
    ["the", "queen", "lives", "in", "a", "palace"],
    ["the", "prince", "is", "the", "son", "of", "the", "king"],
    ["the", "princess", "is", "the", "daughter", "of", "the", "queen"],
    ["man", "and", "woman", "are", "humans"],
    ["king", "and", "queen", "are", "royalty"]
]

# Train Word2Vec model
model = Word2Vec(
    sentences=sentences,
    vector_size=100,      # Embedding dimension
    window=5,             # Context window
    min_count=1,          # Minimum word frequency
    workers=4,            # Number of threads
    sg=1                  # Skip-gram (1) or CBOW (0)
)

# Get word vector
king_vector = model.wv["king"]
print(f"King vector shape: {king_vector.shape}")

# Find similar words
similar = model.wv.most_similar("king", topn=3)
print("\nWords similar to 'king':")
for word, score in similar:
    print(f"{word}: {score:.3f}")

# Word arithmetic
result = model.wv.most_similar(
    positive=["king", "woman"],
    negative=["man"],
    topn=1
)
print("\nking - man + woman ≈", result[0][0])`,
            completed: false,
          },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        description: "Real-world applications of word embeddings",
        completed: false,
        subtopics: [
          {
            id: "applications-overview",
            title: "Applications Overview",
            content: `# Applications of Word Embeddings

Word embeddings have revolutionized NLP and are used in many applications.

## 1. Text Classification

Use word embeddings as features for classification tasks:
- Sentiment analysis
- Spam detection
- Topic classification

## 2. Machine Translation

Embeddings help translate between languages by mapping words to a common space.

## 3. Question Answering

Embeddings help find relevant information by matching question and answer semantics.

## 4. Recommendation Systems

Use embeddings to find similar items or users based on text descriptions.

## 5. Search Engines

Improve search by understanding semantic similarity, not just keyword matching.

## 6. Chatbots

Help chatbots understand user intent and generate appropriate responses.

## Best Practices

- Use pre-trained embeddings when possible
- Fine-tune on domain-specific data
- Combine with other features
- Consider context-aware embeddings (BERT, GPT)`,
            code: `# Applications of Word Embeddings
# Example: Text Similarity

import numpy as np

# Simulated word embeddings (in practice, use trained models)
embeddings = {
    "python": [0.8, 0.2, 0.1],
    "programming": [0.7, 0.3, 0.2],
    "code": [0.75, 0.25, 0.15],
    "cat": [0.1, 0.9, 0.2],
    "dog": [0.15, 0.85, 0.25]
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def document_similarity(doc1_words, doc2_words):
    # Average word embeddings
    doc1_vec = np.mean([embeddings[w] for w in doc1_words if w in embeddings], axis=0)
    doc2_vec = np.mean([embeddings[w] for w in doc2_words if w in embeddings], axis=0)
    
    return cosine_similarity(doc1_vec, doc2_vec)

# Example documents
doc1 = ["python", "programming", "code"]
doc2 = ["programming", "code", "python"]
doc3 = ["cat", "dog"]

print(f"Doc1-Doc2 similarity: {document_similarity(doc1, doc2):.3f}")
print(f"Doc1-Doc3 similarity: {document_similarity(doc1, doc3):.3f}")`,
            completed: false,
          },
        ],
      },
    ],
    pipelineSteps: [
      {
        id: "text",
        title: "Text Input",
        description: "Raw text corpus",
        color: "bg-blue-500",
      },
      {
        id: "tokenize",
        title: "Tokenization",
        description: "Split into words",
        color: "bg-green-500",
      },
      {
        id: "vocab",
        title: "Vocabulary",
        description: "Build word dictionary",
        color: "bg-yellow-500",
      },
      {
        id: "embed",
        title: "Embedding",
        description: "Map to vectors",
        color: "bg-purple-500",
      },
      {
        id: "train",
        title: "Training",
        description: "Learn relationships",
        color: "bg-red-500",
      },
    ],
    segments: {
      intro: {
        title: "Introduction to Word Embeddings",
        content: `# Introduction to Word Embeddings

Word embeddings are a type of word representation that allows words with similar meaning to have a similar representation. They are a distributed representation for text that is perhaps one of the key breakthroughs for the impressive performance of deep learning methods on challenging natural language processing problems.

## What are Word Embeddings?

Word embeddings are dense vector representations of words in a continuous vector space. Unlike traditional sparse representations like one-hot encoding, word embeddings capture semantic relationships between words.

### Key Concepts:
- **Dense Vectors**: Each word is represented as a dense vector (typically 100-300 dimensions)
- **Semantic Similarity**: Words with similar meanings are close in vector space
- **Context Awareness**: Embeddings capture contextual relationships

## Mathematical Foundation

Word embeddings map each word $w_i$ in vocabulary $V$ to a dense vector in $\\mathbb{R}^d$:

$$E: V \\rightarrow \\mathbb{R}^d$$

where $d$ is the embedding dimension (typically 100-300). For a vocabulary of size $|V|$, we learn an embedding matrix:

$$W \\in \\mathbb{R}^{|V| \\times d}$$

Each row $W_i$ represents the embedding vector for word $w_i$.

## Visualizing Word Embeddings in 3D Space

\`\`\`3d:type=embedding-space,title=Word Embedding Space,description=Interactive 3D visualization showing how semantically similar words cluster together in the embedding space
\`\`\`

## Word Embedding Pipeline

\`\`\`mermaid
flowchart LR
    A[Raw Text] --> B[Tokenization]
    B --> C[Vocabulary Building]
    C --> D[One-Hot Encoding]
    D --> E[Neural Network]
    E --> F[Dense Embeddings]
    F --> G[Vector Space]
    
    style A fill:#3b82f6
    style G fill:#10b981
    style E fill:#f59e0b
\`\`\`

## Why Do We Need Word Embeddings?

Traditional NLP approaches used sparse representations:
- **One-hot encoding**: Creates very high-dimensional vectors
- **Bag of Words**: Loses word order and context
- **TF-IDF**: Better but still sparse

> **Key Insight**: The curse of dimensionality means that as the vocabulary size $|V|$ grows, one-hot vectors become extremely sparse. For $|V| = 100,000$ words, each vector has 99,999 zeros!

Word embeddings solve these problems by:
1. Reducing dimensionality from $|V|$ to $d$ where $d \\ll |V|$
2. Capturing semantic relationships through similarity metrics like cosine similarity
3. Preserving context information through distributional semantics

### Cosine Similarity

The similarity between two word vectors $\\vec{w}_i$ and $\\vec{w}_j$ is measured using cosine similarity:

$$\\text{sim}(\\vec{w}_i, \\vec{w}_j) = \\frac{\\vec{w}_i \\cdot \\vec{w}_j}{||\\vec{w}_i|| \\cdot ||\\vec{w}_j||} = \\cos(\\theta)$$

where $\\theta$ is the angle between the two vectors in the embedding space.`,
        code: `# Example: Understanding word embeddings
import numpy as np

# Traditional one-hot encoding
words = ["cat", "dog", "bird"]
vocab_size = len(words)

# One-hot vectors (sparse, high-dimensional)
one_hot_cat = [1, 0, 0]
one_hot_dog = [0, 1, 0]
one_hot_bird = [0, 0, 1]

print("One-hot encoding:")
print(f"Cat: {one_hot_cat}")
print(f"Dog: {one_hot_dog}")
print(f"Bird: {one_hot_bird}`,
      },
      "why-vectors": {
        title: "Why Word Vectors?",
        content: `# Why Word Vectors?

Word vectors solve fundamental problems in natural language processing by providing a way to represent words that captures their meaning and relationships.

## Problems with Traditional Methods

### 1. Curse of Dimensionality

The curse of dimensionality states that as the number of dimensions increases, the volume of the space increases exponentially, making data sparse.

For one-hot encoding with vocabulary size $|V|$:
- Vector dimension: $|V|$
- Non-zero elements: 1
- Sparsity: $\\frac{|V|-1}{|V|} \\approx 1$ for large $|V|$

**Example**: For $|V| = 100,000$ words, each vector has 99,999 zeros!

### Mathematical Comparison

**One-Hot Encoding**:
$$\\vec{w}_{\\text{one-hot}} = [0, 0, \\ldots, 1, \\ldots, 0]^T \\in \\{0,1\\}^{|V|}$$

**Word Embedding**:
$$\\vec{w}_{\\text{embedding}} = [e_1, e_2, \\ldots, e_d]^T \\in \\mathbb{R}^d$$

where $d \\ll |V|$ (typically $d = 100-300$).

### 2. No Semantic Relationships

In one-hot encoding, the distance between any two distinct words is identical:

$$||\\vec{w}_i - \\vec{w}_j||_2 = \\sqrt{2} \\quad \\forall i \\neq j$$

This means "king" and "queen" are as distant as "king" and "apple", despite their semantic relationship!

### 3. Context Loss

Traditional methods like Bag of Words (BoW) lose word order and context:

**BoW**: "Dog bites man" $\\equiv$ "Man bites dog"

Word embeddings, through distributional semantics, capture context:
$$P(w|\\text{context}) \\approx f(\\vec{w}, \\{\\vec{c}_i\\})$$

## Benefits of Word Vectors

### 1. Dense Representation

Space complexity reduction:
- **One-hot**: $O(|V|)$ per word
- **Embedding**: $O(d)$ per word where $d \\ll |V|$

Storage savings: For $|V| = 100,000$ and $d = 300$, we save $\\frac{100,000 - 300}{100,000} = 99.7\\%$ space!

### 2. Semantic Similarity

Words with similar meanings cluster together in embedding space. The distance between vectors reflects semantic distance:

$$\\text{distance}(\\vec{w}_i, \\vec{w}_j) \\propto -\\text{semantic\_similarity}(w_i, w_j)$$

### 3. Mathematical Operations

The famous word analogy:

$$\\vec{w}_{\\text{king}} - \\vec{w}_{\\text{man}} + \\vec{w}_{\\text{woman}} \\approx \\vec{w}_{\\text{queen}}$$

This works because embeddings capture relationships as geometric transformations in vector space.

\`\`\`mermaid
graph TB
    A[King] -->|Man Relationship| B[Queen]
    C[Man] -->|Gender| D[Woman]
    A -.->|Vector Arithmetic| E[King - Man + Woman]
    E -->|≈| B
    
    style A fill:#ef4444
    style B fill:#ec4899
    style E fill:#10b981
\`\`\`

### 4. Transfer Learning

Pre-trained embeddings capture general linguistic knowledge and can be fine-tuned for specific tasks, reducing training time and data requirements.`,
        code: `# Comparing one-hot vs word embeddings
import numpy as np

# One-hot encoding (sparse)
vocab = ["king", "queen", "man", "woman", "apple"]
vocab_size = len(vocab)

def one_hot(word):
    idx = vocab.index(word)
    vector = [0] * vocab_size
    vector[idx] = 1
    return vector

# Word embeddings (dense, semantic)
# These are simplified examples - real embeddings are learned
word_embeddings = {
    "king": [0.5, 0.3, 0.1],
    "queen": [0.5, 0.3, 0.2],
    "man": [0.4, 0.2, 0.1],
    "woman": [0.4, 0.2, 0.2],
    "apple": [0.1, 0.8, 0.9]
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare similarities
king = word_embeddings["king"]
queen = word_embeddings["queen"]
apple = word_embeddings["apple"]

print(f"King-Queen similarity: {cosine_similarity(king, queen):.3f}")
print(f"King-Apple similarity: {cosine_similarity(king, apple):.3f})`,
      },
      "one-hot": {
        title: "One-Hot Encoding",
        content: `# One-Hot Encoding

One-hot encoding is the simplest way to represent words as vectors. Each word is represented as a binary vector where only one element is 1 and all others are 0.

## How It Works

1. Create a vocabulary of all unique words
2. Assign each word a unique index
3. Create a vector where only the word's index position is 1

## Example

For vocabulary: ["cat", "dog", "bird"]
- "cat" → [1, 0, 0]
- "dog" → [0, 1, 0]
- "bird" → [0, 0, 1]

## Limitations

1. **High Dimensionality**: Vector size = vocabulary size
2. **No Relationships**: All words are equally distant
3. **Sparse**: Mostly zeros, inefficient storage
4. **No Semantics**: Can't capture meaning or context

## When to Use

One-hot encoding is still useful for:
- Small vocabularies
- Simple classification tasks
- As a baseline for comparison`,
        code: `# One-Hot Encoding Implementation
def create_one_hot_encoding(corpus):
    # Build vocabulary
    words = set()
    for sentence in corpus:
        words.update(sentence.lower().split())
    
    vocab = sorted(list(words))
    vocab_to_idx = {word: idx for idx, word in enumerate(vocab)}
    
    def encode(sentence):
        vector = [0] * len(vocab)
        for word in sentence.lower().split():
            if word in vocab_to_idx:
                vector[vocab_to_idx[word]] = 1
        return vector
    
    return encode, vocab

# Example usage
corpus = [
    "the cat sat on the mat",
    "the dog played in the park",
    "the bird flew in the sky"
]

encode, vocab = create_one_hot_encoding(corpus)

print("Vocabulary:", vocab)
print("\\nOne-hot encoding for 'the cat sat':")
print(encode("the cat sat"))`,
      },
      word2vec: {
        title: "Word2Vec Overview",
        content: `# Word2Vec Overview

Word2Vec is a popular technique for learning word embeddings. It was introduced by Mikolov et al. at Google in 2013.

## Two Main Architectures

### 1. Continuous Bag of Words (CBOW)
- Predicts the target word from context
- Faster training
- Better for frequent words

### 2. Skip-gram
- Predicts context from target word
- Better for rare words
- More accurate overall

## Key Ideas

1. **Distributional Hypothesis**: Words that appear in similar contexts have similar meanings
2. **Neural Network**: Uses a shallow neural network to learn embeddings
3. **Negative Sampling**: Efficient training technique
4. **Hierarchical Softmax**: Alternative to negative sampling

## Advantages

- Fast training
- Good quality embeddings
- Pre-trained models available
- Works well with small datasets

## Applications

- Text classification
- Sentiment analysis
- Machine translation
- Question answering`,
        code: `# Word2Vec Concept Demonstration
# This is a simplified explanation of how Word2Vec works

import numpy as np

# Simplified vocabulary
vocab = ["king", "queen", "man", "woman", "prince", "princess"]

# Context window example
# "The king and queen" - king and queen are context for each other
context_pairs = [
    ("king", "queen"),
    ("man", "woman"),
    ("prince", "princess"),
    ("king", "man"),
    ("queen", "woman")
]

# Word2Vec learns that words appearing in similar contexts
# should have similar embeddings
print("Context pairs that Word2Vec learns from:")
for word1, word2 in context_pairs:
    print(f"{word1} <-> {word2}")

# After training, similar words will have similar vectors
# This allows for semantic operations like:
# king - man + woman ≈ queen`,
      },
      "skip-gram": {
        title: "Skip-gram Model",
        content: `# Skip-gram Model

The Skip-gram model predicts surrounding context words given a target word. It's particularly effective for learning word representations.

## Architecture

The Skip-gram model uses a shallow neural network with:

1. **Input Layer**: One-hot encoded target word $\\vec{x} \\in \\{0,1\\}^{|V|}$
2. **Hidden Layer**: Linear transformation (embedding lookup) to get $\\vec{h} = W^T\\vec{x} \\in \\mathbb{R}^d$
3. **Output Layer**: Softmax over vocabulary to predict context words

### Mathematical Formulation

Given a target word $w_t$ and context window of size $C$, we want to predict context words $w_{t-c}, \\ldots, w_{t+c}$ (excluding $w_t$).

The objective is to maximize:

$$\\mathcal{L} = \\frac{1}{T}\\sum_{t=1}^{T} \\sum_{-c \\leq j \\leq c, j \\neq 0} \\log P(w_{t+j} | w_t)$$

where $P(w_{t+j} | w_t)$ is computed using softmax:

$$P(w_O | w_I) = \\frac{\\exp(\\vec{v}'_{w_O}^T \\vec{v}_{w_I})}{\\sum_{w=1}^{|V|} \\exp(\\vec{v}'_{w}^T \\vec{v}_{w_I})}$$

Here:
- $\\vec{v}_{w_I}$: input embedding (hidden layer)
- $\\vec{v}'_{w_O}$: output embedding (output layer)
- $|V|$: vocabulary size

\`\`\`mermaid
graph LR
    A[One-Hot Input] -->|W| B[Hidden Layer<br/>d dimensions]
    B -->|W'| C[Output Layer<br/>|V| dimensions]
    C --> D[Softmax]
    D --> E[Context Words]
    
    style A fill:#3b82f6
    style B fill:#10b981
    style C fill:#f59e0b
    style D fill:#ef4444
\`\`\`

## Training Process

1. Take a target word (e.g., "king")
2. Sample context words from a window (e.g., ±2 words)
3. Train the model to predict these context words
4. Update embeddings using backpropagation

### Example Training Pair

Sentence: "The quick brown fox jumps"

For target word "brown" with window size $c = 2$:
- Context words: "quick", "fox", "jumps"
- Training pairs: (brown, quick), (brown, fox), (brown, jumps)

## Negative Sampling

Computing softmax over $|V|$ is expensive. Negative sampling approximates this:

$$\\log P(w_O | w_I) = \\log \\sigma(\\vec{v}'_{w_O}^T \\vec{v}_{w_I}) + \\sum_{k=1}^{K} \\mathbb{E}_{w_k \\sim P_n(w)}[\\log \\sigma(-\\vec{v}'_{w_k}^T \\vec{v}_{w_I})]$$

where:
- $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ (sigmoid function)
- $K$: number of negative samples (typically 5-20)
- $P_n(w)$: noise distribution (usually unigram distribution $\\frac{3}{4}$)

## Advantages

- Works well with rare words (more training examples per word)
- Better overall performance than CBOW
- Captures multiple contexts per word
- Efficient with negative sampling

## Hyperparameters

- **Window Size** ($c$): Typically 5-10
- **Embedding Dimension** ($d$): 100-300
- **Negative Samples** ($K$): 5-20
- **Learning Rate** ($\\alpha$): 0.01-0.05

### Training Complexity

- **Without negative sampling**: $O(|V|)$ per training example
- **With negative sampling**: $O(K + 1)$ per training example

This makes training $\\frac{|V|}{K+1}$ times faster!`,
        code: `# Skip-gram Model Concept
# Simplified explanation of skip-gram training

def create_skip_gram_pairs(sentence, window_size=2):
    """
    Create (target, context) pairs for skip-gram training
    """
    words = sentence.lower().split()
    pairs = []
    
    for i, target in enumerate(words):
        # Get context words within window
        start = max(0, i - window_size)
        end = min(len(words), i + window_size + 1)
        
        for j in range(start, end):
            if j != i:  # Don't include target as context
                pairs.append((target, words[j]))
    
    return pairs

# Example
sentence = "the quick brown fox jumps over the lazy dog"
pairs = create_skip_gram_pairs(sentence, window_size=2)

print("Skip-gram training pairs:")
for target, context in pairs[:10]:  # Show first 10
    print(f"({target}, {context})")`,
      },
      cbow: {
        title: "CBOW Model",
        content: `# Continuous Bag of Words (CBOW)

CBOW predicts the target word from surrounding context words. It's faster to train than Skip-gram but slightly less accurate.

## Architecture

1. **Input Layer**: Average of context word embeddings
2. **Hidden Layer**: Linear transformation
3. **Output Layer**: Softmax over vocabulary (predicts target word)

## Training Process

1. Take context words (e.g., "quick", "brown", "fox", "jumps")
2. Average their embeddings
3. Predict the target word (e.g., "the")
4. Update embeddings using backpropagation

## Example

Sentence: "The quick brown fox jumps"
- Context: ["quick", "brown", "fox", "jumps"]
- Target: "the"

## Advantages

- Faster training
- Better for frequent words
- More efficient with large datasets

## When to Use

- Large datasets
- When training speed is important
- For frequent words`,
        code: `# CBOW Model Concept
# Simplified explanation of CBOW training

def create_cbow_pairs(sentence, window_size=2):
    """
    Create (context, target) pairs for CBOW training
    """
    words = sentence.lower().split()
    pairs = []
    
    for i, target in enumerate(words):
        # Get context words within window
        start = max(0, i - window_size)
        end = min(len(words), i + window_size + 1)
        
        context = [words[j] for j in range(start, end) if j != i]
        
        if context:  # Only add if context exists
            pairs.append((context, target))
    
    return pairs

# Example
sentence = "the quick brown fox jumps over the lazy dog"
pairs = create_cbow_pairs(sentence, window_size=2)

print("CBOW training pairs:")
for context, target in pairs[:5]:  # Show first 5
    print(f"Context: {context} -> Target: {target}")`,
      },
      implementation: {
        title: "Implementation",
        content: `# Word2Vec Implementation

Here's a practical implementation of Word2Vec using Python. We'll use the Gensim library which provides an efficient implementation.

## Using Gensim

Gensim is a popular library for topic modeling and word embeddings. It provides a simple interface for training Word2Vec models.

## Key Steps

1. **Prepare Corpus**: Tokenize and preprocess text
2. **Train Model**: Use Word2Vec class from Gensim
3. **Use Embeddings**: Access word vectors and find similar words

## Hyperparameters

- **size**: Embedding dimension (default: 100)
- **window**: Context window size (default: 5)
- **min_count**: Minimum word frequency (default: 5)
- **sg**: Skip-gram (1) or CBOW (0)
- **workers**: Number of threads

## Applications

- Find similar words
- Word arithmetic (king - man + woman = queen)
- Document similarity
- Feature extraction for ML models`,
        code: `# Word2Vec Implementation Example
# Note: This requires gensim library
# Install with: pip install gensim

from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence

# Sample corpus
sentences = [
    ["the", "king", "lives", "in", "a", "palace"],
    ["the", "queen", "lives", "in", "a", "palace"],
    ["the", "prince", "is", "the", "son", "of", "the", "king"],
    ["the", "princess", "is", "the", "daughter", "of", "the", "queen"],
    ["man", "and", "woman", "are", "humans"],
    ["king", "and", "queen", "are", "royalty"]
]

# Train Word2Vec model
model = Word2Vec(
    sentences=sentences,
    vector_size=100,      # Embedding dimension
    window=5,             # Context window
    min_count=1,          # Minimum word frequency
    workers=4,            # Number of threads
    sg=1                  # Skip-gram (1) or CBOW (0)
)

# Get word vector
king_vector = model.wv["king"]
print(f"King vector shape: {king_vector.shape}")

# Find similar words
similar = model.wv.most_similar("king", topn=3)
print("\\nWords similar to 'king':")
for word, score in similar:
    print(f"{word}: {score:.3f}")

# Word arithmetic
result = model.wv.most_similar(
    positive=["king", "woman"],
    negative=["man"],
    topn=1
)
print("\\nking - man + woman ≈", result[0][0])`,
      },
      applications: {
        title: "Applications",
        content: `# Applications of Word Embeddings

Word embeddings have revolutionized NLP and are used in many applications.

## 1. Text Classification

Use word embeddings as features for classification tasks:
- Sentiment analysis
- Spam detection
- Topic classification

## 2. Machine Translation

Embeddings help translate between languages by mapping words to a common space.

## 3. Question Answering

Embeddings help find relevant information by matching question and answer semantics.

## 4. Recommendation Systems

Use embeddings to find similar items or users based on text descriptions.

## 5. Search Engines

Improve search by understanding semantic similarity, not just keyword matching.

## 6. Chatbots

Help chatbots understand user intent and generate appropriate responses.

## Best Practices

- Use pre-trained embeddings when possible
- Fine-tune on domain-specific data
- Combine with other features
- Consider context-aware embeddings (BERT, GPT)`,
        code: `# Applications of Word Embeddings
# Example: Text Similarity

import numpy as np

# Simulated word embeddings (in practice, use trained models)
embeddings = {
    "python": [0.8, 0.2, 0.1],
    "programming": [0.7, 0.3, 0.2],
    "code": [0.75, 0.25, 0.15],
    "cat": [0.1, 0.9, 0.2],
    "dog": [0.15, 0.85, 0.25]
}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def document_similarity(doc1_words, doc2_words):
    # Average word embeddings
    doc1_vec = np.mean([embeddings[w] for w in doc1_words if w in embeddings], axis=0)
    doc2_vec = np.mean([embeddings[w] for w in doc2_words if w in embeddings], axis=0)
    
    return cosine_similarity(doc1_vec, doc2_vec)

# Example documents
doc1 = ["python", "programming", "code"]
doc2 = ["programming", "code", "python"]
doc3 = ["cat", "dog"]

print(f"Doc1-Doc2 similarity: {document_similarity(doc1, doc2):.3f}")
print(f"Doc1-Doc3 similarity: {document_similarity(doc1, doc3):.3f}")`,
      },
    },
  },
};

