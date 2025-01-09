"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Box, Type, Pointer, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";

export default function BasicsPage() {
  const [activeSection, setActiveSection] = useState("memory");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Memory State
  const [memoryBlocks, setMemoryBlocks] = useState<string[]>(Array(8).fill(""));
  const [allocSize, setAllocSize] = useState(4);
  const [highlightedBlock, setHighlightedBlock] = useState<number | null>(null);
  const [memoryOperations, setMemoryOperations] = useState<string[]>([]);

  // Array State
  const [array, setArray] = useState<number[]>([1, 2, 3, 4]);
  const [newValue, setNewValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [arrayOperations, setArrayOperations] = useState<string[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>("");

  // String State
  const [inputString, setInputString] = useState("Hello");
  const [highlightedChar, setHighlightedChar] = useState<number | null>(null);

  // Simplified pointer state
  const [variables, setVariables] = useState([
    { name: "ptr", value: "0x2000", isHighlighted: false },
    { name: "*ptr", value: "42", isHighlighted: false }
  ]);

  const [pointerOperations, setPointerOperations] = useState<string[]>([]);

  // Add this state to track if we should stop
  const [shouldStop, setShouldStop] = useState(false);

  // Add new state for string operations
  const [secondString, setSecondString] = useState("");
  const [stringOperation, setStringOperation] = useState<"strlen" | "strcpy" | "strcat" | "strcmp" | null>(null);
  const [comparisonResult, setComparisonResult] = useState<number | null>(null);

  // Memory Simulation
  const simulateMemoryAllocation = async () => {
    setIsSimulating(true);
    setShouldStop(false);
    const newMemory = [...memoryBlocks];
    const startIndex = newMemory.findIndex(block => block === "");

    if (startIndex !== -1 && startIndex + allocSize <= newMemory.length) {
      for (let i = 0; i < allocSize; i++) {
        if (shouldStop) {
          setHighlightedBlock(null);
          setIsSimulating(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
        setHighlightedBlock(startIndex + i);
        newMemory[startIndex + i] = `Data ${i}`;
        setMemoryBlocks([...newMemory]);
        setMemoryOperations(prev => [...prev, `Allocating block ${startIndex + i}`]);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
    setHighlightedBlock(null);
    setIsSimulating(false);
  };

  // Update the stop simulation button handler
  const handleStopSimulation = () => {
    setShouldStop(true);
    setHighlightedBlock(null);
  };

  // Array Simulation
  const simulateArrayOperation = async (operation: 'push' | 'pop') => {
    setIsSimulating(true);
    
    if (operation === 'push' && newValue) {
      setCurrentOperation("Pushing new value...");
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      setArray(prev => [...prev, Number(newValue)]);
      setArrayOperations(prev => [...prev, `Pushed ${newValue}`]);
      setNewValue("");
    } else if (operation === 'pop' && array.length > 0) {
      setCurrentOperation("Popping last value...");
      setSelectedIndex(array.length - 1);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      setArray(prev => prev.slice(0, -1));
      setArrayOperations(prev => [...prev, `Popped ${array[array.length - 1]}`]);
    }

    await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
    setSelectedIndex(null);
    setCurrentOperation("");
    setIsSimulating(false);
  };

  // String Operations
  const simulateStringOperation = async (operation: 'strlen' | 'strcpy' | 'strcat' | 'strcmp') => {
    setIsSimulating(true);
    setStringOperation(operation);
    setComparisonResult(null); // Reset comparison result at start
    
    switch(operation) {
      case 'strlen':
        for (let i = 0; i < inputString.length + 1; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
          setHighlightedChar(i);
        }
        break;
        
      case 'strcpy':
        setSecondString(""); // Clear second string
        for (let i = 0; i < inputString.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
          setHighlightedChar(i);
          setSecondString(inputString.slice(0, i + 1));
        }
        break;
        
      case 'strcat':
        if (!secondString) break;
        const baseString = secondString;
        let endIndex = secondString.length - 1; // Position before null terminator
        
        // First highlight the traversal to find the end of str2
        for (let i = 0; i <= endIndex; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
          setHighlightedChar(i);
        }
        
        // Then append str1 characters one by one
        for (let i = 0; i < inputString.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
          setHighlightedChar(i);
          setSecondString(baseString + inputString.slice(0, i + 1));
        }
        break;
        
      case 'strcmp':
        if (!secondString) break;
        let result = 0;
        let i = 0;
        
        while (i < inputString.length || i < secondString.length) {
          await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
          setHighlightedChar(i);
          
          const char1 = i < inputString.length ? inputString[i] : '\0';
          const char2 = i < secondString.length ? secondString[i] : '\0';
          
          if (char1 !== char2) {
            result = char1.charCodeAt(0) - char2.charCodeAt(0);
            break;
          }
          
          if (char1 === '\0' && char2 === '\0') break;
          i++;
        }
        
        setComparisonResult(result);
        await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed)); // Keep result visible longer
        break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500 / simulationSpeed));
    setHighlightedChar(null);
    setStringOperation(null);
    if (operation !== 'strcmp') setComparisonResult(null); // Don't clear comparison result for strcmp
    setIsSimulating(false);
  };

  // New pointer operations
  const simulatePointerOperation = async (operation: 'dereference' | 'modify') => {
    setIsSimulating(true);
    const newVariables = [...variables];
    
    if (operation === 'dereference') {
      // Highlight pointer
      newVariables[0].isHighlighted = true;
      setVariables(newVariables);
      setPointerOperations(prev => [...prev, "Following pointer at 0x2000"]);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      
      // Highlight value
      newVariables[0].isHighlighted = false;
      newVariables[1].isHighlighted = true;
      setVariables(newVariables);
      setPointerOperations(prev => [...prev, "Reading value: 42"]);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
    } else if (operation === 'modify') {
      // Highlight pointer
      newVariables[0].isHighlighted = true;
      setVariables(newVariables);
      setPointerOperations(prev => [...prev, "Following pointer at 0x2000"]);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
      
      // Modify and highlight value
      newVariables[0].isHighlighted = false;
      newVariables[1].isHighlighted = true;
      newVariables[1].value = "100";
      setVariables(newVariables);
      setPointerOperations(prev => [...prev, "Writing new value: 100"]);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
    }
    
    // Reset highlights
    newVariables[0].isHighlighted = false;
    newVariables[1].isHighlighted = false;
    setVariables(newVariables);
    setIsSimulating(false);
  };

  const resetPointers = () => {
    setVariables([
      { name: "ptr", value: "0x2000", isHighlighted: false },
      { name: "*ptr", value: "42", isHighlighted: false }
    ]);
    setPointerOperations([]);
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

        <h1 className="text-4xl font-bold mb-8 text-white">Basic Data Structures</h1>

        {/* Global Controls Card */}
        <Card className="p-4 mb-6 bg-zinc-900/50 transition-all duration-300 ease-out transform-gpu will-change-transform">
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

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "memory", icon: Box },
            { id: "arrays", icon: ArrowRight },
            { id: "strings", icon: Type },
            { id: "pointers", icon: Pointer }
          ].map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 ${
                activeSection === id 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section Cards */}
            {activeSection === "memory" && (
              <Card className="p-6 bg-zinc-800/50 transition-all duration-300 ease-out transform-gpu will-change-transform">
                <h2 className="text-2xl font-semibold mb-4 text-white">Memory Allocation</h2>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="number"
                    value={allocSize}
                    onChange={(e) => setAllocSize(Number(e.target.value))}
                    min={1}
                    max={8}
                    className="w-24 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateMemoryAllocation()}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Allocation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMemoryBlocks(Array(8).fill(""));
                      setMemoryOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-zinc-300 text-black hover:text-black hover:bg-white hover:border-zinc-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {memoryBlocks.map((block, index) => (
                    <motion.div
                      key={index}
                      className={`relative h-24 border-2 rounded flex flex-col items-center justify-center
                        ${highlightedBlock === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                        text-white`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-xs text-zinc-300 absolute top-1">
                        0x{(index * 4 + 1000).toString(16)}
                      </span>
                      <span className="text-sm text-white">{block || "Empty"}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {memoryOperations.map((op, index) => (
                      <div key={index} className="text-sm text-zinc-300">
                        {op}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Memory Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Dynamic memory allocation in C
int* array = (int*)malloc(4 * sizeof(int));  // Allocate memory for 4 integers

// Initialize the allocated memory
for(int i = 0; i < 4; i++) {
    array[i] = i + 1;  // Store values 1, 2, 3, 4
}

// Use the allocated memory
printf("First value: %d\\n", array[0]);  // Access elements

// Don't forget to free when done!
free(array);  // Release allocated memory`}
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

            {activeSection === "arrays" && (
              <Card className="p-6 bg-zinc-800/50 transition-all duration-300 ease-out transform-gpu will-change-transform">
                <h2 className="text-2xl font-semibold mb-4 text-white">Arrays</h2>
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter a number"
                    className="w-40 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => simulateArrayOperation('push')}
                    disabled={isSimulating || !newValue}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Push
                  </Button>
                  <Button 
                    onClick={() => simulateArrayOperation('pop')}
                    variant="outline"
                    disabled={isSimulating || array.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Pop
                  </Button>
                </div>

                {currentOperation && (
                  <div className="text-sm text-blue-500 mb-4">
                    {currentOperation}
                  </div>
                )}

                <div className="flex gap-2 mb-6">
                  {array.map((value, index) => (
                    <motion.div
                      key={index}
                      className={`w-16 h-16 border-2 rounded flex items-center justify-center cursor-pointer
                        ${selectedIndex === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                        text-white`}
                      onClick={() => !isSimulating && setSelectedIndex(index)}
                      whileHover={{ scale: 1.1 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {arrayOperations.map((op, index) => (
                      <div key={index} className="text-sm text-zinc-400">
                        {op}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Arrays Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Array operations in C
int arr[4] = {1, 2, 3, 4};  // Initialize array
int length = sizeof(arr) / sizeof(arr[0]);

// Push (append) - need to manage size manually in C
int newValue = 5;
if (length < MAX_SIZE) {
    arr[length] = newValue;
    length++;
}

// Pop (remove last element)
if (length > 0) {
    length--;  // Decrease logical size
}

// Access elements
for(int i = 0; i < length; i++) {
    printf("%d ", arr[i]);
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

            {activeSection === "strings" && (
              <Card className="p-6 bg-zinc-800/50 transition-all duration-300 ease-out transform-gpu will-change-transform">
                <h2 className="text-2xl font-semibold mb-4 text-white">Strings</h2>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex gap-4 items-center">
                    <Input
                      value={inputString}
                      onChange={(e) => setInputString(e.target.value)}
                      placeholder="Enter first string"
                      className="w-40 text-white bg-zinc-900/50 border-zinc-700"
                      disabled={isSimulating}
                    />
                    <Input
                      value={secondString}
                      onChange={(e) => setSecondString(e.target.value)}
                      placeholder="Enter second string"
                      className="w-40 text-white bg-zinc-900/50 border-zinc-700"
                      disabled={isSimulating}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => simulateStringOperation('strlen')}
                      disabled={isSimulating || !inputString}
                      className="bg-transparent text-white hover:bg-zinc-800"
                    >
                      strlen(str1)
                    </Button>
                    <Button 
                      onClick={() => simulateStringOperation('strcpy')}
                      disabled={isSimulating || !inputString}
                      className="bg-transparent text-white hover:bg-zinc-800"
                    >
                      strcpy(str1, str2)
                    </Button>
                    <Button 
                      onClick={() => simulateStringOperation('strcat')}
                      disabled={isSimulating || !inputString || !secondString}
                      className="bg-transparent text-white hover:bg-zinc-800"
                    >
                      strcat(str1, str2)
                    </Button>
                    <Button 
                      onClick={() => simulateStringOperation('strcmp')}
                      disabled={isSimulating || !inputString || !secondString}
                      className="bg-transparent text-white hover:bg-zinc-800"
                    >
                      strcmp(str1, str2)
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  {/* First String */}
                  <div>
                    <span className="text-sm text-zinc-300 mb-2 block">str1:</span>
                    <div className="flex gap-2">
                      {[...inputString.split(''), '\0'].map((char, index) => (
                        <motion.div
                          key={`str1-${index}`}
                          className={`relative h-20 w-16 border-2 rounded flex flex-col items-center
                            ${highlightedChar === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                            text-white`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-xs text-zinc-300 mt-2">{index}</span>
                          <span className="text-lg text-white my-1">{char === '\0' ? '\\0' : char}</span>
                          <span className="text-xs text-zinc-300">{char.charCodeAt(0) || '0'}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Second String (shown for strcpy, strcat, strcmp) */}
                  {(stringOperation === 'strcpy' || stringOperation === 'strcat' || stringOperation === 'strcmp' || secondString) && (
                    <div>
                      <span className="text-sm text-zinc-300 mb-2 block">str2:</span>
                      <div className="flex gap-2">
                        {[...secondString.split(''), '\0'].map((char, index) => (
                          <motion.div
                            key={`str2-${index}`}
                            className={`relative h-20 w-16 border-2 rounded flex flex-col items-center
                              ${highlightedChar === index ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                              text-white`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-xs text-zinc-300 mt-2">{index}</span>
                            <span className="text-lg text-white my-1">{char === '\0' ? '\\0' : char}</span>
                            <span className="text-xs text-zinc-300">{char.charCodeAt(0) || '0'}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Operation Result */}
                {stringOperation === 'strlen' && (
                  <div className="text-white mt-4">
                    Length: {inputString.length} characters
                  </div>
                )}
                {stringOperation === 'strcmp' && comparisonResult !== null && (
                  <div className="text-white mt-4">
                    Comparison result: {comparisonResult} 
                    ({comparisonResult === 0 ? 'strings are equal' : 
                      comparisonResult > 0 ? 'str1 is greater' : 'str2 is greater'})
                  </div>
                )}

                {/* Add Strings Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// String operations in C
#include <string.h>

char str1[50] = "Hello";
char str2[50] = "World";

// Get string length
size_t len = strlen(str1);  // Returns 5

// Copy strings
strcpy(str2, str1);  // str2 is now "Hello"

// Concatenate strings
strcat(str1, str2);  // str1 is now "HelloWorld"

// Compare strings
int result = strcmp(str1, str2);
if (result == 0) {
    printf("Strings are equal\\n");
} else if (result < 0) {
    printf("str1 comes before str2\\n");
} else {
    printf("str1 comes after str2\\n");
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

            {activeSection === "pointers" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Pointers</h2>
                
                {/* Add explanation */}
                <div className="mb-6 text-zinc-300 space-y-2">
                  <p>Memory address <span className="text-green-400">0x2000</span> contains the value <span className="text-green-400">42</span></p>
                  <p><code>ptr</code> stores the memory address</p>
                  <p><code>*ptr</code> accesses the value at that address</p>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => simulatePointerOperation('dereference')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Read Value
                  </Button>
                  <Button 
                    onClick={() => simulatePointerOperation('modify')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Modify Value
                  </Button>
                </div>

                {/* Simplified Memory Visualization */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  {variables.map((variable, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 border-2 rounded flex flex-col items-center justify-center
                        ${variable.isHighlighted ? 'border-green-500 bg-green-500/10' : 'border-zinc-700'}
                        text-white`}
                    >
                      <span className="text-sm text-zinc-300">{variable.name}</span>
                      <span className="text-lg text-white">{variable.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {pointerOperations.map((op, index) => (
                      <div key={index} className="text-sm text-zinc-400">
                        {op}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add C Code Example with syntax highlighting */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Example of pointer usage in C
int value = 42;           // Value stored at memory address (e.g., 0x2000)
int* ptr = &value;        // ptr now stores the memory address of value

// Reading the value through the pointer
int read_value = *ptr;    // read_value is now 42

// Modifying the value through the pointer
*ptr = 100;              // value is now 100`}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
