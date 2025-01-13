import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle"

const topics = [
  {
    title: "Basics",
    description: "Fundamental data structures and memory concepts",
    href: "/topics/basics",
    subtopics: ["Strings", "Dynamic Memory Allocation", "Arrays", "Pointers"]
  },
  {
    title: "Linked Lists",
    description: "Linear data structures with dynamic size",
    href: "/topics/linked-lists",
    subtopics: ["Singly Linked Lists", "Doubly Linked Lists", "Circular Lists", "List Operations"]
  },
  {
    title: "Stacks & Queues",
    description: "LIFO and FIFO data structures",
    href: "/topics/stacks-queues",
    subtopics: ["Stack Operations", "Queue Operations", "Implementation Methods", "Applications"]
  },
  {
    title: "Algorithm Analysis",
    description: "Understanding computational complexity",
    href: "/topics/algorithm-analysis",
    subtopics: ["Big-Oh Notation", "Time Complexity", "Space Complexity", "Code Analysis"]
  },
  {
    title: "Binary Trees",
    description: "Basic tree structures and operations",
    href: "/topics/binary-trees",
    subtopics: ["Tree Traversal", "Tree Properties", "Binary Search Trees", "Tree Operations"]
  },
  {
    title: "AVL Trees",
    description: "Self-balancing binary search trees",
    href: "/topics/avl-trees",
    subtopics: ["Balance Factor", "Rotations", "Insertion", "Deletion"]
  },
  {
    title: "Binary & Bits",
    description: "Binary operations and conversions",
    href: "/topics/binary",
    subtopics: ["Binary Arithmetic", "Bitwise Operators", "Base Conversion"]
  },
  {
    title: "Hashing",
    description: "Hash tables and collision handling",
    href: "/topics/hashing",
    subtopics: ["Hash Functions", "Collision Resolution", "Hash Tables", "Performance Analysis"]
  },
  {
    title: "Recursion",
    description: "Recursive problem solving",
    href: "/topics/recursion",
    subtopics: ["Recursive Functions", "Base Cases", "Call Stack", "Recursive Analysis"]
  },
  {
    title: "Heaps",
    description: "Priority queues and heap operations",
    href: "/topics/heaps",
    subtopics: ["Heap Properties", "Heap Operations", "Heap Sort", "Heap Applications"]
  },
  {
    title: "Tries",
    description: "Tree-based data structures for efficient string operations",
    href: "/topics/tries",
    subtopics: ["Prefix Trees", "Trie Operations", "Trie Applications", "Trie Efficiency"]
  },
  {
    title: "Base Conversion",
    description: "Converting between different number systems",
    href: "/topics/base-conversion",
    subtopics: ["Binary to Decimal", "Decimal to Binary", "Hexadecimal to Decimal", "Decimal to Hexadecimal"]
  },
];

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-black">
      <main className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h2 className="text-zinc-400">formatting is bad on mobile sorry.</h2>
            <h2 className="text-zinc-400">everything up until the hashing section is done</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link href={topic.href} key={topic.title}>
              <Card className="h-full cursor-pointer transition-all duration-300 ease-out
                hover:scale-[1.02] hover:bg-zinc-800/50 hover:shadow-[0_0_20px_rgba(30,30,30,0.5)]
                transform-gpu will-change-transform">
                <CardHeader>
                  <CardTitle className="text-xl mb-2 text-white">{topic.title}</CardTitle>
                  <CardDescription className="mb-4 text-zinc-400">{topic.description}</CardDescription>
                  <ul className="text-sm space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <li key={subtopic} className="flex items-center text-zinc-400">
                        <span className="mr-2 text-zinc-500">•</span>
                        <span>{subtopic}</span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
