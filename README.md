# The Mystic Vault - A Riddle-Based Clicker Game

An immersive, exploration-based mystery clicker game built with vanilla HTML, CSS, and JavaScript. Solve a series of 10 increasingly challenging puzzles by discovering hidden elements, deciphering cryptic clues, and unlocking the secrets of an ancient vault.
> AI was used in Level Building and designing of this project!


![20250721-0755-43 1855663-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/40aa40ac-94db-4445-9410-fff0967682c4)

## 🔮 About the Game

The Mystic Vault is designed to be an atmospheric journey of discovery, not a test of reflexes. Players are encouraged to observe, think, and experiment with their surroundings. Each solved puzzle provides a short, mysterious clue, slowly unfolding a cryptic narrative and transforming the game's environment. Can you conquer all ten chambers and become the Master of the Mystic Vault?

## ✨ Features

- **10 Unique Puzzles**: Progress through ten sequential puzzles that test logic, sequence, memory, transformation, and more.
- **Pure Vanilla JS**: Built with zero dependencies—no libraries or frameworks.
- **Rich Interactivity**: Satisfying visual feedback with CSS animations (glows, fades, shakes) and a vibrant, shifting gradient background.
- **Dynamic Audio**: Features real-time sound generation using the **Web Audio API** for an immersive musical puzzle.
- **Cryptic Storytelling**: Unfold a mysterious narrative with each puzzle you solve.
- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.
- **In-Game Hint System**: Get a little nudge in the right direction when you're stuck.

## 🚀 Getting Started

No build steps or local server required! Just clone the repository and open the `index.html` file in your browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pragsrv/The_Mystic_Vault.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd The_Mystic_Vault
    ```

3.  **Open the game:**
    Simply open the `index.html` file in your favorite web browser (e.g., Chrome, Firefox, Safari).

## 💻 Tech Stack

-   **HTML5**: For the core structure and content.
-   **CSS3**: For all styling, layouts (Flexbox/Grid), and complex animations.
-   **JavaScript (ES6+)**: For all game logic, DOM manipulation, state management, and Web Audio API integration.

## 📁 File Structure

The project is organized into three clean, well-commented files:

```
.
├── index.html    # The main HTML file with all puzzle elements
├── style.css     # All CSS styles, animations, and responsive design
└── script.js     # The core game logic, state management, and puzzle handlers
└── README.md     # You are here!
```

## 🔧 Extending the Game

The game was built to be easily extendable. To add a new puzzle:

1.  **HTML**: Add a new `.puzzle-stage` `div` with a unique ID (e.g., `id="puzzle-11"`) in `index.html`.
2.  **CSS**: Add corresponding styles for your new puzzle elements in `style.css`.
3.  **JavaScript**:
    -   Increment the `totalPuzzles` variable in the `MysticVaultGame` constructor.
    -   Add a `false` value to the `puzzleSolved` array.
    -   Create new `handlePuzzle11()` and `solvePuzzle11()` methods for your puzzle's logic.
    -   Add event listeners for your new elements in the `setupEventListeners()` method.
    -   Add a hint for your new puzzle in the `showHint()` method's `hints` array.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
