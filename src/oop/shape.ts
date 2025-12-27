/**
 * Abstract base class representing a geometric shape
 * Demonstrates: Abstraction - defines the interface without implementation
 */
export abstract class Shape {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Abstract method that must be implemented by derived classes
   * Demonstrates: Polymorphism - each shape calculates area differently
   */
  abstract area(): number;

  /**
   * Concrete method available to all derived classes
   * Demonstrates: Inheritance - shared behavior
   */
  getName(): string {
    return this.name;
  }

  /**
   * Template method pattern - uses abstract method
   * Demonstrates: Encapsulation and Inheritance working together
   */
  describe(): string {
    return `${this.name} with area: ${this.area().toFixed(2)}`;
  }
}
