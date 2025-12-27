import { Shape } from "./shape";

/**
 * Circle class - inherits from Shape
 * Demonstrates: Inheritance - extends base class
 */
export class Circle extends Shape {
  private radius: number;

  constructor(radius: number) {
    super("Circle");
    this.radius = radius;
  }

  /**
   * Implements the abstract area() method from Shape
   * Demonstrates: Polymorphism - specific implementation for Circle
   */
  area(): number {
    return Math.PI * this.radius * this.radius;
  }

  getRadius(): number {
    return this.radius;
  }
}
