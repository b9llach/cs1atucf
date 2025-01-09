"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";

export default function AlgorithmAnalysis() {
  const [activeSection, setActiveSection] = useState("big-oh");

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-6 rounded-md px-4 py-2 bg-black text-white hover:bg-black/80 transition-all"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-white">Algorithm Analysis</h1>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "big-oh", label: "Big-Oh Notation" },
            { id: "time", label: "Time Complexity" },
            { id: "space", label: "Space Complexity" },
            { id: "analysis", label: "Code Analysis" }
          ].map(({ id, label }) => (
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
            {/* Keep your existing section content, but update the Card styling */}
            {activeSection === "big-oh" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Big-Oh Notation</h2>
                
                <div className="space-y-6 text-zinc-400">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Definition</h3>
                    <p>
                      Big-O notation describes the upper bound of the growth rate of an algorithm. 
                      Written as O(f(n)), it represents the worst-case scenario for the algorithm's resource usage.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold mb-2 text-white">Common Complexities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">From Best to Worst</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>O(1) - Constant</li>
                          <li>O(log n) - Logarithmic</li>
                          <li>O(n) - Linear</li>
                          <li>O(n log n) - Linearithmic</li>
                          <li>O(n²) - Quadratic</li>
                          <li>O(2ⁿ) - Exponential</li>
                          <li>O(n!) - Factorial</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Common Examples</h4>
                        <ul className="space-y-1">
                          <li>O(1): Array access</li>
                          <li>O(log n): Binary search</li>
                          <li>O(n): Linear search</li>
                          <li>O(n log n): Merge sort</li>
                          <li>O(n²): Bubble sort</li>
                          <li>O(2ⁿ): Recursive Fibonacci</li>
                          <li>O(n!): Traveling salesman</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "time" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Time Complexity</h2>
                
                <div className="space-y-6 text-zinc-400">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Understanding Time Complexity</h3>
                    <p>
                      Time complexity measures how the running time of an algorithm increases with the size of the input.
                      It counts the number of operations performed rather than actual time in seconds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Basic Operations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Arithmetic operations</li>
                        <li>Comparisons</li>
                        <li>Array/object access</li>
                        <li>Variable assignment</li>
                        <li>Function calls</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Analysis Types</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Best case (Ω)</li>
                        <li>Average case (θ)</li>
                        <li>Worst case (O)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "space" && (
              <Card className="p-6 bg-zinc-800/50 transition-all duration-300 ease-out transform-gpu will-change-transform">
                <h2 className="text-2xl font-semibold mb-4 text-white">Space Complexity</h2>
                <div className="space-y-4 text-zinc-400">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Memory Usage Analysis</h3>
                    <p>
                      Space complexity measures the total amount of memory an algorithm uses relative to the input size,
                      including both auxiliary space and space used by the input.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Memory Components</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Input space</li>
                        <li>Auxiliary space</li>
                        <li>Stack space (recursion)</li>
                        <li>Temporary variables</li>
                        <li>Dynamic allocations</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Common Examples</h4>
                      <ul className="space-y-1">
                        <li>O(1): Iterative sum</li>
                        <li>O(n): Array copy</li>
                        <li>O(n²): 2D array</li>
                        <li>O(log n): Binary search</li>
                        <li>O(n): Recursive sum</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "analysis" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Common Sorting Algorithms</h2>
                <div className="space-y-6">
                  {/* Bubble Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Bubble Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n²) | Space: O(1) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(&arr[j], &arr[j+1]);
            }
        }
    }
}
// Best: O(n) - Already sorted
// Average: O(n²)
// Worst: O(n²) - Reverse sorted`}
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

                  {/* Quick Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Quick Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(log n) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}
// Best: O(n log n)
// Average: O(n log n)
// Worst: O(n²) - Poor pivot choice`}
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

                  {/* Merge Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Merge Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(n) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int arr[], int left, int mid, int right) {
    int i, j, k;
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    
    for (i = 0; i < n1; i++) L[i] = arr[left + i];
    for (j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    i = 0; j = 0; k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
// Best: O(n log n)
// Average: O(n log n)
// Worst: O(n log n)`}
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

                  {/* Selection Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Selection Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n²) | Space: O(1) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i)
            swap(&arr[min_idx], &arr[i]);
    }
}
// Best: O(n²)
// Average: O(n²)
// Worst: O(n²)`}
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

                  {/* Insertion Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Insertion Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n²) | Space: O(1) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
// Best: O(n) - Already sorted
// Average: O(n²)
// Worst: O(n²) - Reverse sorted`}
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

                  {/* Heap Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Heap Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(1) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    for (int i = n - 1; i >= 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}
// Best: O(n log n)
// Average: O(n log n)
// Worst: O(n log n)`}
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

                  {/* Bucket Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Bucket Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n + k) | Space: O(n + k) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`void bucketSort(float arr[], int n) {
    // Create n empty buckets
    vector<float> buckets[n];
    
    // Put array elements in different buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = n * arr[i];
        buckets[bucketIndex].push_back(arr[i]);
    }
 
    // Sort individual buckets
    for (int i = 0; i < n; i++)
        sort(buckets[i].begin(), buckets[i].end());
 
    // Concatenate all buckets into arr[]
    int index = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < buckets[i].size(); j++)
            arr[index++] = buckets[i][j];
}
// Best: Ω(n + k)
// Average: Θ(n + k)
// Worst: O(n²) - When all elements go to the same bucket`}
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
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
