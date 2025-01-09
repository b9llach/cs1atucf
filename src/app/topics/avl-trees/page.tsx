"use client";

import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Box, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import { AIChatBox } from "@/components/ai-chat";

type TreeNode = {
  value: number;
  height: number;
  balanceFactor: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
};

const TreeNode = ({ node, x, y, visitedNodes }: { 
  node: any; 
  x: number; 
  y: number; 
  visitedNodes: number[];
}) => {
  if (!node) return null;
  const radius = 25;
  const horizontalSpacing = 80;
  const verticalSpacing = 60;

  const isHighlighted = visitedNodes.includes(node.value);

  return (
    <>
      {/* Node circle with animation */}
      <motion.circle
        cx={x}
        cy={y}
        r={radius}
        className={`${
          isHighlighted ? 'fill-green-500' : 'fill-zinc-800'
        } stroke-2 stroke-white transition-colors duration-200`}
        initial={false}
        animate={{
          fill: isHighlighted ? '#22c55e' : '#27272a',
          scale: isHighlighted ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Node value */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-semibold"
      >
        {node.value}
      </text>

      {/* Draw lines to children */}
      {node.left && (
        <>
          <line
            x1={x}
            y1={y + radius}
            x2={x - horizontalSpacing}
            y2={y + verticalSpacing - radius}
            className="stroke-white stroke-2"
          />
          <TreeNode
            node={node.left}
            x={x - horizontalSpacing}
            y={y + verticalSpacing}
            visitedNodes={visitedNodes}
          />
        </>
      )}
      {node.right && (
        <>
          <line
            x1={x}
            y1={y + radius}
            x2={x + horizontalSpacing}
            y2={y + verticalSpacing - radius}
            className="stroke-white stroke-2"
          />
          <TreeNode
            node={node.right}
            x={x + horizontalSpacing}
            y={y + verticalSpacing}
            visitedNodes={visitedNodes}
          />
        </>
      )}
    </>
  );
};

export default function AVLTreesPage() {
  const [activeSection, setActiveSection] = useState("insertion");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Tree State
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState("");
  const [operations, setOperations] = useState<string[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);

  // Helper functions for AVL tree operations
  const getHeight = (node: TreeNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalanceFactor = (node: TreeNode | null): number => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };

  const updateHeight = (node: TreeNode): void => {
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    node.balanceFactor = getBalanceFactor(node);
  };

  // Rotation operations
  const rotateRight = (y: TreeNode): TreeNode => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
  };

  const rotateLeft = (x: TreeNode): TreeNode => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
  };

  // Insert operation
  const insert = async (value: number) => {
    setIsSimulating(true);
    
    const insertNode = async (node: TreeNode | null, value: number): Promise<TreeNode> => {
      if (!node) {
        setOperations(prev => [...prev, `Creating new node with value ${value}`]);
        return {
          value,
          height: 1,
          balanceFactor: 0,
          left: null,
          right: null,
          x: 0,
          y: 0
        };
      }

      setHighlightedNode(node.value);
      await new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));

      // Add balance factor to operation log
      setOperations(prev => [...prev, 
        `Visiting node ${node.value}`,
        `Current balance factor: ${node.balanceFactor}`,
        `Comparing ${value} with ${node.value}`
      ]);

      if (value < node.value) {
        setOperations(prev => [...prev, `${value} is less than ${node.value}, going left`]);
        node.left = await insertNode(node.left, value);
      } else if (value > node.value) {
        setOperations(prev => [...prev, `${value} is greater than ${node.value}, going right`]);
        node.right = await insertNode(node.right, value);
      } else {
        return node;
      }

      updateHeight(node);
      const balance = getBalanceFactor(node);
      
      setOperations(prev => [...prev,
        `Updated height of node ${node.value}`,
        `New balance factor: ${balance}`
      ]);

      // Right Right Case
      if (balance < -1 && node.right) {
        setOperations(prev => [...prev,
          `Right-Right case detected at node ${node.value}`,
          `Performing left rotation to balance the tree`
        ]);
        const rotated = rotateLeft(node);
        setOperations(prev => [...prev,
          `After rotation: ${rotated.value} is the new root`,
          `New balance factors: root=${getBalanceFactor(rotated)}, left=${getBalanceFactor(rotated.left)}, right=${getBalanceFactor(rotated.right)}`
        ]);
        return rotated;
      }

      // Left Left Case
      if (balance > 1 && node.left) {
        setOperations(prev => [...prev,
          `Left-Left case detected at node ${node.value}`,
          `Performing right rotation to balance the tree`
        ]);
        const rotated = rotateRight(node);
        setOperations(prev => [...prev,
          `After rotation: ${rotated.value} is the new root`,
          `New balance factors: root=${getBalanceFactor(rotated)}, left=${getBalanceFactor(rotated.left)}, right=${getBalanceFactor(rotated.right)}`
        ]);
        return rotated;
      }

      // Left Right Case
      if (balance > 1 && node.left && value > node.left.value) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
      }

      // Right Left Case
      if (balance < -1 && node.right && value < node.right.value) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
      }

      return node;
    };

    setRoot(await insertNode(root, value));
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

        <h1 className="text-4xl font-bold mb-8 text-white">AVL Trees</h1>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "insertion", label: "Insertion & Rotation" },
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => setActiveSection(id)}
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
            {activeSection === "insertion" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-2 text-white">AVL Tree Operations</h2>
                <p className="text-zinc-400 mb-6">
                  AVL trees are self-balancing binary search trees where the heights of the two child subtrees of any node differ by at most one. 
                  After each insertion or deletion, rotations are performed to maintain this balance property.
                </p>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter value"
                    type="number"
                    className="w-32 text-white bg-zinc-900/50 border-zinc-700"
                    disabled={isSimulating}
                  />
                  <Button 
                    onClick={() => insert(parseInt(newValue))}
                    disabled={isSimulating || !newValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    Insert
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRoot(null);
                      setOperations([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Tree Visualization */}
                <div className="mb-6 bg-zinc-900/50 p-4 rounded-lg">
                  <svg width="600" height="300" className="mx-auto">
                    <TreeNode
                      node={root}
                      x={300}
                      y={50}
                      visitedNodes={highlightedNode ? [highlightedNode] : []}
                    />
                  </svg>
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
                  <h3 className="text-sm font-semibold mb-2 text-white">C Implementation:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    int height;
    struct Node *left;
    struct Node *right;
};

// Get height of a node
int getHeight(struct Node *node) {
    if (node == NULL) return 0;
    return node->height;
}

// Get maximum of two integers
int max(int a, int b) {
    return (a > b) ? a : b;
}

// Get balance factor
int getBalanceFactor(struct Node *node) {
    if (node == NULL) return 0;
    return getHeight(node->left) - getHeight(node->right);
}

// Create new node
struct Node* newNode(int value) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->value = value;
    node->height = 1;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Right rotation
struct Node* rotateRight(struct Node* y) {
    struct Node* x = y->left;
    struct Node* T2 = x->right;

    x->right = y;
    y->left = T2;

    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));

    return x;
}

