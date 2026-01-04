/**
 * getElementsByStyle - Finds all elements in the DOM that match specified CSS style properties
 *
 * This function demonstrates:
 * - DOM traversal algorithms (recursive tree traversal)
 * - CSS property matching using computed styles
 * - Performance considerations for DOM operations
 *
 * @param root - The root element to start searching from (defaults to document.body)
 * @param styleCriteria - An object with CSS property names as keys and expected values
 * @param options - Optional configuration for traversal behavior
 * @returns Array of elements that match all specified style criteria
 *
 * @example
 * // Find all elements with font-family 'Arial'
 * const arialElements = getElementsByStyle(document.body, { fontFamily: 'Arial' });
 *
 * // Find elements with specific background color
 * const darkBgElements = getElementsByStyle(document.body, { backgroundColor: 'rgb(44, 62, 80)' });
 */
export function getElementsByStyle(
  // First parameter: root element where we start searching
  // It can be any Element or the Document object, defaults to document.body if not provided
  root: Element | Document = document.body,
  // Second parameter: the style criteria we're looking for
  // Partial<CSSStyleDeclaration> means we can provide any subset of CSS properties
  // Example: { fontFamily: 'Arial', color: 'red' }
  styleCriteria: Partial<CSSStyleDeclaration>,
  // Third parameter: optional configuration object
  options: {
    // maxDepth: limits how deep we traverse the DOM tree (performance optimization)
    maxDepth?: number;
    // includeTextNodes: whether to also check text nodes (usually we only check element nodes)
    includeTextNodes?: boolean;
    // caseSensitive: whether string comparisons should be case-sensitive
    caseSensitive?: boolean;
  } = {} // Default to empty object if no options provided
): Element[] { // Return type: an array of Element objects

  const {
    // maxDepth defaults to Infinity (no limit) if not specified
    maxDepth = Infinity,
    // includeTextNodes defaults to false if not specified
    includeTextNodes = false,
    // caseSensitive defaults to false if not specified
    caseSensitive = false
  } = options;

  // Create an empty array to store all matching elements
  // This array will be populated as we traverse the DOM
  const matches: Element[] = [];

  /**
   * Recursive function to traverse the DOM tree
   * This is the core algorithm that mimics how browsers traverse the DOM
   */
  // Define an inner function called 'traverse'
  // Inner functions have access to variables from the outer scope (like 'matches', 'styleCriteria', etc.)
  function traverse(node: Node | Element, depth: number): void {
    // Performance optimization: check if we've exceeded the maximum depth
    // If depth is greater than maxDepth, stop traversing further down the tree
    // This prevents infinite loops and can improve performance on very deep DOM trees
    if (depth > maxDepth) {
      // Exit early from this function, don't process this node or its children
      return;
    }

    // Check if the current node is an Element node (not a text node, comment, etc.)
    // Node.ELEMENT_NODE is a constant (value 1) that represents element nodes in the DOM
    // Other node types include: TEXT_NODE (3), COMMENT_NODE (8), etc.
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Type assertion: tell TypeScript that this node is definitely an Element
      // We can do this because we just checked nodeType above
      const element = node as Element;

      // Get the computed style for this element
      // window.getComputedStyle() is a browser API that returns ALL CSS properties
      // It calculates the final values after applying all CSS rules, inheritance, specificity, etc.
      // This is how browsers actually determine what styles to apply to an element
      const computedStyle = window.getComputedStyle(element);

      // Check if this element's computed style matches all the criteria we're looking for
      // We call the helper function matchesStyleCriteria to do the comparison
      // If it returns true, this element matches our search criteria
      if (matchesStyleCriteria(computedStyle, styleCriteria, caseSensitive)) {
        // This element matches! Add it to our results array
        matches.push(element);
      }

      // Now we need to recursively check all child elements
      // Get a list of all child nodes of the current element
      // childNodes includes element nodes, text nodes, comment nodes, etc.
      const children = element.childNodes;

      // Loop through each child node
      // We use a traditional for loop to iterate through the NodeList
      for (let i = 0; i < children.length; i++) {
        // Get the current child node at index i
        const child = children[i];

        // Only traverse child nodes that are elements (or text nodes if includeTextNodes is true)
        // This filters out comment nodes, CDATA nodes, etc.
        if (child.nodeType === Node.ELEMENT_NODE || includeTextNodes) {
          // Recursively call traverse on the child node
          // This is the key to tree traversal: we call the same function on child nodes
          // depth + 1 increments the depth counter to track how deep we are in the tree
          traverse(child, depth + 1);
        }
      }
    }
  }

  // Before starting traversal, normalize the root element
  // If root is the Document object, use document.body instead (the actual root element)
  // If root is already an Element, use it as-is
  // This ensures we always have a valid Element to start from
  const rootElement = root === document ? document.body : (root as Element);

  // Start the traversal if we have a valid root element
  // This safety check prevents errors if rootElement is somehow null or undefined
  if (rootElement) {
    // Begin the recursive traversal starting from the root element
    // Pass 0 as the initial depth (we're at the top level)
    traverse(rootElement, 0);
  }

  // Return the array of all matching elements we found during traversal
  return matches;
}

/**
 * Helper function to check if an element's computed style matches the criteria
 * This handles CSS property matching, including:
 * - Case sensitivity
 * - Value normalization (e.g., color values can be in different formats)
 * - Multiple values (like font-family fallbacks)
 */
