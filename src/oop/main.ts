import { Shape } from "./shape";
import { Triangle } from "./triangle";
import { Circle } from "./circle";
import { Square } from "./square";

/**
 * Main function demonstrating OOP concepts:
 * - Inheritance: Triangle, Circle, Square all extend Shape
 * - Polymorphism: Each shape implements area() differently
 * - Abstraction: Shape is abstract, defines interface
 * - Encapsulation: Each class encapsulates its own data and methods
 */
const main = (): void => {
  console.log("=== OOP Concepts Demonstration ===\n");

  // Create instances of different shapes
  const triangle = new Triangle(10, 5);
  const circle = new Circle(7);
  const square = new Square(6);

  // Store shapes in an array of the base type
  // Demonstrates: Polymorphism - treating different types uniformly
  const shapes: Shape[] = [triangle, circle, square];

  console.log("1. INHERITANCE:");
  console.log("   Triangle, Circle, and Square all inherit from Shape base class");
  console.log(`   Triangle inherits getName(): ${triangle.getName()}`);
  console.log(`   Circle inherits getName(): ${circle.getName()}`);
  console.log(`   Square inherits getName(): ${square.getName()}\n`);

  console.log("2. POLYMORPHISM:");
  console.log("   Each shape calculates area() differently:");
  console.log(`   ${triangle.getName()}: area = (base × height) / 2 = ${triangle.area()}`);
  console.log(`   ${circle.getName()}: area = π × radius² = ${circle.area().toFixed(2)}`);
  console.log(`   ${square.getName()}: area = side² = ${square.area()}\n`);

  console.log("3. ABSTRACTION:");
  console.log("   Shape is an abstract class - defines the interface (area method)");
  console.log("   but doesn't provide implementation. Each subclass must implement it.\n");

  console.log("4. POLYMORPHISM IN ACTION:");
  console.log("   Using the base type Shape[], calling area() on each:");
  shapes.forEach((shape, index) => {
    console.log(`   Shape ${index + 1}: ${shape.describe()}`);
  });
  console.log();

  console.log("5. ENCAPSULATION:");
  console.log("   Each shape encapsulates its own data:");
  console.log(`   Triangle: base=${triangle.getBase()}, height=${triangle.getHeight()}`);
  console.log(`   Circle: radius=${circle.getRadius()}`);
  console.log(`   Square: side=${square.getSide()}\n`);

  console.log("6. INHERITANCE - Shared Behavior:");
  console.log("   All shapes inherit the describe() method from Shape:");
  shapes.forEach((shape) => {
    console.log(`   - ${shape.describe()}`);
  });
};

main();

