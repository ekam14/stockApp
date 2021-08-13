// Preprocesses a TRIE of symbols and company names
var Trie = function() {
    this.root = {}
};

// inserts word into TRIE
Trie.prototype.insert = function(word) {
    let node = this.root;
    
    for(let c of word){
        if(!node[c]) node[c] = {}
        node = node[c];
    }
    
    node["isEnd"] = true;
};

// performs dfs
dfs = function(prefix, words, node){
    if(node["isEnd"]) words.push(prefix);
    
    for(let letter in node) {
        if(letter === "isEnd") continue;
        dfs(prefix + letter, words, node[letter]);
    }
}

// searches for possible words
Trie.prototype.possibleWords = function(prefix) {
    if(!prefix) return [];

    let node = this.root;
    
    for(let c of prefix){
        if(!node[c]) return false;
        node = node[c];
    }
    
    let words = (node["isEnd"]) ? [ prefix ] : [];
    
    for(let letter in node) {
        if(letter === "isEnd") continue;
        dfs(prefix + letter, words, node[letter]);
    }
    return words;
};

module.exports = { Trie }