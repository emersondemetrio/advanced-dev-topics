import './style.css';
import { StyleSearchDemo } from './demo';

const App = () => {
  return (
    <div id="app">
      <header id="title">
        <h1>Welcome to the DOM App</h1>
      </header>

      <main id="body">
        <p>This is the main body content of the application.</p>
        <p>It demonstrates how different font families can be applied to different sections of a web page.</p>
        <p>Each section - title, body, and footer - has its own unique typography.</p>
        <p>This app is now powered by React and TSX!</p>

        <StyleSearchDemo />
      </main>

      <footer id="footer">
        <p>&copy; {new Date().getFullYear()} Advanced Dev Topics. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
