import { useEffect } from 'react';
import { getElementsByStyle, getComputedStyleValue } from './getElementsByStyle';

/**
 * Component to demonstrate getElementsByStyle functionality
 * Shows how the function works with real DOM traversal
 */
export const StyleSearchDemo = () => {
  useEffect(() => {
    // Run the demo after component mounts
    const runDemo = () => {
      console.log('=== getElementsByStyle Demo ===\n');

      // Demo 1: Find all elements with Arial font-family
      console.log('1. Finding elements with fontFamily: "Arial"');
      const arialElements = getElementsByStyle(document.body, {
        fontFamily: 'Arial'
      });
      console.log(`   Found ${arialElements.length} element(s):`);
      arialElements.forEach((el, idx) => {
        const fontFamily = getComputedStyleValue(el, 'fontFamily');
        console.log(`   ${idx + 1}. <${el.tagName.toLowerCase()}> - fontFamily: ${fontFamily}`);
      });
      console.log();


      // Demo 4: Find elements with specific background color
      console.log('4. Finding elements with backgroundColor: "rgb(44, 62, 80)"');
      const darkBgElements = getElementsByStyle(document.body, {
        backgroundColor: 'rgb(44, 62, 80)'
      });
      console.log(`   Found ${darkBgElements.length} element(s):`);
      darkBgElements.forEach((el, idx) => {
        const bgColor = getComputedStyleValue(el, 'backgroundColor');
        console.log(`   ${idx + 1}. <${el.tagName.toLowerCase()}>${el.id ? `#${el.id}` : ''} - backgroundColor: ${bgColor}`);
      });
      console.log();

      // Demo 5: Multiple criteria
      console.log('5. Finding elements with white color AND Georgia font');
      const whiteGeorgiaElements = getElementsByStyle(document.body, {
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Georgia'
      });
      console.log(`   Found ${whiteGeorgiaElements.length} element(s):`);
      whiteGeorgiaElements.forEach((el, idx) => {
        const color = getComputedStyleValue(el, 'color');
        const fontFamily = getComputedStyleValue(el, 'fontFamily');
        console.log(`   ${idx + 1}. <${el.tagName.toLowerCase()}>${el.id ? `#${el.id}` : ''} - color: ${color}, fontFamily: ${fontFamily}`);
      });
      console.log();

      // Demo 6: Performance comparison
      console.log('6. Performance: Searching with depth limit');
      const startTime = performance.now();
      const limitedResults = getElementsByStyle(
        document.body,
        { fontFamily: 'Arial' },
        { maxDepth: 3 }
      );
      const endTime = performance.now();
      console.log(`   Found ${limitedResults.length} elements in ${(endTime - startTime).toFixed(3)}ms (maxDepth: 3)`);
      console.log();

    };

    // Small delay to ensure DOM is fully rendered
    setTimeout(runDemo, 100);
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', margin: '1rem 0' }}>
      <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Style Search Demo</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Open the browser console to see the getElementsByStyle function in action!
        The function recursively traverses the DOM and matches elements by their computed CSS properties.
      </p>
    </div>
  );
};

