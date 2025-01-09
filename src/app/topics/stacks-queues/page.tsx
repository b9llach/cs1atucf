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
import { AIChatBox } from "@/components/ai-chat";

type StackItem = {
  value: number;
};

type QueueItem = {
  value: number;
};

export default function StacksQueuesPage() {
  const [activeSection, setActiveSection] = useState("stack");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Stack State
  const [stack, setStack] = useState<StackItem[]>([
    { value: 1 },
    { value: 2 },
    { value: 3 }
  ]);
  const [newStackValue, setNewStackValue] = useState("");
  const [highlightedStackItem, setHighlightedStackItem] = useState<number | null>(null);
  const [stackOperations, setStackOperations] = useState<string[]>([]);

  // Queue State
  const [queue, setQueue] = useState<QueueItem[]>([
    { value: 1 },
    { value: 2 },
    { value: 3 }
  ]);
  const [newQueueValue, setNewQueueValue] = useState("");
  const [highlightedQueueItem, setHighlightedQueueItem] = useState<number | null>(null);
  const [queueOperations, setQueueOperations] = useState<string[]>([]);

  // Stack Operations
  const simulateStackOperation = async (operation: 'push' | 'pop') => {
    setIsSimulating(true);
    
    if (operation === 'push' && newStackValue) {
      const value = parseInt(newStackValue);
      setHighlightedStackItem(stack.length);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      setStack(prev => [...prev, { value }]);
      setStackOperations(prev => [
        ...prev,
        `Pushed ${value} onto the stack`,
        `New item becomes the top of the stack`
      ]);
    } else if (operation === 'pop' && stack.length > 0) {
      setHighlightedStackItem(stack.length - 1);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      const poppedValue = stack[stack.length - 1].value;
      setStack(prev => prev.slice(0, -1));
      setStackOperations(prev => [
        ...prev,
        `Popped ${poppedValue} from the stack`,
        `Previous item becomes the new top`
      ]);
    }

    setNewStackValue("");
    setHighlightedStackItem(null);
    setIsSimulating(false);
  };

  // Queue Operations
  const simulateQueueOperation = async (operation: 'enqueue' | 'dequeue') => {
    setIsSimulating(true);
    
    if (operation === 'enqueue' && newQueueValue) {
      const value = parseInt(newQueueValue);
      setHighlightedQueueItem(queue.length);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      setQueue(prev => [...prev, { value }]);
      setQueueOperations(prev => [
        ...prev,
        `Enqueued ${value} at the back of the queue`,
        `New item becomes the last element`
      ]);
    } else if (operation === 'dequeue' && queue.length > 0) {
      setHighlightedQueueItem(0);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      const dequeuedValue = queue[0].value;
      setQueue(prev => prev.slice(1));
      setQueueOperations(prev => [
        ...prev,
        `Dequeued ${dequeuedValue} from the front of the queue`,
        `All elements shift forward one position`
      ]);
    }

    setNewQueueValue("");
    setHighlightedQueueItem(null);
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

        <h1 className="text-4xl font-bold mb-8 text-white">Stacks & Queues</h1>

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
            { id: "stack", label: "Stack Operations" },
            { id: "queue", label: "Queue Operations" },
            { id: "implementation", label: "Implementation Methods" },
            { id: "applications", label: "Applications" }
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => {
                setActiveSection(id);
                setStackOperations([]);
                setQueueOperations([]);
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
            {activeSection === "stack" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Stack Operations (LIFO)</h2>
                <p className="text-zinc-400 mb-6">
                  A stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end, 
                  called the top. Think of it like a stack of plates - you can only add or remove from the top.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newStackValue}
                    onChange={(e) => setNewStackValue(e.target.value)}
                    placeholder="Enter value"
                    type="number"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateStackOperation('push')}
                    disabled={isSimulating || !newStackValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Push
                  </Button>
                  <Button 
                    onClick={() => simulateStackOperation('pop')}
                    disabled={isSimulating || stack.length === 0}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Pop
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStack([
                        { value: 1 },
                        { value: 2 },
                        { value: 3 }
                      ]);
                      setStackOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Stack Visualization */}
                <div className="flex flex-col-reverse items-center gap-2 mb-6 p-4 bg-black/30 rounded min-h-[16rem]">
                  {stack.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`w-32 h-16 border-2 rounded flex items-center justify-center
                        ${highlightedStackItem === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                        text-white relative`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.value}
                      {index === stack.length - 1 && (
                        <div className="absolute -right-20 text-sm text-zinc-400">← Top</div>
                      )}
                    </motion.div>
                  ))}
                  <div className="w-32 border-b-2 border-zinc-700" />
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {stackOperations.map((op, index) => (
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
                    code={`// Stack implementation using array
#define MAX_SIZE 100

struct Stack {
    int items[MAX_SIZE];
    int top;
};

// Push operation
void push(struct Stack* stack, int value) {
    if (stack->top == MAX_SIZE - 1) {
        printf("Stack overflow\\n");
        return;
    }
    stack->items[++stack->top] = value;
}

// Pop operation
int pop(struct Stack* stack) {
    if (stack->top == -1) {
        printf("Stack underflow\\n");
        return -1;
    }
    return stack->items[stack->top--];
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

            {activeSection === "queue" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Queue Operations (FIFO)</h2>
                <p className="text-zinc-400 mb-6">
                  A queue is a First-In-First-Out (FIFO) data structure where elements are added at one end (rear) 
                  and removed from the other end (front). Similar to people waiting in line - the first person to join 
                  is the first to leave.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newQueueValue}
                    onChange={(e) => setNewQueueValue(e.target.value)}
                    placeholder="Enter value"
                    type="number"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateQueueOperation('enqueue')}
                    disabled={isSimulating || !newQueueValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Enqueue
                  </Button>
                  <Button 
                    onClick={() => simulateQueueOperation('dequeue')}
                    disabled={isSimulating || queue.length === 0}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Dequeue
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setQueue([
                        { value: 1 },
                        { value: 2 },
                        { value: 3 }
                      ]);
                      setQueueOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Queue Visualization */}
                <div className="flex flex-col-reverse items-center gap-2 mb-6 p-4 bg-black/30 rounded min-h-[16rem]">
                  {queue.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`w-32 h-16 border-2 rounded flex items-center justify-center
                        ${highlightedQueueItem === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                        text-white relative`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.value}
                      {index === queue.length - 1 && (
                        <div className="absolute -right-20 text-sm text-zinc-400">← Front</div>
                      )}
                    </motion.div>
                  ))}
                  <div className="w-32 border-b-2 border-zinc-700" />
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {queueOperations.map((op, index) => (
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
                    code={`// Queue implementation using array
#define MAX_SIZE 100

struct Queue {
    int items[MAX_SIZE];
    int front;
    int rear;
};

// Enqueue operation
void enqueue(struct Queue* queue, int value) {
    if (queue->rear == MAX_SIZE - 1) {
        printf("Queue overflow\\n");
        return;
    }
    queue->items[++queue->rear] = value;
}

// Dequeue operation
int dequeue(struct Queue* queue) {
    if (queue->front == queue->rear) {
        printf("Queue underflow\\n");
        return -1;
    }
    return queue->items[++queue->front];
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

            {activeSection === "implementation" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Implementation Methods</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Array Implementation</h3>
                    <div className="space-y-2 text-zinc-400">
                      <p><span className="text-white font-semibold">Advantages:</span></p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Simple to implement</li>
                        <li>Memory efficient (no extra pointers needed)</li>
                        <li>Good cache locality</li>
                      </ul>
                      <p><span className="text-white font-semibold">Disadvantages:</span></p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Fixed size (may lead to stack overflow/underflow)</li>
                        <li>Resizing is expensive (requires creating new array)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Linked List Implementation</h3>
                    <div className="space-y-2 text-zinc-400">
                      <p><span className="text-white font-semibold">Advantages:</span></p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Dynamic size (grows and shrinks as needed)</li>
                        <li>No overflow unless memory is full</li>
                        <li>Easier insertion and deletion</li>
                      </ul>
                      <p><span className="text-white font-semibold">Disadvantages:</span></p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Extra memory for storing node pointers</li>
                        <li>No random access</li>
                        <li>Not cache-friendly</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-white">Time Complexity Comparison:</h3>
                    <table className="w-full text-sm text-zinc-400">
                      <thead>
                        <tr className="text-white">
                          <th className="text-left p-2">Operation</th>
                          <th className="text-left p-2">Array</th>
                          <th className="text-left p-2">Linked List</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2">Push/Pop (Stack)</td>
                          <td className="p-2">O(1)</td>
                          <td className="p-2">O(1)</td>
                        </tr>
                        <tr>
                          <td className="p-2">Enqueue/Dequeue (Queue)</td>
                          <td className="p-2">O(1) or O(n)*</td>
                          <td className="p-2">O(1)</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-zinc-500 mt-2">* O(n) for array-based queue if shifting elements is required</p>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "applications" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Applications</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Stack Applications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Programming Languages</h4>
                        <ul className="list-disc list-inside text-zinc-400 space-y-1">
                          <li>Function call management (call stack)</li>
                          <li>Expression evaluation</li>
                          <li>Syntax parsing</li>
                          <li>Recursion implementation</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">User Interfaces</h4>
                        <ul className="list-disc list-inside text-zinc-400 space-y-1">
                          <li>Undo/Redo operations</li>
                          <li>Browser history</li>
                          <li>Back button functionality</li>
                          <li>Text editor operations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Queue Applications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Operating Systems</h4>
                        <ul className="list-disc list-inside text-zinc-400 space-y-1">
                          <li>Process scheduling</li>
                          <li>Print spooling</li>
                          <li>Interrupt handling</li>
                          <li>Resource sharing</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Real-world Systems</h4>
                        <ul className="list-disc list-inside text-zinc-400 space-y-1">
                          <li>Customer service systems</li>
                          <li>Traffic management</li>
                          <li>Printer queue management</li>
                          <li>Web server request handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Advanced Applications</h3>
                    <div className="text-zinc-400 space-y-2">
                      <p><span className="text-white font-semibold">Graph Algorithms:</span> Both stacks and queues are fundamental in graph traversal algorithms (DFS uses stacks, BFS uses queues)</p>
                      <p><span className="text-white font-semibold">Memory Management:</span> Used in garbage collection and memory pool management</p>
                      <p><span className="text-white font-semibold">Network Protocols:</span> Managing packet ordering and routing in network communications</p>
                    </div>
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
