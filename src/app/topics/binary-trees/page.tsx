"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trees, GitBranch, Search, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import { AIChatBox } from "@/components/ai-chat";

type TreeNodeType = {
    value: number;
    left: TreeNodeType | null;
    right: TreeNodeType | null;
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

export default function BinaryTreesPage() {
  const [activeSection, setActiveSection] = useState("traversal");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [operations, setOperations] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<'height' | 'depth' | 'balance' | null>(null);
  const [propertyHighlight, setPropertyHighlight] = useState<number[]>([]);
  const [newBSTValue, setNewBSTValue] = useState("");
  const [bstOperations, setBSTOperations] = useState<string[]>([]);
  const [bstHighlight, setBSTHighlight] = useState<number[]>([]);
  const [bstData, setBSTData] = useState({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: null
    },
    right: {
      value: 70,
      left: null,
      right: { value: 80, left: null, right: null }
    }
  });
  const [newOperationValue, setNewOperationValue] = useState("");
  const [operationLogs, setOperationLogs] = useState<string[]>([]);
  const [operationHighlight, setOperationHighlight] = useState<number[]>([]);
  const [operationTreeData, setOperationTreeData] = useState({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null }
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null }
    }
  });

  // Example tree for visualization
  const treeData = {
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 60, left: null, right: null }
    },
    right: {
      value: 70,
      left: null,
      right: { value: 80, left: null, right: null }
    }
  };

  const simulateTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setIsSimulating(true);
    setOperations([]);
    setVisitedNodes([]);
    
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));

    const traverse = async (node: any) => {
      if (!node) return;

      if (type === 'preorder') {
        await delay();
        setVisitedNodes(prev => [...prev, node.value]);
        setOperations(prev => [...prev, 
          `Visit node ${node.value} (Root) → Process current node before children`
        ]);
      }

      await traverse(node.left);

      if (type === 'inorder') {
        await delay();
        setVisitedNodes(prev => [...prev, node.value]);
        setOperations(prev => [...prev, 
          `Visit node ${node.value} → Process node after left subtree, before right subtree`
        ]);
      }

      await traverse(node.right);

      if (type === 'postorder') {
        await delay();
        setVisitedNodes(prev => [...prev, node.value]);
        setOperations(prev => [...prev, 
          `Visit node ${node.value} → Process node after both subtrees are complete`
        ]);
      }
    };

    await traverse(treeData);
    setIsSimulating(false);
  };

  const calculateTreeProperty = async (property: 'height' | 'depth' | 'balance') => {
    setIsSimulating(true);
    setPropertyHighlight([]);
    setOperations([]);
    
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));

    switch (property) {
      case 'height':
        for (let level = 3; level >= 1; level--) {
          await delay();
          setOperations(prev => [...prev, 
            `Level ${level}: Height = ${3 - level + 1} → Measuring distance from leaf nodes up to root`,
            `Nodes at this level: ${level === 3 ? '[20, 60, 80]' : level === 2 ? '[30, 70]' : '[50]'}`,
            `Maximum height so far: ${3 - level + 1} levels`
          ]);
          setPropertyHighlight([20, 60, 80]); // Level 3
          if (level <= 2) setPropertyHighlight([30, 70]); // Level 2
          if (level <= 1) setPropertyHighlight([50]); // Level 1
        }
        break;
        
      case 'depth':
        const path = [50, 30, 20];
        for (let i = 0; i < path.length; i++) {
          await delay();
          setPropertyHighlight(path.slice(0, i + 1));
          setOperations(prev => [...prev, 
            `Depth ${i + 1}: Following path to node ${path[i]}`,
            `Current path: ${path.slice(0, i + 1).join(' → ')}`,
            `Distance from root: ${i} levels`
          ]);
        }
        break;
        
      case 'balance':
        const nodes = [50, 30, 70, 20, 60, 80];
        for (const node of nodes) {
          await delay();
          setPropertyHighlight([node]);
          setOperations(prev => [...prev, 
            `Checking balance at node ${node}`,
            `Calculating height of left subtree vs right subtree`,
            `Balance factor = (left height - right height)`,
            `Node is balanced if factor is -1, 0, or 1`
          ]);
        }
        break;
    }
    
    setIsSimulating(false);
  };

  const simulateBSTOperation = async (operation: 'insert' | 'search') => {
    setIsSimulating(true);
    setBSTHighlight([]);
    setBSTOperations([]);
    
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
    const value = parseInt(newBSTValue);

    if (isNaN(value)) {
      setBSTOperations(['Please enter a valid number']);
      setIsSimulating(false);
      return;
    }

    let currentNode: any = bstData;
    let path = [currentNode.value];
    
    if (operation === 'search') {
      while (currentNode) {
        await delay();
        setBSTHighlight(path);
        setBSTOperations(prev => [...prev, 
          `Visiting node ${currentNode.value}`,
          `Comparing ${value} with current node ${currentNode.value}`,
          value === currentNode.value 
            ? `Found ${value}!` 
            : `${value} is ${value < currentNode.value ? 'smaller' : 'larger'} than ${currentNode.value}, going ${value < currentNode.value ? 'left' : 'right'}`
        ]);

        if (value === currentNode.value) break;
        
        currentNode = (value < currentNode.value ? currentNode.left : currentNode.right) as TreeNodeType;
        if (currentNode) path.push(currentNode.value);
      }
      
      if (!currentNode) {
        setBSTOperations(prev => [...prev, `Value ${value} not found in the tree`]);
      }
    }

    if (operation === 'insert') {
      const insertNode = async (node: any, value: number): Promise<any> => {
        if (!node) {
          setBSTOperations(prev => [...prev, `Found insertion point, adding ${value}`]);
          return { value, left: null, right: null };
        }

        path.push(node.value);
        await delay();
        setBSTHighlight(path);
        setBSTOperations(prev => [...prev, 
          `Comparing ${value} with current node ${node.value}`,
          `${value} is ${value < node.value ? 'smaller' : 'larger'} than ${node.value}, going ${value < node.value ? 'left' : 'right'}`
        ]);

        if (value < node.value) {
          node.left = await insertNode(node.left, value);
        } else if (value > node.value) {
          node.right = await insertNode(node.right, value);
        }

        return node;
      };

      const newTree = { ...bstData };
      await insertNode(newTree, value);
      setBSTData(newTree);
    }

    setNewBSTValue("");
    setIsSimulating(false);
  };

  const findMinMax = async (operation: 'min' | 'max') => {
    setIsSimulating(true);
    setBSTHighlight([]);
    setBSTOperations([]);
    
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000 / simulationSpeed));
    let currentNode: any = bstData;
    let path = [currentNode.value];

    while (currentNode) {
      await delay();
      setBSTHighlight(path);
      setBSTOperations(prev => [...prev, 
        `Visiting node ${currentNode.value}`,
        `${operation === 'min' ? 'Going left to find smaller values' : 'Going right to find larger values'}`
      ]);

      if (operation === 'min') {
        if (!currentNode.left) {
          setBSTOperations(prev => [...prev, 
            `Found minimum value: ${currentNode.value} (no more left children)`
          ]);
          break;
        }
        currentNode = currentNode.left as TreeNodeType;
      } else {
        if (!currentNode.right) {
          setBSTOperations(prev => [...prev, 
            `Found maximum value: ${currentNode.value} (no more right children)`
          ]);
          break;
        }
        currentNode = currentNode.right as TreeNodeType;
      }
      if (currentNode) path.push(currentNode.value);
    }

    setIsSimulating(false);
  };

  // Add this function to handle tab changes
  const handleTabChange = (newSection: string) => {
    setActiveSection(newSection);
    setOperations([]);
    setVisitedNodes([]);
    setPropertyHighlight([]);
    setIsSimulating(false);
  };

  // Add this function to handle tree operations
  const simulateTreeOperation = async (operation: 'insert' | 'delete' | 'search') => {
    setIsSimulating(true);
    setOperationHighlight([]);
    setOperationLogs([]);
    
    const value = parseInt(newOperationValue);
    if (isNaN(value)) {
      setOperationLogs(['Please enter a valid number']);
      setIsSimulating(false);
      return;
    }

    let currentNode = operationTreeData;
    let path = [currentNode.value];

    // Implementation similar to BST operations but with detailed logging for each step
    // Add specific logic for insert, delete, and search operations
    // Make sure to update operationHighlight and operationLogs appropriately

    setNewOperationValue("");
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

        <h1 className="text-4xl font-bold mb-8 text-white">Binary Trees</h1>

        {/* Global Controls Card */}
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

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "intro", icon: Trees, label: "Introduction" },
            { id: "traversal", icon: ArrowRight, label: "Tree Traversal" },
            { id: "properties", icon: Trees, label: "Tree Properties" },
            { id: "bst", icon: GitBranch, label: "Binary Search Trees" },
            { id: "operations", icon: Search, label: "Tree Operations" }
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-2 ${
                activeSection === id 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
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
            {activeSection === "intro" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Introduction to Binary Trees</h2>
                <p className="text-zinc-300 mb-6">
                  A binary tree is a hierarchical data structure where each node has at most two children, 
                  referred to as the left child and right child. Understanding the terminology is key to 
                  working with binary trees.
                </p>

                {/* Tree Visualization with Labels */}
                <div className="mb-6 bg-zinc-900/50 p-4 rounded-lg">
                  <svg width="600" height="300" className="mx-auto">
                    {/* Tree Structure */}
                    <TreeNode
                      node={{
                        value: 50,
                        left: {
                          value: 30,
                          left: { value: 20, left: null, right: null },
                          right: { value: 40, left: null, right: null }
                        },
                        right: {
                          value: 70,
                          left: { value: 60, left: null, right: null },
                          right: { value: 80, left: null, right: null }
                        }
                      }}
                      x={300}
                      y={50}
                      visitedNodes={[]}
                    />
                    
                    {/* Labels */}
                    <text x="300" y="20" textAnchor="middle" className="fill-green-500 text-sm">Root Node</text>
                    <text x="180" y="100" textAnchor="end" className="fill-blue-400 text-sm">Left Child</text>
                    <text x="420" y="100" textAnchor="start" className="fill-blue-400 text-sm">Right Child</text>
                    <text x="70" y="170" textAnchor="middle" className="fill-purple-400 text-sm">Leaf Node</text>
                    <text x="530" y="170" textAnchor="middle" className="fill-purple-400 text-sm">Leaf Node</text>

                    {/* Arrows or Lines */}
                    
                    {/* Arrow Marker Definition */}
                    <defs>   
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-current" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Terminology Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Basic Terms</h3>
                    <ul className="space-y-2 text-zinc-300">
                      <li><span className="text-green-500 font-semibold">Root:</span> The topmost node (50)</li>
                      <li><span className="text-blue-400 font-semibold">Parent:</span> A node with children</li>
                      <li><span className="text-blue-400 font-semibold">Child:</span> A node connected to another node when moving away from the root</li>
                      <li><span className="text-purple-400 font-semibold">Leaf:</span> A node with no children</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Properties</h3>
                    <ul className="space-y-2 text-zinc-300">
                      <li><span className="font-semibold">Height:</span> Length of the path from root to deepest leaf</li>
                      <li><span className="font-semibold">Depth:</span> Length of the path from a node to the root</li>
                      <li><span className="font-semibold">Level:</span> Set of all nodes at given depth</li>
                      <li><span className="font-semibold">Degree:</span> Number of children (max 2 in binary trees)</li>
                    </ul>
                  </div>
                </div>

                {/* Types of Binary Trees */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Types of Binary Trees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-300">
                    <div>
                      <h4 className="font-semibold text-white">Full Binary Tree</h4>
                      <p>Every node has 0 or 2 children</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Complete Binary Tree</h4>
                      <p>All levels filled except possibly the last</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Perfect Binary Tree</h4>
                      <p>All internal nodes have 2 children and leaves are at same level</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "traversal" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Tree Traversal</h2>
                <p className="text-zinc-300 mb-6">
                  Tree traversal is the process of visiting each node in a tree exactly once. The order in which we visit nodes 
                  defines the traversal type. Each method serves different purposes in data processing and algorithm implementation.
                </p>

                {/* Traversal Types Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Inorder (Left → Root → Right)</h3>
                    <p className="text-zinc-300 mb-2">Visit order:</p>
                    <ol className="list-decimal list-inside text-zinc-300">
                      <li>Traverse left subtree</li>
                      <li>Visit root node</li>
                      <li>Traverse right subtree</li>
                    </ol>
                    <p className="text-zinc-400 mt-2 text-sm">
                      Results in sorted order for BSTs. Commonly used when you need nodes in ascending order.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Preorder (Root → Left → Right)</h3>
                    <p className="text-zinc-300 mb-2">Visit order:</p>
                    <ol className="list-decimal list-inside text-zinc-300">
                      <li>Visit root node</li>
                      <li>Traverse left subtree</li>
                      <li>Traverse right subtree</li>
                    </ol>
                    <p className="text-zinc-400 mt-2 text-sm">
                      Useful for creating a copy of the tree or getting prefix expression of an expression tree.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Postorder (Left → Right → Root)</h3>
                    <p className="text-zinc-300 mb-2">Visit order:</p>
                    <ol className="list-decimal list-inside text-zinc-300">
                      <li>Traverse left subtree</li>
                      <li>Traverse right subtree</li>
                      <li>Visit root node</li>
                    </ol>
                    <p className="text-zinc-400 mt-2 text-sm">
                      Used in deletion operations and evaluating postfix expressions. Children processed before parent.
                    </p>
                  </div>
                </div>

                {/* Example Results */}
                <div className="p-4 bg-zinc-900/50 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">Example Results for Tree Below:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-300">
                    <div>
                      <span className="font-semibold">Inorder:</span>
                      <p>20 → 30 → 60 → 50 → 70 → 80</p>
                    </div>
                    <div>
                      <span className="font-semibold">Preorder:</span>
                      <p>50 → 30 → 20 → 60 → 70 → 80</p>
                    </div>
                    <div>
                      <span className="font-semibold">Postorder:</span>
                      <p>20 → 60 → 30 → 80 → 70 → 50</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => simulateTraversal('inorder')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Inorder
                  </Button>
                  <Button 
                    onClick={() => simulateTraversal('preorder')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preorder
                  </Button>
                  <Button 
                    onClick={() => simulateTraversal('postorder')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Postorder
                  </Button>
                </div>

                {/* Tree Visualization */}
                <div className="mb-6 bg-zinc-900/50 p-4 rounded-lg">
                  <svg width="600" height="300" className="mx-auto">
                    <TreeNode
                      node={treeData}
                      x={300}
                      y={50}
                      visitedNodes={visitedNodes}
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
                  <h3 className="text-sm font-semibold mb-2 text-white">C Code Example:</h3>
                  <Highlight
                    theme={themes.vsDark}
                    code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int data) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void inorderTraversal(struct Node* root) {
    if (root != NULL) {
        inorderTraversal(root->left);
        printf("%d ", root->data);
        inorderTraversal(root->right);
    }
}

void preorderTraversal(struct Node* root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorderTraversal(root->left);
        preorderTraversal(root->right);
    }
}

void postorderTraversal(struct Node* root) {
    if (root != NULL) {
        postorderTraversal(root->left);
        postorderTraversal(root->right);
        printf("%d ", root->data);
    }
}

int main() {
    struct Node* root = newNode(50);
    root->left = newNode(30);
    root->right = newNode(70);
    root->left->left = newNode(20);
    root->left->right = newNode(60);
    root->right->left = NULL;
    root->right->right = newNode(80);

    printf("Inorder traversal: ");
    inorderTraversal(root);
    printf("\\n");

    printf("Preorder traversal: ");
    preorderTraversal(root);
    printf("\\n");

    printf("Postorder traversal: ");
    postorderTraversal(root);
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

            {activeSection === "properties" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Tree Properties</h2>
                <p className="text-zinc-300 mb-6">
                  Understand key binary tree properties: height, depth, balanced vs unbalanced trees, 
                  and complete vs incomplete trees.
                </p>
                
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => calculateTreeProperty('height')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Calculate Height
                  </Button>
                  <Button 
                    onClick={() => calculateTreeProperty('depth')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Show Depth
                  </Button>
                  <Button 
                    onClick={() => calculateTreeProperty('balance')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Check Balance
                  </Button>
                </div>

                {/* Tree Visualization */}
                <div className="mb-6 bg-zinc-900/50 p-4 rounded-lg">
                  <svg width="600" height="300" className="mx-auto">
                    <TreeNode
                      node={treeData}
                      x={300}
                      y={50}
                      visitedNodes={propertyHighlight}
                    />
                  </svg>
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Properties Log:</h3>
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
                    code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

int getHeight(struct Node* node) {
    if (node == NULL) return 0;
    int leftHeight = getHeight(node->left);
    int rightHeight = getHeight(node->right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

int getDepth(struct Node* root, int value, int depth) {
    if (root == NULL) return -1;
    if (root->data == value) return depth;
    
    int leftDepth = getDepth(root->left, value, depth + 1);
    if (leftDepth != -1) return leftDepth;
    
    return getDepth(root->right, value, depth + 1);
}

int getBalanceFactor(struct Node* node) {
    if (node == NULL) return 0;
    return getHeight(node->left) - getHeight(node->right);
}

int main() {
    struct Node* root = newNode(50);
    root->left = newNode(30);
    root->right = newNode(70);
    root->left->left = newNode(20);
    root->left->right = newNode(60);
    root->right->right = newNode(80);

    printf("Height of tree: %d\\n", getHeight(root));
    printf("Depth of node 20: %d\\n", getDepth(root, 20, 0));
    printf("Balance factor of root: %d\\n", getBalanceFactor(root));

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

            {activeSection === "bst" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Binary Search Trees</h2>
                <p className="text-zinc-300 mb-6">
                  Learn about Binary Search Trees (BST), where left subtree values are smaller 
                  and right subtree values are larger than the root. This property enables 
                  efficient searching and maintains sorted order.
                </p>

                <div className="flex gap-4 mb-6">
                  <Input
                    type="number"
                    placeholder="Enter value..."
                    value={newBSTValue}
                    onChange={(e) => setNewBSTValue(e.target.value)}
                    className="w-32 bg-zinc-900/50 border-zinc-700 text-white"
                  />
                  <Button 
                    onClick={() => simulateBSTOperation('insert')}
                    disabled={isSimulating || !newBSTValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Insert
                  </Button>
                  <Button 
                    onClick={() => simulateBSTOperation('search')}
                    disabled={isSimulating || !newBSTValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setBSTData({
                        value: 50,
                        left: {
                          value: 30,
                          left: { value: 20, left: null, right: null },
                          right: null
                        },
                        right: {
                          value: 70,
                          left: null,
                          right: { value: 80, left: null, right: null }
                        }
                      });
                      setBSTOperations([]);
                      setBSTHighlight([]);
                    }}
                    disabled={isSimulating}
                    className="border-zinc-700 bg-white text-black hover:bg-zinc-800 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => findMinMax('min')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Find Min
                  </Button>
                  <Button 
                    onClick={() => findMinMax('max')}
                    disabled={isSimulating}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Find Max
                  </Button>
                </div>

                {/* Tree Visualization */}
                <div className="mb-6 bg-zinc-900/50 p-4 rounded-lg">
                  <svg width="600" height="300" className="mx-auto">
                    <TreeNode
                      node={bstData}
                      x={300}
                      y={50}
                      visitedNodes={bstHighlight}
                    />
                  </svg>
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">BST Operations Log:</h3>
                  <div className="space-y-1">
                    {bstOperations.map((op, index) => (
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
                    code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int data) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

struct Node* insert(struct Node* root, int data) {
    if (root == NULL) return newNode(data);
    
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    
    return root;
}

struct Node* search(struct Node* root, int data) {
    if (root == NULL || root->data == data)
        return root;
    
    if (data < root->data)
        return search(root->left, data);
    
    return search(root->right, data);
}

int findMin(struct Node* root) {
    if (root == NULL) return -1;
    while (root->left != NULL)
        root = root->left;
    return root->data;
}

int findMax(struct Node* root) {
    if (root == NULL) return -1;
    while (root->right != NULL)
        root = root->right;
    return root->data;
}

int main() {
    struct Node* root = NULL;
    
    // Insert nodes
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 20);
    insert(root, 70);
    insert(root, 80);
    
    // Search for a value
    int value = 30;
    struct Node* result = search(root, value);
    if (result != NULL)
        printf("Found %d in the BST\\n", value);
    else
        printf("%d not found in the BST\\n", value);
    
    printf("Minimum value: %d\\n", findMin(root));
    printf("Maximum value: %d\\n", findMax(root));
    
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

            {activeSection === "operations" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Tree Operations</h2>
                <p className="text-zinc-300 mb-6">
                  Practice common tree operations: insertion, deletion, and searching in binary trees. 
                  These operations form the foundation for more complex tree manipulations.
                </p>

                <div className="flex gap-4 mb-6">
                  <Input
                    type="number"
                    placeholder="Enter value..."
                    value={newOperationValue}
                    onChange={(e) => setNewOperationValue(e.target.value)}
                    className="w-32 bg-zinc-900/50 border-zinc-700 text-white"
                  />
                  <Button 
                    onClick={() => simulateTreeOperation('insert')}
                    disabled={isSimulating || !newOperationValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Insert
                  </Button>
                  <Button 
                    onClick={() => simulateTreeOperation('delete')}
                    disabled={isSimulating || !newOperationValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button 
                    onClick={() => simulateTreeOperation('search')}
                    disabled={isSimulating || !newOperationValue}
                    className="bg-transparent text-white hover:bg-zinc-800"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setOperationTreeData({
                        value: 50,
                        left: {
                          value: 30,
                          left: { value: 20, left: null, right: null },
                          right: { value: 40, left: null, right: null }
                        },
                        right: {
                          value: 70,
                          left: { value: 60, left: null, right: null },
                          right: { value: 80, left: null, right: null }
                        }
                      });
                      setOperationLogs([]);
                      setOperationHighlight([]);
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
                      node={operationTreeData}
                      x={300}
                      y={50}
                      visitedNodes={operationHighlight}
                    />
                  </svg>
                </div>

                {/* Operations Log */}
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-white">Operations Log:</h3>
                  <div className="space-y-1">
                    {operationLogs.map((op, index) => (
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
                    code={`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

struct Node* newNode(int data) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

struct Node* insert(struct Node* root, int data) {
    if (root == NULL) return newNode(data);
    
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    
    return root;
}

struct Node* minValueNode(struct Node* node) {
    struct Node* current = node;
    while (current && current->left != NULL)
        current = current->left;
    return current;
}

struct Node* deleteNode(struct Node* root, int data) {
    if (root == NULL) return root;

    if (data < root->data)
        root->left = deleteNode(root->left, data);
    else if (data > root->data)
        root->right = deleteNode(root->right, data);
    else {
        // Node with only one child or no child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }

        // Node with two children
        struct Node* temp = minValueNode(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}

struct Node* search(struct Node* root, int data) {
    if (root == NULL || root->data == data)
        return root;
    
    if (data < root->data)
        return search(root->left, data);
    return search(root->right, data);
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
