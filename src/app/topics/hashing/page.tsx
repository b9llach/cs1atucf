"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Box, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";

type ChainedItem = {
  key: string;
  value: string;
  next: ChainedItem | null;
};

type HashItem = {
  key: string;
  value: string;
  index: number;
  collisions: number;
  chain?: ChainedItem | null;
};

export default function HashingPage() {
  const [activeSection, setActiveSection] = useState("collision-handling");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Hash Table State
  const [tableSize, setTableSize] = useState(8);
  const [hashTable, setHashTable] = useState<(HashItem | null)[]>(Array(8).fill(null));
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [operations, setOperations] = useState<string[]>([]);

  // Add these new state variables at the top with other states
  const [probingMethod, setProbingMethod] = useState<'linear' | 'quadratic' | 'double' | 'chaining'>('linear');
  const [showSteps, setShowSteps] = useState(true);

  // Simple hash function
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % tableSize;
  };

  // Add these new hash functions
  const linearProbe = (initialHash: number, attempt: number): number => {
    return (initialHash + attempt) % tableSize;
  };

  const quadraticProbe = (initialHash: number, attempt: number): number => {
    return (initialHash + attempt * attempt) % tableSize;
  };

  const secondaryHash = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return (hash % (tableSize - 1)) + 1;
  };

  const doubleHash = (initialHash: number, attempt: number, step: number): number => {
    return (initialHash + attempt * step) % tableSize;
  };

  // Add chaining insert logic
  const chainInsert = async (key: string, value: string) => {
    const index = hashFunction(key);
    setHighlightedIndex(index);
    setOperations(prev => [...prev, `Hash index for "${key}": ${index}`]);
    await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));

    const newTable = [...hashTable];
    const newItem: HashItem = { key, value, index, collisions: 0 };

    if (!newTable[index]) {
      newTable[index] = newItem;
      setOperations(prev => [...prev, `Created new chain at index ${index}`]);
    } else {
      // Check if key exists in chain
      let current = newTable[index] as HashItem;
      let chainLength = 0;
      while (current) {
        if (current.key === key) {
          setOperations(prev => [...prev, `Key "${key}" already exists in chain at index ${index}`]);
          setIsSimulating(false);
          return;
        }
        if (!current.chain) break;
        current = { 
          ...current.chain, 
          index, 
          collisions: chainLength + 1 
        } as HashItem;
        chainLength++;
      }
      
      // Add to end of chain
      current.chain = { key, value, next: null };
      newItem.collisions = chainLength;
      setOperations(prev => [...prev, `Added to chain at index ${index} (chain length: ${chainLength + 1})`]);
    }

    setHashTable(newTable);
    setHighlightedIndex(null);
  };

  // Modify insertItem to include chaining
  const insertItem = async (key: string, value: string) => {
    setIsSimulating(true);
    
    if (probingMethod === 'chaining') {
      await chainInsert(key, value);
    } else {
      let initialIndex = hashFunction(key);
      let index = initialIndex;
      let collisions = 0;
      let step = probingMethod === 'double' ? secondaryHash(key) : 1;
      
      // Show initial hash calculation
      setHighlightedIndex(initialIndex);
      setOperations(prev => [...prev, `Initial hash index for "${key}": ${initialIndex}`]);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));

      // Probe if needed
      let attempt = 0;
      while (hashTable[index] !== null) {
        if (hashTable[index]?.key === key) {
          setOperations(prev => [...prev, `Key "${key}" already exists at index ${index}`]);
          setIsSimulating(false);
          return;
        }
        
        collisions++;
        attempt++;
        
        // Calculate next index based on probing method
        switch (probingMethod) {
          case 'linear':
            index = linearProbe(initialIndex, attempt);
            break;
          case 'quadratic':
            index = quadraticProbe(initialIndex, attempt);
            break;
          case 'double':
            index = doubleHash(initialIndex, attempt, step);
            break;
        }
        
        setHighlightedIndex(index);
        setOperations(prev => [...prev, 
          `Collision occurred (${probingMethod} probing), trying index: ${index}` +
          (probingMethod === 'double' ? ` (step: ${step})` : '')
        ]);
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      }

      // Insert the item
      const newTable = [...hashTable];
      newTable[index] = { key, value, index, collisions };
      setHashTable(newTable);
      setOperations(prev => [...prev, `Inserted "${key}" at index ${index} after ${collisions} collision(s)`]);
      
      setHighlightedIndex(null);
    }
    
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-6 rounded-md px-4 py-2 bg-black text-white hover:bg-black/80 transition-all"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-white">Hashing</h1>

        {/* Global Controls */}
        <Card className="p-4 mb-6 bg-zinc-900/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-300">Simulation Speed:</span>
              <Slider
                value={[simulationSpeed]}
                onValueChange={(value) => setSimulationSpeed(value[0])}
                min={0.5}
                max={2}
                step={0.5}
                className="w-32"
              />
              <span className="text-sm text-zinc-300">{simulationSpeed}x</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "collision-handling", label: "Collision Handling" },
            { id: "hash-functions", label: "Hash Functions" },
            { id: "performance", label: "Performance" },
            { id: "applications", label: "Applications" }
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => {
                setActiveSection(id);
                setOperations([]);
              }}
              className={`flex items-center gap-2 ${
                activeSection === id 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Box className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "hash-functions" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Hash Functions</h2>
                <p className="text-zinc-400 mb-6">
                  Hash functions convert data of arbitrary size into fixed-size values. A good hash function 
                  should be fast to compute and minimize collisions.
                </p>

                {/* Hash Table Visualization */}
                <div className="mb-6">
                  <div className="mb-4 flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">Probing Method:</span>
                      <select
                        value={probingMethod}
                        onChange={(e) => setProbingMethod(e.target.value as 'linear' | 'quadratic' | 'double' | 'chaining')}
                        className="bg-zinc-900/50 border-zinc-700 text-white rounded px-2 py-1"
                        disabled={isSimulating}
                      >
                        <option value="linear">Linear Probing</option>
                        <option value="quadratic">Quadratic Probing</option>
                        <option value="double">Double Hashing</option>
                        <option value="chaining">Chaining</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">Show Steps:</span>
                      <input
                        type="checkbox"
                        checked={showSteps}
                        onChange={(e) => setShowSteps(e.target.checked)}
                        className="accent-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <Input
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Key"
                      className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                      disabled={isSimulating}
                    />
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Value"
                      className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                      disabled={isSimulating}
                    />
                    <Button 
                      onClick={() => {
                        if (inputKey && inputValue) {
                          insertItem(inputKey, inputValue);
                          setInputKey("");
                          setInputValue("");
                        }
                      }}
                      disabled={isSimulating || !inputKey || !inputValue}
                      className="bg-transparent text-white hover:bg-zinc-800"
                    >
                      Insert
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setHashTable(Array(tableSize).fill(null));
                        setOperations([]);
                      }}
                      disabled={isSimulating}
                      className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Hash Table */}
                  <div className="grid grid-cols-1 gap-2">
                    {hashTable.map((item, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded flex items-center justify-between
                          ${highlightedIndex === index ? 'bg-green-500/10 border-2 border-green-500' : 'bg-black/30 border border-zinc-700'}
                        `}
                      >
                        <div className="text-zinc-400 font-mono">Index {index}</div>
                        {item ? (
                          <div className="flex items-center gap-4">
                            <span className="text-white font-mono">{item.key}: {item.value}</span>
                            {item.chain && (
                              <span className="text-xs text-zinc-500">
                                → {item.chain.key}: {item.chain.value}
                                {item.chain.next && " → ..."}
                              </span>
                            )}
                            {item.collisions > 0 && (
                              <span className="text-xs text-zinc-500">
                                ({item.collisions} item{item.collisions > 1 ? 's' : ''} in chain)
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-zinc-600">Empty</div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Current Probing Method</h3>
                    <div className="text-zinc-400 space-y-2">
                      {probingMethod === 'linear' && (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`// Linear Probing
index = (initialHash + attempt) % tableSize
// Each attempt moves to the next slot`}
                        </pre>
                      )}
                      {probingMethod === 'quadratic' && (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`// Quadratic Probing
index = (initialHash + attempt² ) % tableSize
// Each attempt moves by increasing square distances`}
                        </pre>
                      )}
                      {probingMethod === 'double' && (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`// Double Hashing
step = hash2(key)  // Second hash function
index = (initialHash + attempt * step) % tableSize
// Each attempt moves by the second hash value`}
                        </pre>
                      )}
                      {probingMethod === 'chaining' && (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`// Chaining
index = hash(key)
if (table[index] is empty):
    table[index] = new Node(key, value)
else:
    // Add to end of chain
    current = table[index]
    while (current.next):
        current = current.next
    current.next = new Node(key, value)`}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {operations.map((op, index) => (
                      <div key={index} className="text-sm text-zinc-400">
                        {op}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "collision-handling" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Collision Handling</h2>
                <p className="text-zinc-400 mb-6">
                  Collisions occur when two different keys hash to the same index. There are several 
                  strategies to handle collisions effectively.
                </p>

                <div className="space-y-6">
                  {/* Collision Resolution Methods */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Linear Probing</h3>
                      <p className="text-zinc-400 mb-3">
                        Search for the next empty slot sequentially until one is found.
                      </p>
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                        {`index = hash(key)
while (table[index] is occupied):
    index = (index + 1) % size`}
                      </pre>
                      <div className="mt-3 text-zinc-500 text-sm">
                        Pros: Simple, good cache performance<br/>
                        Cons: Clustering, secondary collisions
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Quadratic Probing</h3>
                      <p className="text-zinc-400 mb-3">
                        Try slots at quadratic intervals from the original hash.
                      </p>
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                        {`index = hash(key)
i = 0
while (table[index] is occupied):
    i++
    index = (hash(key) + i*i) % size`}
                      </pre>
                      <div className="mt-3 text-zinc-500 text-sm">
                        Pros: Reduces clustering<br/>
                        Cons: May not probe all slots
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Double Hashing</h3>
                      <p className="text-zinc-400 mb-3">
                        Use a second hash function to determine the probe interval.
                      </p>
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                        {`index = hash1(key)
step = hash2(key)
while (table[index] is occupied):
    index = (index + step) % size`}
                      </pre>
                      <div className="mt-3 text-zinc-500 text-sm">
                        Pros: Better distribution<br/>
                        Cons: More computation needed
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Chaining</h3>
                      <p className="text-zinc-400 mb-3">
                        Each slot contains a linked list of elements.
                      </p>
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                        {`index = hash(key)
if (table[index] is empty):
    table[index] = new List()
table[index].append(key, value)`}
                      </pre>
                      <div className="mt-3 text-zinc-500 text-sm">
                        Pros: Simple, works well with high load<br/>
                        Cons: Extra memory for links
                      </div>
                    </div>
                  </div>

                  {/* Load Factor */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Load Factor</h3>
                    <p className="text-zinc-400 mb-3">
                      The load factor (α) is the ratio of occupied slots to total slots. It affects 
                      collision probability and performance.
                    </p>
                    <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                      {`Load Factor (α) = n/m
where:
n = number of stored elements
m = table size

Typical resize threshold: α > 0.7`}
                    </pre>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "performance" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Performance Analysis</h2>
                <p className="text-zinc-400 mb-6">
                  The performance of hash tables depends on the hash function quality, collision 
                  resolution method, and load factor.
                </p>

                <div className="space-y-6">
                  {/* Time Complexity */}
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Time Complexity</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-zinc-300">
                          <th className="text-left p-2">Operation</th>
                          <th className="text-left p-2">Average Case</th>
                          <th className="text-left p-2">Worst Case</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-400">
                        <tr>
                          <td className="p-2">Insert</td>
                          <td className="p-2">O(1)</td>
                          <td className="p-2">O(n)</td>
                        </tr>
                        <tr>
                          <td className="p-2">Search</td>
                          <td className="p-2">O(1)</td>
                          <td className="p-2">O(n)</td>
                        </tr>
                        <tr>
                          <td className="p-2">Delete</td>
                          <td className="p-2">O(1)</td>
                          <td className="p-2">O(n)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Performance Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h3 className="text-white font-semibold mb-2">Hash Function Quality</h3>
                      <ul className="list-disc list-inside text-zinc-400 space-y-1">
                        <li>Uniform distribution</li>
                        <li>Fast computation</li>
                        <li>Minimal collisions</li>
                        <li>Deterministic output</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h3 className="text-white font-semibold mb-2">Implementation Factors</h3>
                      <ul className="list-disc list-inside text-zinc-400 space-y-1">
                        <li>Initial table size</li>
                        <li>Load factor threshold</li>
                        <li>Collision resolution method</li>
                        <li>Resizing strategy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "applications" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Applications</h2>
                <p className="text-zinc-400 mb-6">
                  Hash tables are fundamental data structures used in many applications and systems.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Database Systems</h3>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      <li>Indexing</li>
                      <li>Query optimization</li>
                      <li>Caching systems</li>
                      <li>In-memory databases</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Programming Languages</h3>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      <li>Symbol tables</li>
                      <li>Object property lookup</li>
                      <li>Compiler optimization</li>
                      <li>Memory management</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Network Systems</h3>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      <li>IP routing tables</li>
                      <li>Load balancers</li>
                      <li>Caching servers</li>
                      <li>Network security</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Real-world Examples</h3>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      <li>Password verification</li>
                      <li>File systems</li>
                      <li>Game state storage</li>
                      <li>Blockchain systems</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
