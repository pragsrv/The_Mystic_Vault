/**
 * The Mystic Vault - A Riddle-Based Clicker Game
 * Main game logic and puzzle management system
 */

class MysticVaultGame {
    constructor() {
        this.currentPuzzle = 1;
        this.totalPuzzles = 5;
        this.puzzleSolved = [false, false, false, false, false];
        
        // Puzzle-specific states
        this.sequenceClicks = [];
        this.transformationClicks = 0;
        this.colorHarmonyState = { red: false, blue: false, green: false };
        
        // Initialize game
        this.init();
    }

    /**
     * Initialize the game and set up event listeners
     */
    init() {
        this.updateProgress();
        this.setupEventListeners();
        this.showCurrentPuzzle();
    }

    /**
     * Set up all event listeners for interactive elements
     */
    setupEventListeners() {
        // Puzzle 1: Hidden Symbol Discovery
        const hiddenSymbol = document.getElementById('hidden-symbol');
        if (hiddenSymbol) {
            hiddenSymbol.addEventListener('click', () => this.solvePuzzle1());
        }

        // Red herring elements (do nothing but provide feedback)
        const redHerrings = document.querySelectorAll('.red-herring');
        redHerrings.forEach(herring => {
            herring.addEventListener('click', () => this.handleRedHerring());
        });

        // Puzzle 2: Sequence Challenge
        const sequenceItems = document.querySelectorAll('.sequence-item');
        sequenceItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleSequenceClick(e.target));
        });

        // Puzzle 3: Transformation Challenge
        const transformElement = document.getElementById('transformation-element');
        if (transformElement) {
            transformElement.addEventListener('click', () => this.handleTransformation());
        }

        // Puzzle 4: Color Harmony
        const colorOrbs = document.querySelectorAll('.color-orb');
        colorOrbs.forEach(orb => {
            orb.addEventListener('click', (e) => this.handleColorHarmony(e.target));
        });

        // Puzzle 5: Final Riddle
        const riddleOptions = document.querySelectorAll('.riddle-option');
        riddleOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleRiddleAnswer(e.target));
        });

        // UI Elements
        const hintBtn = document.getElementById('hint-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartGame());
    }

    /**
     * PUZZLE 1: Hidden Symbol Discovery
     * Player must find and click the nearly invisible symbol
     */
    solvePuzzle1() {
        if (this.currentPuzzle !== 1 || this.puzzleSolved[0]) return;

        const hiddenSymbol = document.getElementById('hidden-symbol');
        hiddenSymbol.classList.add('found');
        
        this.puzzleSolved[0] = true;
        this.updateStoryText("*The ancient symbol blazes to life! The first seal is broken. You sense a deeper mystery awaiting...*");
        
        setTimeout(() => {
            this.advancePuzzle();
        }, 2000);
    }

    /**
     * PUZZLE 2: Sequence Challenge
     * Player must click celestial objects in the correct order
     */
    handleSequenceClick(element) {
        if (this.currentPuzzle !== 2 || this.puzzleSolved[1]) return;

        const correctOrder = [1, 2, 3, 4]; // Moon, Star, Sun, Comet
        const clickedOrder = parseInt(element.dataset.order);
        
        this.sequenceClicks.push(clickedOrder);
        
        // Visual feedback for the clicked element
        element.classList.add('correct');
        setTimeout(() => element.classList.remove('correct'), 500);
        
        // Check if sequence is complete
        if (this.sequenceClicks.length === 4) {
            if (this.arraysEqual(this.sequenceClicks, correctOrder)) {
                this.solvePuzzle2();
            } else {
                this.resetSequence();
                this.showFeedback('sequence-feedback', 'The celestial dance is disrupted. Try again...', 'error');
            }
        }
    }

    solvePuzzle2() {
        this.puzzleSolved[1] = true;
        this.showFeedback('sequence-feedback', 'The stars align! The cosmic order is restored.', 'success');
        this.updateStoryText("*The celestial harmony resonates through the vault. Ancient mechanisms begin to turn...*");
        
        setTimeout(() => {
            this.advancePuzzle();
        }, 2000);
    }

    resetSequence() {
        this.sequenceClicks = [];
        const sequenceItems = document.querySelectorAll('.sequence-item');
        sequenceItems.forEach(item => {
            item.classList.remove('correct', 'incorrect');
        });
    }

    /**
     * PUZZLE 3: Transformation Challenge
     * Element evolves through multiple clicks
     */
    handleTransformation() {
        if (this.currentPuzzle !== 3 || this.puzzleSolved[2]) return;

        this.transformationClicks++;
        const element = document.getElementById('transformation-element');
        const counter = document.getElementById('click-counter');
        
        counter.textContent = this.transformationClicks;
        
        // Transformation stages
        const stages = ['🌱', '🌿', '🌳', '🌸', '🍎', '🔮'];
        
        if (this.transformationClicks <= 5) {
            element.textContent = stages[this.transformationClicks];
            element.className = `clickable transformation-stage-${this.transformationClicks}`;
        }
        
        if (this.transformationClicks === 5) {
            setTimeout(() => this.solvePuzzle3(), 1000);
        }
    }

    solvePuzzle3() {
        this.puzzleSolved[2] = true;
        this.updateStoryText("*Through patience and persistence, life blooms into magic. The third seal yields to your dedication...*");
        
        setTimeout(() => {
            this.advancePuzzle();
        }, 2000);
    }

    /**
     * PUZZLE 4: Color Harmony
     * All three color orbs must be activated simultaneously
     */
    handleColorHarmony(element) {
        if (this.currentPuzzle !== 4 || this.puzzleSolved[3]) return;

        const color = element.dataset.color;
        this.colorHarmonyState[color] = !this.colorHarmonyState[color];
        
        // Toggle visual state
        if (this.colorHarmonyState[color]) {
            element.classList.add('activated');
        } else {
            element.classList.remove('activated');
        }
        
        // Check if all colors are active
        if (this.colorHarmonyState.red && this.colorHarmonyState.blue && this.colorHarmonyState.green) {
            this.solvePuzzle4();
        }
    }

    solvePuzzle4() {
        this.puzzleSolved[3] = true;
        const harmonyIndicator = document.getElementById('harmony-indicator');
        harmonyIndicator.classList.add('complete');
        harmonyIndicator.textContent = '⚡';
        
        this.updateStoryText("*The three energies merge in perfect balance. Reality bends to your will as the fourth seal breaks...*");
        
        setTimeout(() => {
            this.advancePuzzle();
        }, 2000);
    }

    /**
     * PUZZLE 5: Final Riddle
     * Logic puzzle about circles/zero (beginning and end, holds all yet empty)
     */
    handleRiddleAnswer(element) {
        if (this.currentPuzzle !== 5 || this.puzzleSolved[4]) return;

        const isCorrect = element.dataset.answer === 'correct';
        
        if (isCorrect) {
            element.classList.add('correct-answer');
            this.solvePuzzle5();
        } else {
            this.showFeedback('riddle-hint', 'Not quite... Think about shapes that represent eternity and nothingness.', 'hint');
            element.style.animation = 'redHerringShake 0.5s ease-in-out';
        }
    }

    solvePuzzle5() {
        this.puzzleSolved[4] = true;
        this.updateStoryText("*The circle - eternal and empty, beginning and end! The final seal crumbles before your wisdom...*");
        
        setTimeout(() => {
            this.showVictory();
        }, 2000);
    }

    /**
     * Game Flow Management
     */
    advancePuzzle() {
        if (this.currentPuzzle < this.totalPuzzles) {
            // Hide current puzzle
            document.getElementById(`puzzle-${this.currentPuzzle}`).style.display = 'none';
            
            // Show next puzzle
            this.currentPuzzle++;
            this.showCurrentPuzzle();
            this.updateProgress();
        }
    }

    showCurrentPuzzle() {
        const currentPuzzleElement = document.getElementById(`puzzle-${this.currentPuzzle}`);
        if (currentPuzzleElement) {
            currentPuzzleElement.style.display = 'block';
            currentPuzzleElement.style.animation = 'none';
            setTimeout(() => {
                currentPuzzleElement.style.animation = 'fadeIn 1s ease-in-out';
            }, 50);
        }
    }

    showVictory() {
        // Hide current puzzle
        document.getElementById(`puzzle-${this.currentPuzzle}`).style.display = 'none';
        
        // Show victory screen
        const victoryScreen = document.getElementById('victory');
        victoryScreen.style.display = 'block';
        this.updateProgress(100);
    }

    /**
     * UI and Feedback Systems
     */
    updateProgress(customPercentage = null) {
        const progressFill = document.getElementById('progress-fill');
        const percentage = customPercentage || (this.puzzleSolved.filter(solved => solved).length / this.totalPuzzles) * 100;
        progressFill.style.width = percentage + '%';
    }

    updateStoryText(text) {
        const storyElement = document.getElementById('story-text');
        storyElement.innerHTML = `<p>${text}</p>`;
        storyElement.style.animation = 'none';
        setTimeout(() => {
            storyElement.style.animation = 'fadeIn 1s ease-in-out';
        }, 50);
    }

    showFeedback(elementId, message, type) {
        const feedbackElement = document.getElementById(elementId);
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = type;
            
            // Auto-clear feedback after 3 seconds
            setTimeout(() => {
                feedbackElement.textContent = '';
                feedbackElement.className = '';
            }, 3000);
        }
    }

    showHint() {
        const hintText = document.getElementById('hint-text');
        const hints = [
            "Look closely... something shimmers where others cannot see.",
            "The moon rises first in the ancient tale of creation.",
            "Growth requires patience. Keep nurturing what you've planted.",
            "Balance is key. All energies must be awakened at once.",
            "I am round like the world, yet contain nothing. What am I?"
        ];
        
        if (this.currentPuzzle <= hints.length) {
            hintText.textContent = hints[this.currentPuzzle - 1];
            
            // Clear hint after 5 seconds
            setTimeout(() => {
                hintText.textContent = '';
            }, 5000);
        }
    }

    handleRedHerring() {
        // Red herrings provide misleading feedback or do nothing
        const messages = [
            "This path leads nowhere...",
            "A beautiful distraction, but not the answer.",
            "Some treasures are merely illusions."
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.updateStoryText(`*${randomMessage}*`);
    }

    restartGame() {
        // Reset all game state
        this.currentPuzzle = 1;
        this.puzzleSolved = [false, false, false, false, false];
        this.sequenceClicks = [];
        this.transformationClicks = 0;
        this.colorHarmonyState = { red: false, blue: false, green: false };
        
        // Reset UI elements
        document.getElementById('click-counter').textContent = '0';
        document.getElementById('sequence-feedback').textContent = '';
        document.getElementById('riddle-hint').textContent = '';
        
        // Reset transformation element
        const transformElement = document.getElementById('transformation-element');
        transformElement.textContent = '🌱';
        transformElement.className = 'clickable transformation-stage-0';
        
        // Reset color orbs
        const colorOrbs = document.querySelectorAll('.color-orb');
        colorOrbs.forEach(orb => orb.classList.remove('activated'));
        
        // Reset harmony indicator
        const harmonyIndicator = document.getElementById('harmony-indicator');
        harmonyIndicator.classList.remove('complete');
        harmonyIndicator.textContent = '';
        
        // Reset hidden symbol
        const hiddenSymbol = document.getElementById('hidden-symbol');
        hiddenSymbol.classList.remove('found');
        
        // Hide all puzzles and show first one
        for (let i = 1; i <= this.totalPuzzles; i++) {
            document.getElementById(`puzzle-${i}`).style.display = 'none';
        }
        document.getElementById('victory').style.display = 'none';
        
        // Reset story and progress
        this.updateStoryText("You stand before an ancient vault. Strange symbols glow faintly on the walls. The air hums with mysterious energy. To unlock its secrets, you must solve the riddles within...");
        this.updateProgress();
        this.showCurrentPuzzle();
    }

    /**
     * Utility Functions
     */
    arraysEqual(a, b) {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, i) => val === b[i]);
    }
}

/**
 * EXTENSION POINT: Adding New Puzzles
 * 
 * To add new puzzles to the game:
 * 1. Add the puzzle HTML structure to index.html following the existing pattern
 * 2. Add corresponding CSS styles for new puzzle elements
 * 3. Create a new method like handleNewPuzzle() and solveNewPuzzle()
 * 4. Add event listeners in setupEventListeners()
 * 5. Update totalPuzzles count and add to puzzleSolved array
 * 6. Add hint text to the hints array in showHint()
 * 
 * Example new puzzle structure:
 * - Create handleNewPuzzleType() method
 * - Create solveNewPuzzleType() method  
 * - Add event listeners for new interactive elements
 * - Update UI feedback systems as needed
 */

// Add fadeIn animation to CSS if not present
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MysticVaultGame();
});