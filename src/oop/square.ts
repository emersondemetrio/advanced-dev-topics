import { Shape } from "./shape";

/**
 * Square class - inherits from Shape
 * Demonstrates: Inheritance - extends base class
 */
export class Square extends Shape {
  private side: number;

  constructor(side: number) {
    super("Square");
    this.side = side;
  }

  /**
   * Implements the abstract area() method from Shape
   * Demonstrates: Polymorphism - specific implementation for Square
   */
  area(): number {
    return this.side * this.side;
  }

  getSide(): number {
    return this.side;
  }
}
