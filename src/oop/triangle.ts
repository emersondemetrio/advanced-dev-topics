import { Shape } from "./shape";

/**
 * Triangle class - inherits from Shape
 * Demonstrates: Inheritance - extends base class
 */
export class Triangle extends Shape {
  private base: number;
  private height: number;

  constructor(base: number, height: number) {
    super("Triangle");
    this.base = base;
    this.height = height;
  }

  /**
   * Implements the abstract area() method from Shape
   * Demonstrates: Polymorphism - specific implementation for Triangle
   */
  area(): number {
    return (this.base * this.height) / 2;
  }

  getBase(): number {
    return this.base;
  }

  getHeight(): number {
    return this.height;
  }
}