function matchesStyleCriteria(
  // The computed style object for the element we're checking
  computedStyle: CSSStyleDeclaration,
  // The style criteria we're trying to match against
  criteria: Partial<CSSStyleDeclaration>,
  // Whether string comparisons should be case-sensitive
  caseSensitive: boolean
): boolean { // Returns true if all criteria match, false otherwise
  // Convert the criteria object's keys into an array
  // Object.keys() gets all property names from the criteria object
  // We cast it as Array<keyof CSSStyleDeclaration> so TypeScript knows the types
  const criteriaKeys = Object.keys(criteria) as Array<keyof CSSStyleDeclaration>;

  // Loop through each property in the criteria
  // We need ALL properties to match for this function to return true
  for (const property of criteriaKeys) {
    // Get the expected value for this property from the criteria object
    // Example: if criteria is { fontFamily: 'Arial' }, expectedValue would be 'Arial'
    const expectedValue = criteria[property];

    // Skip this property if it's undefined or null
    // This handles cases where someone passes { fontFamily: undefined }
    // We use continue to skip to the next iteration of the loop
    if (expectedValue === undefined || expectedValue === null) {
      continue; // Skip this property, check the next one
    }

    // Get the actual computed value for this property from the element
    // This is the real CSS value that the browser calculated for this element
    const actualValue = computedStyle[property];

    // If the actual value is empty or doesn't exist, it can't match our criteria
    // Return false immediately - no need to check other properties
    if (!actualValue || actualValue === '') {
      return false; // This element doesn't match, stop checking
    }

    // Convert both values to strings for comparison
    // This ensures we can compare values even if they're different types
    // String() is a safe way to convert any value to a string
    const expectedStr = String(expectedValue);
    const actualStr = String(actualValue);

    // Handle case sensitivity in string comparisons
    // If caseSensitive is false, convert both strings to lowercase
    // If caseSensitive is true, keep them as-is
    // This allows flexible matching: 'Arial' matches 'arial' when caseSensitive is false
    const compareExpected = caseSensitive ? expectedStr : expectedStr.toLowerCase();
    const compareActual = caseSensitive ? actualStr : actualStr.toLowerCase();

    // Check if the values match
    // We try three different matching strategies:
    // 1. Exact match: strings are identical
    // 2. Partial match (actual contains expected): for font-family like "Arial, Helvetica" matching "Arial"
    // 3. Partial match (expected contains actual): handles edge cases
    // The || operator means if ANY of these is true, matches becomes true
    const matches = compareActual === compareExpected ||
                   compareActual.includes(compareExpected) ||
                   compareExpected.includes(compareActual);

    // If this property doesn't match, the entire element doesn't match
    // Return false immediately - no need to check remaining properties
    if (!matches) {
      return false; // This property doesn't match, so the element doesn't match
    }
  }

  // If we made it through all properties without returning false, all criteria matched!
  // Return true to indicate this element matches all the style criteria
  return true;
}

/**
 * Helper function to get computed style value for a specific property
 * Useful for debugging and inspection
 */
// This is a convenience function for getting a single CSS property value
export function getComputedStyleValue(
  // The element we want to inspect
  element: Element,
  // The CSS property name we want to get (e.g., 'fontFamily', 'color', 'backgroundColor')
  property: keyof CSSStyleDeclaration
): string { // Returns the computed value as a string
  // Get all computed styles for this element using the browser API
  // This is the same API used by getElementsByStyle internally
  const computedStyle = window.getComputedStyle(element);

  // Get the specific property value and cast it to string
  // We use 'as string' to tell TypeScript the result is definitely a string
  // Return the computed value for this property
  return computedStyle[property] as string;
}

/**
 * Performance-optimized version that uses TreeWalker API
 * This is faster for large DOM trees as it's implemented natively
 */
// TreeWalker is a native browser API optimized for DOM traversal
export function getElementsByStyleOptimized(
  // Same parameters as the main function
  root: Element | Document = document.body,
  styleCriteria: Partial<CSSStyleDeclaration>,
  // This version only supports caseSensitive option (simpler for demonstration)
  options: { caseSensitive?: boolean } = {}
): Element[] { // Returns array of matching elements
  // Extract caseSensitive option, default to false
  const { caseSensitive = false } = options;

  // Create empty array to store matches
  const matches: Element[] = [];

  // Normalize root element (same logic as main function)
  const rootElement = root === document ? document.body : (root as Element);

  // Safety check: if no valid root element, return empty array
  if (!rootElement) {
    return matches; // Return empty array, no elements found
  }

  // Create a TreeWalker object - this is a native browser API for efficient DOM traversal
  // TreeWalker is faster than manual recursion because it's implemented in the browser's native code
  // It's specifically designed for walking through DOM trees
  const walker = document.createTreeWalker(
    rootElement, // Start from this element
    NodeFilter.SHOW_ELEMENT, // Only show element nodes (filter out text nodes, comments, etc.)
    null // No custom filter function (we'll filter by style later)
  );

  // Get the first node from the TreeWalker
  // nextNode() moves to the next node in the tree and returns it
  // Returns null when there are no more nodes
  let node: Node | null = walker.nextNode();

  // Loop through all nodes in the tree
  // This continues until node becomes null (no more nodes to process)
  while (node) {
    // Double-check that this is an element node (should always be true due to NodeFilter.SHOW_ELEMENT)
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Type assertion: this node is an Element
      const element = node as Element;

      // Get computed styles for this element (same as main function)
      const computedStyle = window.getComputedStyle(element);

      // Check if this element matches our criteria (using the same helper function)
      if (matchesStyleCriteria(computedStyle, styleCriteria, caseSensitive)) {
        // Element matches! Add it to results
        matches.push(element);
      }
    }

    // Move to the next node in the tree
    // TreeWalker automatically handles the traversal logic for us
    // This is more efficient than manual recursion because it's implemented in native code
    node = walker.nextNode();
  }

  // Return all matching elements we found
  return matches;
}
