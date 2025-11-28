// Code templates for different languages

export const codeTemplates: Record<string, string> = {
  python: `# Welcome to Python!
# Write your code here

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
print("Python is awesome! 🐍")`,

  javascript: `// Welcome to JavaScript!
// Write your code here

function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("JavaScript is awesome! 🟨");`,

  typescript: `// Welcome to TypeScript!
// Write your code here

function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("TypeScript is awesome! 🔷");`,

  java: `// Welcome to Java!
// Write your code here

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java is awesome! ☕");
    }
}`,

  cpp: `// Welcome to C++!
// Write your code here

#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "C++ is awesome! ⚡" << endl;
    return 0;
}`,

  rust: `// Welcome to Rust!
// Write your code here

fn main() {
    println!("Hello, World!");
    println!("Rust is awesome! 🦀");
}`,

  go: `// Welcome to Go!
// Write your code here

package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Go is awesome! 🐹")
}`,
};


