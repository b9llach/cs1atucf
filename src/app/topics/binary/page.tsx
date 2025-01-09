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

type BinaryDigit = {
  value: number;
  position: number;
  weight: number;
};

export default function BinaryPage() {
  const [activeSection, setActiveSection] = useState("conversion");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Binary Conversion State
  const [decimalValue, setDecimalValue] = useState("");
  const [binaryDigits, setBinaryDigits] = useState<BinaryDigit[]>([]);
  const [highlightedDigit, setHighlightedDigit] = useState<number | null>(null);
  const [conversionSteps, setConversionSteps] = useState<string[]>([]);

  // Binary to Decimal Conversion
  const convertToBinary = async (decimal: number) => {
    setIsSimulating(true);
    // Clear previous state
    setBinaryDigits([]);
    setConversionSteps([]);
    
    let num = decimal;
    // Calculate the highest power of 2 needed, and add one more to demonstrate
    const maxPower = Math.floor(Math.log2(decimal)) + 1;
    const binaryArray: BinaryDigit[] = [];
    const steps: string[] = [];

    // Start from one power higher than needed
    for (let position = maxPower; position >= 0; position--) {
      const weight = Math.pow(2, position);
      const value = num >= weight ? 1 : 0;
      
      // Add new digit and update steps
      binaryArray.push({ value, position, weight });
      setHighlightedDigit(position);
      setBinaryDigits([...binaryArray]);
      
      if (position === maxPower) {
        steps.push(`${num} < 2^${position} (${weight}), so we don't need this position`);
      } else if (value === 1) {
        steps.push(`${num} ≥ 2^${position} (${weight}), subtract ${weight}`);
        num -= weight;
      } else {
        steps.push(`${num} < 2^${position} (${weight}), keep ${num}`);
      }
      setConversionSteps([...steps]);
      
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
    }

    setHighlightedDigit(null);
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

        <h1 className="text-4xl font-bold mb-8 text-white">Binary & Bits</h1>

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
            { id: "conversion", label: "Binary Conversion" },
            { id: "operations", label: "Bitwise Operations" },
            { id: "arithmetic", label: "Binary Arithmetic" },
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => {
                setActiveSection(id);
                setConversionSteps([]);
                setBinaryDigits([]);
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
            {activeSection === "conversion" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Binary Conversion</h2>
                <p className="text-zinc-400 mb-6">
                  Binary is a base-2 number system where numbers are represented using only 0s and 1s. 
                  Each position represents a power of 2, and we can convert decimal numbers to binary 
                  through repeated division by 2.
                </p>
                
                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={decimalValue}
                    onChange={(e) => setDecimalValue(e.target.value)}
                    placeholder="Enter decimal"
                    type="number"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => convertToBinary(parseInt(decimalValue))}
                    disabled={isSimulating || !decimalValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Convert
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setBinaryDigits([]);
                      setConversionSteps([]);
                      setDecimalValue("");
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Binary Visualization */}
                <div className="mb-6 p-4 bg-black/30 rounded min-h-[12rem]">
                  <div className="flex justify-center gap-2">
                    {binaryDigits.map((digit, index) => (
                      <motion.div
                        key={`${digit.position}-${digit.value}`}
                        className={`flex flex-col items-center ${
                          highlightedDigit === digit.position 
                            ? 'text-green-500' 
                            : 'text-white'
                        }`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: 0.1 * index
                        }}
                      >
                        <div className="text-xs text-zinc-500">2^{digit.position}</div>
                        <div className={`w-12 h-12 border-2 rounded flex items-center justify-center
                          text-xl font-mono mb-1
                          ${highlightedDigit === digit.position ? 'border-green-500' : 'border-zinc-700'}`}
                        >
                          {digit.value}
                        </div>
                        <div className="text-xs text-zinc-500">{digit.weight}</div>
                      </motion.div>
                    ))}
                  </div>
                  {binaryDigits.length > 0 && (
                    <div className="mt-4 text-center text-white">
                      Binary: <span className="font-mono">
                        {binaryDigits.map(d => d.value).join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conversion Steps */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Conversion Steps:</h3>
                  <div className="space-y-1">
                    {conversionSteps.map((step, index) => (
                      <div key={index} className="text-sm text-zinc-400">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Example */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`// Function to convert decimal to binary
void decimalToBinary(int decimal) {
    // Cannot store numbers larger than 32 bits
    int binary[32];
    int i = 0;
    
    // Continue dividing by 2 until quotient becomes 0
    while (decimal > 0) {
        binary[i] = decimal % 2;
        decimal = decimal / 2;
        i++;
    }
    
    // Print binary array in reverse order
    for (int j = i - 1; j >= 0; j--) {
        printf("%d", binary[j]);
    }
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
                <h2 className="text-2xl font-semibold mb-2 text-white">Bitwise Operations</h2>
                <p className="text-zinc-400 mb-6">
                  Bitwise operations perform manipulation of individual bits in binary numbers. 
                  These operations are fundamental to low-level programming and optimization.
                </p>

                {/* Operation Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { id: "AND", symbol: "&", desc: "Sets each bit to 1 if both bits are 1" },
                    { id: "OR", symbol: "|", desc: "Sets each bit to 1 if at least one bit is 1" },
                    { id: "XOR", symbol: "^", desc: "Sets each bit to 1 if bits are different" },
                    { id: "NOT", symbol: "~", desc: "Inverts all bits" },
                    { id: "LEFT_SHIFT", symbol: "<<", desc: "Shifts bits left, filling with 0s" },
                    { id: "RIGHT_SHIFT", symbol: ">>", desc: "Shifts bits right, filling with 0s" }
                  ].map(({ id, symbol, desc }) => (
                    <div key={id} className="p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/50 transition-colors">
                      <div className="text-xl font-mono text-white mb-2">{symbol}</div>
                      <div className="text-sm text-zinc-400">{desc}</div>
                    </div>
                  ))}
                </div>

                {/* Interactive Example */}
                <div className="space-y-6">
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Truth Tables</h3>
                    <div className="grid grid-cols-3 gap-8">
                      {/* AND Operation */}
                      <div>
                        <h4 className="text-white font-mono mb-2">AND (&)</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-zinc-400">
                              <th className="px-2 py-1 text-left">A</th>
                              <th className="px-2 py-1 text-left">B</th>
                              <th className="px-2 py-1 text-left">A & B</th>
                            </tr>
                          </thead>
                          <tbody className="text-zinc-300 font-mono">
                            <tr><td>0</td><td>0</td><td>0</td></tr>
                            <tr><td>0</td><td>1</td><td>0</td></tr>
                            <tr><td>1</td><td>0</td><td>0</td></tr>
                            <tr><td>1</td><td>1</td><td>1</td></tr>
                          </tbody>
                        </table>
                      </div>

                      {/* OR Operation */}
                      <div>
                        <h4 className="text-white font-mono mb-2">OR (|)</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-zinc-400">
                              <th className="px-2 py-1 text-left">A</th>
                              <th className="px-2 py-1 text-left">B</th>
                              <th className="px-2 py-1 text-left">A | B</th>
                            </tr>
                          </thead>
                          <tbody className="text-zinc-300 font-mono">
                            <tr><td>0</td><td>0</td><td>0</td></tr>
                            <tr><td>0</td><td>1</td><td>1</td></tr>
                            <tr><td>1</td><td>0</td><td>1</td></tr>
                            <tr><td>1</td><td>1</td><td>1</td></tr>
                          </tbody>
                        </table>
                      </div>

                      {/* XOR Operation */}
                      <div>
                        <h4 className="text-white font-mono mb-2">XOR (^)</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-zinc-400">
                              <th className="px-2 py-1 text-left">A</th>
                              <th className="px-2 py-1 text-left">B</th>
                              <th className="px-2 py-1 text-left">A ^ B</th>
                            </tr>
                          </thead>
                          <tbody className="text-zinc-300 font-mono">
                            <tr><td>0</td><td>0</td><td>0</td></tr>
                            <tr><td>0</td><td>1</td><td>1</td></tr>
                            <tr><td>1</td><td>0</td><td>1</td></tr>
                            <tr><td>1</td><td>1</td><td>0</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Code Examples */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2 text-white">Common Use Cases:</h3>
                    <Highlight
                      theme={themes.vsDark}
                      code={`// Setting a bit
number |= (1 << position);

// Clearing a bit
number &= ~(1 << position);

// Toggling a bit
number ^= (1 << position);

// Checking if a bit is set
if (number & (1 << position)) {
    // bit is set
}

// Getting the lowest set bit
lowestBit = number & (-number);

// Counting set bits
int countSetBits(int n) {
    int count = 0;
    while (n) {
        n &= (n - 1);  // Clear lowest set bit
        count++;
    }
    return count;
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

                  {/* Real-world Applications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Performance Optimization</h4>
                      <ul className="list-disc list-inside text-zinc-400 space-y-1">
                        <li>Fast multiplication/division by powers of 2</li>
                        <li>Memory-efficient storage of boolean flags</li>
                        <li>Fast modulo operations with powers of 2</li>
                        <li>Efficient state management in games</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">System Programming</h4>
                      <ul className="list-disc list-inside text-zinc-400 space-y-1">
                        <li>Hardware register manipulation</li>
                        <li>Network packet processing</li>
                        <li>File permissions in Unix</li>
                        <li>Color manipulation in graphics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interactive Bitwise Examples */}
                <div className="mt-6 p-4 bg-black/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Interactive Examples</h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "AND (&)",
                        examples: [
                          { a: 12, b: 10, result: 12 & 10, 
                            explanation: `
                            12 = 1100 (binary)
                            10 = 1010 (binary)
                            Result = 1000 (binary) = 8` 
                          },
                          { a: 25, b: 15, result: 25 & 15, 
                            explanation: `
                            25 = 11001 (binary)
                            15 = 01111 (binary)
                            Result = 01001 (binary) = 9` 
                          }
                        ]
                      },
                      {
                        title: "OR (|)",
                        examples: [
                          { a: 12, b: 10, result: 12 | 10, 
                            explanation: `
                            12 = 1100 (binary)
                            10 = 1010 (binary)
                            Result = 1110 (binary) = 14` 
                          },
                          { a: 25, b: 15, result: 25 | 15, 
                            explanation: `
                            25 = 11001 (binary)
                            15 = 01111 (binary)
                            Result = 11111 (binary) = 31` 
                          }
                        ]
                      },
                      {
                        title: "XOR (^)",
                        examples: [
                          { a: 12, b: 10, result: 12 ^ 10, 
                            explanation: `
                            12 = 1100 (binary)
                            10 = 1010 (binary)
                            Result = 0110 (binary) = 6` 
                          },
                          { a: 25, b: 15, result: 25 ^ 15, 
                            explanation: `
                            25 = 11001 (binary)
                            15 = 01111 (binary)
                            Result = 10110 (binary) = 22` 
                          }
                        ]
                      },
                      {
                        title: "Left Shift (<<)",
                        examples: [
                          { a: 5, b: 1, result: 5 << 1, 
                            explanation: `
                            5 = 101 (binary)
                            Shift left by 1
                            Result = 1010 (binary) = 10
                            Note: Left shift by 1 multiplies by 2` 
                          },
                          { a: 5, b: 2, result: 5 << 2, 
                            explanation: `
                            5 = 101 (binary)
                            Shift left by 2
                            Result = 10100 (binary) = 20
                            Note: Left shift by 2 multiplies by 4` 
                          }
                        ]
                      },
                      {
                        title: "Right Shift (>>)",
                        examples: [
                          { a: 20, b: 1, result: 20 >> 1, 
                            explanation: `
                            20 = 10100 (binary)
                            Shift right by 1
                            Result = 1010 (binary) = 10
                            Note: Right shift by 1 divides by 2` 
                          },
                          { a: 20, b: 2, result: 20 >> 2, 
                            explanation: `
                            20 = 10100 (binary)
                            Shift right by 2
                            Result = 101 (binary) = 5
                            Note: Right shift by 2 divides by 4` 
                          }
                        ]
                      }
                    ].map((operation) => (
                      <div key={operation.title} className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-mono mb-4">{operation.title}</h4>
                        <div className="space-y-4">
                          {operation.examples.map((example, idx) => (
                            <div key={idx} className="text-sm text-zinc-400 space-y-2">
                              <div className="font-mono">
                                {example.a} {operation.title.split(' ')[0]} {example.b} = {example.result}
                              </div>
                              <pre className="whitespace-pre-wrap bg-black/30 p-2 rounded">
                                {example.explanation}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "arithmetic" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">Binary Arithmetic {'('}won't need this{')'}</h2>
                <p className="text-zinc-400 mb-6">
                  Binary arithmetic follows similar rules to decimal arithmetic, but only uses 0s and 1s. 
                  Understanding binary arithmetic is crucial for low-level programming and computer architecture.
                </p>

                <div className="space-y-8">
                  {/* Binary Addition */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Binary Addition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-mono mb-2">Rules:</h4>
                        <table className="w-full text-sm mb-4">
                          <tbody className="text-zinc-400 font-mono">
                            <tr><td>0 + 0 = 0</td><td>carry: 0</td></tr>
                            <tr><td>0 + 1 = 1</td><td>carry: 0</td></tr>
                            <tr><td>1 + 0 = 1</td><td>carry: 0</td></tr>
                            <tr><td>1 + 1 = 0</td><td>carry: 1</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="text-white font-mono mb-2">Example:</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`  1 1 (carry)
   1 0 1 1 (11)
 + 0 1 0 1 (5)
 ---------
   1 0 0 0 0 (16)`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Binary Subtraction */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Binary Subtraction</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-mono mb-2">Rules:</h4>
                        <table className="w-full text-sm mb-4">
                          <tbody className="text-zinc-400 font-mono">
                            <tr><td>0 - 0 = 0</td><td>borrow: 0</td></tr>
                            <tr><td>1 - 0 = 1</td><td>borrow: 0</td></tr>
                            <tr><td>1 - 1 = 0</td><td>borrow: 0</td></tr>
                            <tr><td>0 - 1 = 1</td><td>borrow: 1</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="text-white font-mono mb-2">Example:</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`  1 1 (borrow)
   1 0 1 1 (11)
 - 0 1 0 1 (5)
 ---------
   0 1 1 0 (6)`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Binary Multiplication */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Binary Multiplication</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-mono mb-2">Rules:</h4>
                        <table className="w-full text-sm mb-4">
                          <tbody className="text-zinc-400 font-mono">
                            <tr><td>0 × 0 = 0</td></tr>
                            <tr><td>0 × 1 = 0</td></tr>
                            <tr><td>1 × 0 = 0</td></tr>
                            <tr><td>1 × 1 = 1</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="text-white font-mono mb-2">Example:</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`    1 0 1 (5)
  ×   1 1 (3)
  -------
    1 0 1
  1 0 1
  -------
  1 1 1 1 (15)`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Binary Division */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Binary Division</h3>
                    <div className="space-y-4">
                      <p className="text-zinc-400">
                        Binary division is typically performed through repeated subtraction or by using 
                        the inverse of multiplication. Common optimizations include using right shifts 
                        for division by powers of 2.
                      </p>
                      <div>
                        <h4 className="text-white font-mono mb-2">Example (Division by 2):</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`1010 ÷ 2 = 101
(10 ÷ 2 = 5)

Right shift by 1:
1010 >> 1 = 0101`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Optimization Tips */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Optimization Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-mono">Multiplication by Powers of 2</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`x * 2  = x << 1
x * 4  = x << 2
x * 8  = x << 3
x * 16 = x << 4`}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-mono">Division by Powers of 2</h4>
                        <pre className="text-sm font-mono bg-black/30 p-4 rounded">
                          {`x / 2  = x >> 1
x / 4  = x >> 2
x / 8  = x >> 3
x / 16 = x >> 4`}
                        </pre>
                      </div>
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
