"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Link as LinkIcon, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";

// Define node type
type Node = {
  value: number;
  next: Node | null;
  prev?: Node | null; // For doubly linked lists
};

export default function LinkedListsPage() {
  const [activeSection, setActiveSection] = useState("singly");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Singly Linked List State
  const [singlyList, setSinglyList] = useState<Node[]>([
    { value: 1, next: null },
    { value: 2, next: null },
    { value: 3, next: null }
  ]);
  const [newValue, setNewValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [operations, setOperations] = useState<string[]>([]);

  // Doubly Linked List State
  const [doublyList, setDoublyList] = useState<Node[]>([
    { value: 1, next: null, prev: null },
    { value: 2, next: null, prev: null },
    { value: 3, next: null, prev: null }
  ]);

  // Circular List State
  const [circularList, setCircularList] = useState<Node[]>([
    { value: 1, next: null },
    { value: 2, next: null },
    { value: 3, next: null }
  ]);

  // List Operations
  const simulateInsert = async (listType: 'singly' | 'doubly' | 'circular', position: 'start' | 'end') => {
    if (!newValue) return;
    setIsSimulating(true);
    const value = parseInt(newValue);
    
    if (listType === 'singly') {
      const newList = [...singlyList];
      const newNode: Node = { value, next: null };
      
      if (position === 'start') {
        setHighlightedNode(0);
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        newNode.next = newList[0] || null;
        newList.unshift(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at start`,
          `New node (${value}) points to previous head (${newList[1]?.value || 'null'})`,
          `New node becomes the head of the list`
        ]);
      } else {
        for (let i = 0; i < newList.length; i++) {
          setHighlightedNode(i);
          await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        }
        newList.push(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at end`,
          `Previous last node (${newList[newList.length - 2]?.value}) now points to new node`,
          `New node (${value}) points to null`
        ]);
      }
      
      setSinglyList(newList);
    } else if (listType === 'doubly') {
      const newList = [...doublyList];
      const newNode: Node = { 
        value, 
        next: position === 'start' ? newList[0] || null : null,
        prev: position === 'end' && newList.length ? newList[newList.length - 1] : null
      };
      
      if (position === 'start') {
        setHighlightedNode(0);
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        if (newList[0]) {
          newList[0].prev = newNode;
        }
        newList.unshift(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at start`,
          `New node (${value}) points forward to previous head (${newList[1]?.value || 'null'})`,
          `Previous head now points backward to new node (${value})`,
          `New node becomes the head of the list`
        ]);
      } else {
        for (let i = 0; i < newList.length; i++) {
          setHighlightedNode(i);
          await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        }
        if (newList.length > 0) {
          newList[newList.length - 1].next = newNode;
        }
        newList.push(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at end`,
          `Previous last node (${newList[newList.length - 2]?.value}) points forward to new node`,
          `New node (${value}) points backward to previous last node`,
          `New node points forward to null`
        ]);
      }
      
      setDoublyList(newList);
    } else if (listType === 'circular') {
      const newList = [...circularList];
      const newNode: Node = { value, next: null };
      
      if (position === 'start') {
        setHighlightedNode(0);
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        newNode.next = newList[0] || null;
        newList.unshift(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at start`,
          `New node (${value}) points to previous head (${newList[1]?.value || 'null'})`,
          `Last node now points to new head (${value})`,
          `List maintains circular structure`
        ]);
      } else {
        for (let i = 0; i < newList.length; i++) {
          setHighlightedNode(i);
          await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        }
        newList.push(newNode);
        setOperations(prev => [
          ...prev, 
          `Inserted ${value} at end`,
          `Previous last node now points to new node (${value})`,
          `New node (${value}) points back to head (${newList[0]?.value})`,
          `List maintains circular structure`
        ]);
      }
      
      setCircularList(newList);
    }
    
    setNewValue("");
    setHighlightedNode(null);
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

        <h1 className="text-4xl font-bold mb-8 text-white">Linked Lists</h1>

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
            { id: "singly", label: "Singly Linked" },
            { id: "doubly", label: "Doubly Linked" },
            { id: "circular", label: "Circular" },
            { id: "operations", label: "Operations" }
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => {
                setActiveSection(id);
                setOperations([]); // Reset operations log when switching tabs
              }}
              className={`flex items-center gap-2 ${
                activeSection === id 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
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
            {activeSection === "singly" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Singly Linked List</h2>
                <p className="text-zinc-400 mb-6">
                  A singly linked list is a sequence of nodes where each node contains data and a pointer to the next node. 
                  The last node points to null. This structure allows for efficient insertion at the beginning and sequential access, 
                  but requires traversal to reach specific positions.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateInsert('singly', 'start')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at Start
                  </Button>
                  <Button 
                    onClick={() => simulateInsert('singly', 'end')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at End
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSinglyList([
                        { value: 1, next: null },
                        { value: 2, next: null },
                        { value: 3, next: null }
                      ]);
                      setOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 text-black bg-white hover:bg-zinc-100 hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* List Visualization */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto p-4">
                  {singlyList.map((node, index) => (
                    <div key={index} className="flex items-center">
                      <motion.div
                        className={`w-16 h-16 border-2 rounded flex items-center justify-center
                          ${highlightedNode === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                          text-white`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {node.value}
                      </motion.div>
                      {index < singlyList.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                  ))}
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

                {/* Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Singly Linked List implementation in C
struct Node {
    int value;
    struct Node* next;
};

// Insert at beginning
struct Node* insertAtStart(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    newNode->next = head;
    return newNode;
}

// Insert at end
struct Node* insertAtEnd(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    newNode->next = NULL;
    
    if (head == NULL) return newNode;
    
    struct Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = newNode;
    return head;
}`}
                    language="c"
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </Card>
            )}

            {activeSection === "doubly" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Doubly Linked List</h2>
                <p className="text-zinc-400 mb-6">
                  A doubly linked list extends the singly linked list by adding a pointer to the previous node. 
                  Each node contains data, a pointer to the next node, and a pointer to the previous node. 
                  This allows for bidirectional traversal and more efficient operations at the cost of extra memory.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateInsert('doubly', 'start')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at Start
                  </Button>
                  <Button 
                    onClick={() => simulateInsert('doubly', 'end')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at End
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDoublyList([
                        { value: 1, next: null, prev: null },
                        { value: 2, next: null, prev: null },
                        { value: 3, next: null, prev: null }
                      ]);
                      setOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 text-black bg-white hover:bg-zinc-100 hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* List Visualization */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto p-4">
                  {doublyList.map((node, index) => (
                    <div key={index} className="flex items-center">
                      <ArrowRight 
                        className={`w-6 h-6 rotate-180 ${index > 0 ? 'text-zinc-500' : 'opacity-0'}`}
                      />
                      <motion.div
                        className={`w-16 h-16 border-2 rounded flex items-center justify-center
                          ${highlightedNode === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                          text-white`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {node.value}
                      </motion.div>
                      {index < doublyList.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                  ))}
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

                {/* Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Doubly Linked List implementation in C
struct Node {
    int value;
    struct Node* next;
    struct Node* prev;
};

// Insert at beginning
struct Node* insertAtStart(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    newNode->prev = NULL;
    newNode->next = head;
    
    if (head != NULL) {
        head->prev = newNode;
    }
    
    return newNode;
}

// Insert at end
struct Node* insertAtEnd(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    newNode->next = NULL;
    
    if (head == NULL) {
        newNode->prev = NULL;
        return newNode;
    }
    
    struct Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    
    current->next = newNode;
    newNode->prev = current;
    return head;
}`}
                    language="c"
                  >
                    {({ tokens, getLineProps, getTokenProps }) => (
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </Card>
            )}

            {activeSection === "circular" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Circular Linked List</h2>
                <p className="text-zinc-400 mb-6">
                  A circular linked list is a variation where the last node points back to the first node, creating a circle. 
                  This can be implemented with either singly or doubly linked lists. It's useful for applications that need 
                  continuous cycling through elements, like round-robin scheduling.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateInsert('circular', 'start')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at Start
                  </Button>
                  <Button 
                    onClick={() => simulateInsert('circular', 'end')}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert at End
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCircularList([
                        { value: 1, next: null },
                        { value: 2, next: null },
                        { value: 3, next: null }
                      ]);
                      setOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 text-black bg-white hover:bg-zinc-100 hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Circular list visualization with ellipsis */}
                <div className="relative flex items-center gap-2 mb-6 overflow-x-auto p-4">
                  {circularList.map((node, index) => (
                    <div key={index} className="flex items-center">
                      <motion.div
                        className={`w-16 h-16 border-2 rounded flex items-center justify-center
                          ${highlightedNode === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                          text-white relative z-10 bg-zinc-900`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {node.value}
                      </motion.div>
                      <ArrowRight className="w-6 h-6 text-zinc-500" />
                    </div>
                  ))}
                  <div className="flex items-center">
                    <motion.div
                      className="w-16 h-16 border-2 border-zinc-700 rounded flex items-center justify-center
                        text-white bg-zinc-900 opacity-50"
                    >
                      {circularList[0]?.value || 1}
                    </motion.div>
                    <div className="text-zinc-500 ml-4 text-2xl">...</div>
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

                {/* Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Circular Linked List implementation in C
struct Node {
    int value;
    struct Node* next;
};

// Insert at beginning
struct Node* insertAtStart(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    
    if (head == NULL) {
        newNode->next = newNode;  // Points to itself
        return newNode;
    }
    
    // Find the last node
    struct Node* last = head;
    while (last->next != head) {
        last = last->next;
    }
    
    newNode->next = head;
    last->next = newNode;
    return newNode;
}

// Insert at end
struct Node* insertAtEnd(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    
    if (head == NULL) {
        newNode->next = newNode;  // Points to itself
        return newNode;
    }
    
    // Find the last node
    struct Node* last = head;
    while (last->next != head) {
        last = last->next;
    }
    
    last->next = newNode;
    newNode->next = head;
    return head;
}`}
                    language="c"
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </Card>
            )}

            {activeSection === "operations" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Common List Operations</h2>
                <p className="text-zinc-400 mb-6">
                  Linked lists support various operations like traversal, searching, insertion, deletion, and reversal. 
                  Understanding these operations is crucial as they form the building blocks for more complex algorithms 
                  and data structure manipulations.
                </p>

                {/* Code Examples */}
                <div className="space-y-8">
                  {/* Traversal */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Traversal</h3>
                    <Highlight
                      theme={themes.vsDark}
                      code={`// Traverse a linked list
void traverse(struct Node* head) {
    struct Node* current = head;
    
    while (current != NULL) {
        printf("%d -> ", current->value);
        current = current->next;
    }
    printf("NULL\\n");
}`}
                      language="c"
                    >
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>

                  {/* Search */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Search</h3>
                    <Highlight
                      theme={themes.vsDark}
                      code={`// Search for a value in the list
struct Node* search(struct Node* head, int target) {
    struct Node* current = head;
    
    while (current != NULL) {
        if (current->value == target) {
            return current;  // Found the value
        }
        current = current->next;
    }
    return NULL;  // Value not found
}`}
                      language="c"
                    >
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>

                  {/* Delete */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Delete</h3>
                    <Highlight
                      theme={themes.vsDark}
                      code={`// Delete a node with given value
struct Node* delete(struct Node* head, int value) {
    if (head == NULL) return NULL;
    
    // If head node holds the value to be deleted
    if (head->value == value) {
        struct Node* temp = head->next;
        free(head);
        return temp;
    }
    
    struct Node* current = head;
    while (current->next != NULL) {
        if (current->next->value == value) {
            struct Node* temp = current->next;
            current->next = temp->next;
            free(temp);
            return head;
        }
        current = current->next;
    }
    return head;
}`}
                      language="c"
                    >
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>

                  {/* Reverse */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Reverse</h3>
                    <Highlight
                      theme={themes.vsDark}
                      code={`// Reverse a linked list
struct Node* reverse(struct Node* head) {
    struct Node *prev = NULL, *current = head, *next = NULL;
    
    while (current != NULL) {
        next = current->next;    // Store next
        current->next = prev;    // Reverse current node's pointer
        prev = current;          // Move prev to current
        current = next;          // Move current to next
    }
    return prev;  // prev is the new head
}`}
                      language="c"
                    >
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded overflow-x-auto">
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
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