// Left rotation
struct Node* rotateLeft(struct Node* x) {
    struct Node* y = x->right;
    struct Node* T2 = y->left;

    y->left = x;
    x->right = T2;

    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));

    return y;
}

// Print the tree in-order
void printInOrder(struct Node* node) {
    if (node != NULL) {
        printInOrder(node->left);
        printf("%d(bf=%d) ", node->value, getBalanceFactor(node));
        printInOrder(node->right);
    }
}

// Insert node
struct Node* insert(struct Node* node, int value) {
    if (node == NULL) return newNode(value);

    if (value < node->value)
        node->left = insert(node->left, value);
    else if (value > node->value)
        node->right = insert(node->right, value);
    else
        return node;  // Duplicate values not allowed

    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    int balance = getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && value < node->left->value)
        return rotateRight(node);

    // Right Right Case
    if (balance < -1 && value > node->right->value)
        return rotateLeft(node);

    // Left Right Case
    if (balance > 1 && value > node->left->value) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node->right->value) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}

int main() {
    struct Node* root = NULL;
    
    // Test case 1: Right-Right case (20, 30, 40)
    printf("\\nTest case 1: Right-Right case\\n");
    root = insert(root, 20);
    printf("After inserting 20: ");
    printInOrder(root);
    printf("\\n");
    
    root = insert(root, 30);
    printf("After inserting 30: ");
    printInOrder(root);
    printf("\\n");
    
    root = insert(root, 40);
    printf("After inserting 40: ");
    printInOrder(root);
    printf("\\n");

    // Reset tree for next test
    root = NULL;
    
    // Test case 2: Left-Left case (50, 40, 30)
    printf("\\nTest case 2: Left-Left case\\n");
    root = insert(root, 50);
    root = insert(root, 40);
    root = insert(root, 30);
    printf("Final tree: ");
    printInOrder(root);
    printf("\\n");

    return 0;
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
