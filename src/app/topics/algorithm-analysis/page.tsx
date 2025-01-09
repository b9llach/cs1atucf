"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import { AIChatBox } from "@/components/ai-chat";

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
            { id: "recurrence", label: "Recurrence Relations" },
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

            {activeSection === "recurrence" && (
              <Card className="p-6 bg-zinc-800/50">
                <h2 className="text-2xl font-semibold mb-4 text-white">Recurrence Relations & Master Theorem</h2>
                
                <div className="space-y-6 text-zinc-400">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Master Theorem</h3>
                    <p>
                      For a recurrence relation of the form: T(n) = aT(n/b) + f(n), where:
                      <br />• a ≥ 1 (number of subproblems)
                      <br />• b {">"} 1 (factor by which n is divided)
                      <br />• f(n) is the cost of dividing and combining
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Three Cases</h4>
                      <div className="space-y-2">
                        <p>Compare f(n) with n^(log_b(a))</p>
                        <ol className="list-decimal list-inside">
                          <li>If f(n) = O(n^(log_b(a) - ε))<br />
                             Then T(n) = Θ(n^(log_b(a)))</li>
                          <li>If f(n) = Θ(n^(log_b(a)))<br />
                             Then T(n) = Θ(n^(log_b(a)) * log n)</li>
                          <li>If f(n) = Ω(n^(log_b(a) + ε))<br />
                             Then T(n) = Θ(f(n))</li>
                        </ol>
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Common Examples</h4>
                      <ul className="space-y-2">
                        <li>Binary Search:<br />
                            T(n) = T(n/2) + O(1)<br />
                            Solution: O(log n)</li>
                        <li>Merge Sort:<br />
                            T(n) = 2T(n/2) + O(n)<br />
                            Solution: O(n log n)</li>
                        <li>Strassen's Matrix:<br />
                            T(n) = 7T(n/2) + O(n²)<br />
                            Solution: O(n^log_2(7))</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Solving Process</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Identify a, b, and f(n) from the recurrence</li>
                      <li>Calculate n^(log_b(a))</li>
                      <li>Compare f(n) with n^(log_b(a))</li>
                      <li>Apply the appropriate case from the Master Theorem</li>
                      <li>Write the final time complexity</li>
                    </ol>
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
                      code={`#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(&arr[j], &arr[j+1]);
            }
        }
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Original array: \\n");
    printArray(arr, n);
    
    bubbleSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Quick Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Quick Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(log n) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
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

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Original array: \\n");
    printArray(arr, n);
    
    quickSort(arr, 0, n-1);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Merge Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Merge Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(n) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>

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

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Original array: \\n");
    printArray(arr, n);
    
    mergeSort(arr, 0, n-1);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Selection Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Selection Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n²) | Space: O(1) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void selectionSort(int arr[], int n) {
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

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Original array: \\n");
    printArray(arr, n);
    
    selectionSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Insertion Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Insertion Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n²) | Space: O(1) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>

void insertionSort(int arr[], int n) {
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

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    printf("Original array: \\n");
    printArray(arr, n);
    
    insertionSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Heap Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Heap Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n log n) | Space: O(1) | Stable: No
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void heapify(int arr[], int n, int i) {
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
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // One by one extract an element from heap
    for (int i = n - 1; i >= 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    heapSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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

                  {/* Bucket Sort */}
                  <div className="p-4 bg-zinc-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Bucket Sort</h4>
                    <p className="text-zinc-400 mb-2">
                      Time: O(n + k) | Space: O(n + k) | Stable: Yes
                    </p>
                    <Highlight
                      theme={themes.vsDark}
                      code={`#include <stdio.h>
#include <stdlib.h>

// Function to find the maximum value in array
int getMax(float arr[], int n) {
    float max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

// Function to sort individual buckets
void insertionSort(float arr[], int n) {
    for (int i = 1; i < n; i++) {
        float key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

void bucketSort(float arr[], int n) {
    // 1) Create n empty buckets
    float **buckets = (float **)malloc(sizeof(float *) * n);
    int *bucketSizes = (int *)calloc(n, sizeof(int));
    
    for (int i = 0; i < n; i++) {
        buckets[i] = (float *)malloc(sizeof(float) * n);
    }
    
    // 2) Put array elements in different buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = n * arr[i];
        buckets[bucketIndex][bucketSizes[bucketIndex]] = arr[i];
        bucketSizes[bucketIndex]++;
    }
    
    // 3) Sort individual buckets
    for (int i = 0; i < n; i++) {
        if (bucketSizes[i] > 0) {
            insertionSort(buckets[i], bucketSizes[i]);
        }
    }
    
    // 4) Concatenate all buckets into arr[]
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < bucketSizes[i]; j++) {
            arr[index++] = buckets[i][j];
        }
    }
    
    // Free allocated memory
    for (int i = 0; i < n; i++) {
        free(buckets[i]);
    }
    free(buckets);
    free(bucketSizes);
}

void printArray(float arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%.2f ", arr[i]);
    printf("\\n");
}

int main() {
    float arr[] = {0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51};
    int n = sizeof(arr)/sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    bucketSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    return 0;
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
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
