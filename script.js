/**
 * The Mystic Vault - Enhanced Edition (10 Levels)
 * Advanced riddle-based clicker game with enhanced visuals and more puzzles
 */

class MysticVaultGame {
    constructor() {
        this.currentPuzzle = 1;
        this.totalPuzzles = 10;
        this.puzzleSolved = Array(10).fill(false);
        this.currentStreak = 0;
        
        // Puzzle-specific states
        this.sequenceClicks = [];
        this.transformationClicks = 0;
        this.colorHarmonyState = { red: false, blue: false, green: false };
        this.lightMirrorAngles = [0, 0, 0];
        this.musicSequence = [1, 3, 2, 5, 4];
        this.playerMusicSequence = [];
        this.mazePosition = [0, 0];
        this.elementWeights = { fire: 0, water: 0, earth: 0, air: 0 };
        this.gearStates = { past: 0, present: 0, future: 0 };
        this.audioContext = null;
        this.initAudioContext();
        this.init();
    }
    initAudioContext() {
    try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Play a musical note with specific frequency
playNote(frequency, duration = 500) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine'; // Smooth, mystical tone
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
}

// Musical note frequencies (mystical pentatonic scale)
getNoteFrequency(noteNumber) {
    const frequencies = {
        1: 261.63, // C4 - Deep and grounding
        2: 329.63, // E4 - Mystical and ethereal  
        3: 392.00, // G4 - Harmonious and balanced
        4: 523.25, // C5 - Bright and ascending
        5: 659.25  // E5 - High and transcendent
    };
    return frequencies[noteNumber];
}

// Enhanced melody playback with real audio
async playMelody() {
    if (this.currentPuzzle !== 7 || this.puzzleSolved[6]) return;

    // Resume audio context if suspended (browser requirement)
    if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
    }

    // Visual and audio melody playback
    this.musicSequence.forEach((note, index) => {
        setTimeout(() => {
            const noteButton = document.querySelector(`[data-note="${note}"]`);
            noteButton.classList.add('playing');
            
            // Play the actual musical note
            this.playNote(this.getNoteFrequency(note), 500);
            
            setTimeout(() => noteButton.classList.remove('playing'), 500);
        }, index * 700); // Slightly longer intervals for better listening
    });

    // Update feedback
    this.showFeedback('music-feedback', '🎵 Listen carefully to the ancient melody... 🎵', 'hint');
}

// Enhanced note clicking with audio feedback
handleNoteClick(element) {
    if (this.currentPuzzle !== 7 || this.puzzleSolved[6]) return;

    const note = parseInt(element.dataset.note);
    this.playerMusicSequence.push(note);

    // Visual feedback
    element.classList.add('playing');
    setTimeout(() => element.classList.remove('playing'), 300);

    // Play the note sound
    this.playNote(this.getNoteFrequency(note), 300);

    if (this.playerMusicSequence.length === this.musicSequence.length) {
        if (this.arraysEqual(this.playerMusicSequence, this.musicSequence)) {
            this.solvePuzzle7();
        } else {
            this.playerMusicSequence = [];
            this.showFeedback('music-feedback', '🎼 The melody falters... Listen more carefully to the sacred notes. 🎼', 'error');
        }
    } else {
        // Show progress
        this.showFeedback('music-feedback', `🎶 Note ${this.playerMusicSequence.length}/5 played... 🎶`, 'hint');
    }
}


    init() {
        this.updateProgress();
        this.updateStats();
        this.setupEventListeners();
        this.showCurrentPuzzle();
        this.generateMaze();
    }

    setupEventListeners() {
        // Original puzzles (1-5) - keep existing logic
        const hiddenSymbol = document.getElementById('hidden-symbol');
        if (hiddenSymbol) hiddenSymbol.addEventListener('click', () => this.solvePuzzle1());

        const redHerrings = document.querySelectorAll('.red-herring');
        redHerrings.forEach(herring => {
            herring.addEventListener('click', () => this.handleRedHerring());
        });

        const sequenceItems = document.querySelectorAll('.sequence-item');
        sequenceItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleSequenceClick(e.target));
        });

        const transformElement = document.getElementById('transformation-element');
        if (transformElement) transformElement.addEventListener('click', () => this.handleTransformation());

        const colorOrbs = document.querySelectorAll('.color-orb');
        colorOrbs.forEach(orb => {
            orb.addEventListener('click', (e) => this.handleColorHarmony(e.target));
        });

        const riddleOptions = document.querySelectorAll('.riddle-option');
        riddleOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleRiddleAnswer(e.target));
        });

        // NEW PUZZLE 6: Light Reflection
        const mirrors = document.querySelectorAll('.mirror');
        mirrors.forEach((mirror, index) => {
            mirror.addEventListener('click', () => this.rotateMirror(index));
        });

        // NEW PUZZLE 7: Musical Sequence
        const playMelodyBtn = document.getElementById('play-melody');
        if (playMelodyBtn) playMelodyBtn.addEventListener('click', () => this.playMelody());

        const noteButtons = document.querySelectorAll('.note-button');
        noteButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleNoteClick(e.target));
        });

        // NEW PUZZLE 8: Crystal Maze - handled in generateMaze()

        // NEW PUZZLE 9: Elemental Balance
        const weightButtons = document.querySelectorAll('.weight-btn');
        weightButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleWeightChange(e.target));
        });

        // NEW PUZZLE 10: Time Portal
        const gears = document.querySelectorAll('.gear');
        gears.forEach(gear => {
            gear.addEventListener('click', (e) => this.handleGearClick(e.target));
        });

        // UI Elements
        const hintBtn = document.getElementById('hint-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartGame());
    }

    // Original Puzzles (1-5) - Keep existing methods
    solvePuzzle1() {
        if (this.currentPuzzle !== 1 || this.puzzleSolved[0]) return;

        const hiddenSymbol = document.getElementById('hidden-symbol');
        hiddenSymbol.classList.add('found');
        
        this.puzzleSolved[0] = true;
        this.updateStoryText("*The ancient symbol blazes to life! Energy courses through the vault walls. The first chamber yields its secrets...*");
        
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    handleSequenceClick(element) {
        if (this.currentPuzzle !== 2 || this.puzzleSolved[1]) return;

        const correctOrder = [1, 2, 3, 4];
        const clickedOrder = parseInt(element.dataset.order);
        
        this.sequenceClicks.push(clickedOrder);
        element.classList.add('correct');
        setTimeout(() => element.classList.remove('correct'), 500);
        
        if (this.sequenceClicks.length === 4) {
            if (this.arraysEqual(this.sequenceClicks, correctOrder)) {
                this.solvePuzzle2();
            } else {
                this.resetSequence();
                this.showFeedback('sequence-feedback', 'The celestial dance is disrupted. The cosmos rejects this pattern...', 'error');
            }
        }
    }

    solvePuzzle2() {
        this.puzzleSolved[1] = true;
        this.showFeedback('sequence-feedback', '✨ The stars align in perfect harmony! ✨', 'success');
        this.updateStoryText("*The celestial symphony resonates through dimensions. Ancient mechanisms awaken to your cosmic understanding...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    resetSequence() {
        this.sequenceClicks = [];
        const sequenceItems = document.querySelectorAll('.sequence-item');
        sequenceItems.forEach(item => {
            item.classList.remove('correct', 'incorrect');
        });
    }

    handleTransformation() {
        if (this.currentPuzzle !== 3 || this.puzzleSolved[2]) return;

        this.transformationClicks++;
        const element = document.getElementById('transformation-element');
        const counter = document.getElementById('click-counter');
        
        counter.textContent = this.transformationClicks;
        
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
        this.updateStoryText("*Through patience and nurturing, you have unlocked the secret of eternal growth. Magic flows like a river through your soul...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    handleColorHarmony(element) {
        if (this.currentPuzzle !== 4 || this.puzzleSolved[3]) return;

        const color = element.dataset.color;
        this.colorHarmonyState[color] = !this.colorHarmonyState[color];
        
        if (this.colorHarmonyState[color]) {
            element.classList.add('activated');
        } else {
            element.classList.remove('activated');
        }
        
        if (this.colorHarmonyState.red && this.colorHarmonyState.blue && this.colorHarmonyState.green) {
            this.solvePuzzle4();
        }
    }

    solvePuzzle4() {
        this.puzzleSolved[3] = true;
        const harmonyIndicator = document.getElementById('harmony-indicator');
        harmonyIndicator.classList.add('complete');
        harmonyIndicator.textContent = '🌈';
        
        this.updateStoryText("*The trinity of colors merges into pure light! Reality bends as the prismatic energies unlock deeper mysteries...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    handleRiddleAnswer(element) {
        if (this.currentPuzzle !== 5 || this.puzzleSolved[4]) return;

        const isCorrect = element.dataset.answer === 'correct';
        
        if (isCorrect) {
            element.classList.add('correct-answer');
            this.solvePuzzle5();
        } else {
            this.showFeedback('riddle-hint', 'Think deeper... What shape represents infinity yet holds nothing within?', 'hint');
            element.style.animation = 'redHerringShake 0.5s ease-in-out';
        }
    }

    solvePuzzle5() {
        this.puzzleSolved[4] = true;
        this.updateStoryText("*The eternal circle - beginning without end, holding everything and nothing! Your wisdom pierces the veil of paradox...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    // NEW PUZZLE 6: Light Reflection
    rotateMirror(index) {
        if (this.currentPuzzle !== 6 || this.puzzleSolved[5]) return;

        this.lightMirrorAngles[index] = (this.lightMirrorAngles[index] + 45) % 360;
        const mirror = document.getElementById(`mirror-${index + 1}`);
        mirror.style.transform = `rotate(${this.lightMirrorAngles[index]}deg)`;

        // Check if light path is correct (simplified - just check if all mirrors are at 45-degree angles)
        if (this.lightMirrorAngles.every(angle => angle === 45 || angle === 135 || angle === 225 || angle === 315)) {
            this.solvePuzzle6();
        }
    }

    solvePuzzle6() {
        this.puzzleSolved[5] = true;
        const target = document.getElementById('rune-target');
        target.classList.add('illuminated');
        
        this.updateStoryText("*The light dances through crystal mirrors, awakening the ancient rune! Photons bend to your will, revealing the path forward...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    // Enhanced puzzle 7 solution
solvePuzzle7() {
    this.puzzleSolved[6] = true;
    
    // Play a triumphant chord
    setTimeout(() => this.playNote(261.63, 1000), 0);   // C
    setTimeout(() => this.playNote(329.63, 1000), 100); // E  
    setTimeout(() => this.playNote(392.00, 1000), 200); // G
    setTimeout(() => this.playNote(523.25, 1000), 300); // C (octave)
    
    this.showFeedback('music-feedback', '🎼✨ The ancient melody resonates perfectly! ✨🎼', 'success');
    this.updateStoryText("*Your musical mastery awakens the sleeping spirits of the vault. The harmonies of forgotten ages now sing through your soul, guiding you to deeper mysteries...*");
    
    setTimeout(() => this.advancePuzzle(), 3000);
}

    // NEW PUZZLE 8: Crystal Maze
    generateMaze() {
        const mazeGrid = document.getElementById('crystal-maze');
        if (!mazeGrid) return;

        // Simple 6x6 maze pattern
        const mazePattern = [
            [1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1],
            [0, 1, 1, 0, 1, 1],
            [1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 2]
        ];

        mazeGrid.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (mazePattern[row][col] === 0) {
                    cell.classList.add('wall');
                    cell.textContent = '🔹';
                } else if (mazePattern[row][col] === 2) {
                    cell.classList.add('goal');
                    cell.textContent = '💎';
                } else {
                    cell.classList.add('path');
                    cell.textContent = '✨';
                }

                if (row === 0 && col === 0) {
                    cell.classList.add('current');
                    cell.textContent = '🧙‍♂️';
                }

                cell.addEventListener('click', () => this.handleMazeMove(row, col));
                mazeGrid.appendChild(cell);
            }
        }
    }

    handleMazeMove(row, col) {
        if (this.currentPuzzle !== 8 || this.puzzleSolved[7]) return;

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('wall')) return;

        // Check if adjacent to current position
        const [currentRow, currentCol] = this.mazePosition;
        const distance = Math.abs(row - currentRow) + Math.abs(col - currentCol);
        if (distance !== 1) return;

        // Move player
        const oldCell = document.querySelector('.maze-cell.current');
        oldCell.classList.remove('current');
        oldCell.textContent = '✨';

        cell.classList.add('current');
        cell.textContent = '🧙‍♂️';
        this.mazePosition = [row, col];

        document.getElementById('maze-position').textContent = `Position: (${row + 1},${col + 1})`;

        // Check if reached goal
        if (cell.classList.contains('goal')) {
            this.solvePuzzle8();
        }
    }

    solvePuzzle8() {
        this.puzzleSolved[7] = true;
        this.updateStoryText("*You navigate the crystal labyrinth with perfect precision! The maze recognizes a true pathfinder and yields its treasure...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    // NEW PUZZLE 9: Elemental Balance
    handleWeightChange(element) {
        if (this.currentPuzzle !== 9 || this.puzzleSolved[8]) return;

        const elementType = element.dataset.element;
        const action = element.dataset.action;

        if (action === 'add') {
            this.elementWeights[elementType] = Math.min(this.elementWeights[elementType] + 1, 10);
        } else {
            this.elementWeights[elementType] = Math.max(this.elementWeights[elementType] - 1, 0);
        }

        document.getElementById(`${elementType}-weight`).textContent = this.elementWeights[elementType];

        this.checkElementBalance();
    }

    checkElementBalance() {
        // Perfect balance: Fire + Water = Earth + Air, and Fire = Water, Earth = Air
        const { fire, water, earth, air } = this.elementWeights;
        
        if (fire === water && earth === air && (fire + water) === (earth + air) && fire > 0) {
            this.solvePuzzle9();
        }

        // Update visual balance indicator
        const leftSide = fire + water;
        const rightSide = earth + air;
        const indicator = document.getElementById('balance-indicator');
        
        if (leftSide === rightSide && leftSide > 0) {
            indicator.textContent = '⚖️ Perfect Balance ⚖️';
            indicator.classList.add('balanced');
        } else {
            indicator.textContent = `Left: ${leftSide} | Right: ${rightSide}`;
            indicator.classList.remove('balanced');
        }

        // Animate scale platforms
        const leftScale = document.getElementById('left-scale');
        const rightScale = document.getElementById('right-scale');
        
        if (leftSide > rightSide) {
            leftScale.style.transform = 'translateY(10px) rotate(-2deg)';
            rightScale.style.transform = 'translateY(-10px) rotate(2deg)';
        } else if (rightSide > leftSide) {
            leftScale.style.transform = 'translateY(-10px) rotate(2deg)';
            rightScale.style.transform = 'translateY(10px) rotate(-2deg)';
        } else {
            leftScale.style.transform = 'translateY(0) rotate(0deg)';
            rightScale.style.transform = 'translateY(0) rotate(0deg)';
        }
    }

    solvePuzzle9() {
        this.puzzleSolved[8] = true;
        this.updateStoryText("*The four elements achieve perfect equilibrium! Fire and water, earth and air - all forces of creation now bow to your mastery...*");
        setTimeout(() => this.advancePuzzle(), 2000);
    }

    // NEW PUZZLE 10: Time Portal
    handleGearClick(element) {
        if (this.currentPuzzle !== 10 || this.puzzleSolved[9]) return;

        const gearType = element.dataset.gear;
        this.gearStates[gearType] = (this.gearStates[gearType] + 1) % 4; // 4 positions

        // Rotate gear visually
        element.style.transform = `rotate(${this.gearStates[gearType] * 90}deg)`;
        
        // Add spinning animation temporarily
        element.classList.add('spinning');
        setTimeout(() => element.classList.remove('spinning'), 1000);

        // Check if all gears are in correct positions (all at position 3)
        if (this.gearStates.past === 3 && this.gearStates.present === 3 && this.gearStates.future === 3) {
            this.solvePuzzle10();
        }

        this.updateTimePortal();
    }

    updateTimePortal() {
        const portal = document.getElementById('chronos-portal');
        const correctGears = Object.values(this.gearStates).filter(state => state === 3).length;
        
        if (correctGears === 3) {
            portal.classList.add('active');
            this.showFeedback('time-feedback', '⏰ The temporal alignment is perfect! Time itself bends to your will! ⏰', 'success');
        } else {
            this.showFeedback('time-feedback', `Temporal alignment: ${correctGears}/3 gears synchronized`, 'hint');
        }
    }

    solvePuzzle10() {
        this.puzzleSolved[9] = true;
        this.updateStoryText("*Time fractures and mends at your command! Past, present, and future converge into a single moment of infinite possibility. You have mastered the ultimate mystery!*");
        setTimeout(() => this.showVictory(), 2000);
    }

    // Game Flow Management
    advancePuzzle() {
        if (this.currentPuzzle < this.totalPuzzles) {
            document.getElementById(`puzzle-${this.currentPuzzle}`).style.display = 'none';
            this.currentPuzzle++;
            this.currentStreak++;
            this.showCurrentPuzzle();
            this.updateProgress();
            this.updateStats();
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

        // Update level indicator
        document.getElementById('current-level').textContent = this.currentPuzzle;
    }

    showVictory() {
        document.getElementById(`puzzle-${this.currentPuzzle}`).style.display = 'none';
        const victoryScreen = document.getElementById('victory');
        victoryScreen.style.display = 'block';
        this.updateProgress(100);
        this.updateStats();
    }

    updateProgress(customPercentage = null) {
        const progressFill = document.getElementById('progress-fill');
        const percentage = customPercentage || (this.puzzleSolved.filter(solved => solved).length / this.totalPuzzles) * 100;
        progressFill.style.width = percentage + '%';
    }

    updateStats() {
        document.getElementById('puzzles-solved').textContent = this.puzzleSolved.filter(solved => solved).length;
        document.getElementById('current-streak').textContent = this.currentStreak;
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
            
            setTimeout(() => {
                feedbackElement.textContent = '';
                feedbackElement.className = '';
            }, 4000);
        }
    }

    showHint() {
        const hintText = document.getElementById('hint-text');
        const hints = [
            "🔍 Look closely... something shimmers where others cannot see. Patience reveals all secrets.",
            "🌙 The moon rises first in the ancient tale of creation. Follow the celestial order of the cosmos.",
            "🌱 Growth requires patience and persistence. Keep nurturing what you've planted with care.",
            "🎨 Balance is key. All three energies must be awakened simultaneously to create harmony.",
            "⭕ I am round like the world, yet contain nothing within. What shape represents eternity?",
            "💡 Angle the mirrors to guide light to the ancient rune. Each reflection matters greatly.",
            "🎵 Listen carefully to the melody, then repeat it exactly. Music is the language of the ancients.",
            "🗺️ Navigate wisely through the crystal maze. One false step returns you to the beginning.",
            "⚖️ Fire opposes Water, Earth opposes Air. Find the perfect balance where all forces are equal.",
            "⏰ Align all three gears of time to the same position. Past, present, and future must unite."
        ];
        
        if (this.currentPuzzle <= hints.length) {
            hintText.textContent = hints[this.currentPuzzle - 1];
            
            setTimeout(() => {
                hintText.textContent = '';
            }, 8000);
        }
    }

    handleRedHerring() {
        const messages = [
            "This path leads only to illusion and shadow...",
            "A beautiful distraction, but not the key you seek.",
            "Some treasures are merely reflections of desire.",
            "The vault whispers: 'Not all that glitters holds truth.'"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.updateStoryText(`*${randomMessage}*`);
    }

    restartGame() {
        // Reset all game state
        this.currentPuzzle = 1;
        this.puzzleSolved = Array(10).fill(false);
        this.currentStreak = 0;
        
        // Reset puzzle states
        this.sequenceClicks = [];
        this.transformationClicks = 0;
        this.colorHarmonyState = { red: false, blue: false, green: false };
        this.lightMirrorAngles = [0, 0, 0];
        this.playerMusicSequence = [];
        this.mazePosition = [0, 0];
        this.elementWeights = { fire: 0, water: 0, earth: 0, air: 0 };
        this.gearStates = { past: 0, present: 0, future: 0 };
        
        // Reset UI elements
        document.getElementById('click-counter').textContent = '0';
        document.getElementById('current-level').textContent = '1';
        
        // Reset specific puzzle elements
        this.resetAllPuzzleElements();
        
        // Hide all puzzles and show first one
        for (let i = 1; i <= this.totalPuzzles; i++) {
            document.getElementById(`puzzle-${i}`).style.display = 'none';
        }
        document.getElementById('victory').style.display = 'none';
        
        this.updateStoryText("You stand before the ancient vault once more. The air hums with renewed mysterious energy, as if the vault itself remembers your previous mastery...");
        this.updateProgress();
        this.updateStats();
        this.showCurrentPuzzle();
        this.generateMaze();
    }

    resetAllPuzzleElements() {
        // Reset transformation
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
        
        // Reset mirrors
        const mirrors = document.querySelectorAll('.mirror');
        mirrors.forEach(mirror => {
            mirror.style.transform = 'rotate(0deg)';
        });
        
        // Reset light target
        const lightTarget = document.getElementById('rune-target');
        lightTarget.classList.remove('illuminated');
        
        // Reset element weights display
        ['fire', 'water', 'earth', 'air'].forEach(element => {
            document.getElementById(`${element}-weight`).textContent = '0';
        });
        
        // Reset balance indicator
        const balanceIndicator = document.getElementById('balance-indicator');
        balanceIndicator.classList.remove('balanced');
        balanceIndicator.textContent = '';
        
        // Reset scales
        document.getElementById('left-scale').style.transform = 'translateY(0) rotate(0deg)';
        document.getElementById('right-scale').style.transform = 'translateY(0) rotate(0deg)';
        
        // Reset gears
        const gears = document.querySelectorAll('.gear');
        gears.forEach(gear => {
            gear.style.transform = 'rotate(0deg)';
            gear.classList.remove('spinning');
        });
        
        // Reset time portal
        const portal = document.getElementById('chronos-portal');
        portal.classList.remove('active');
        
        // Clear all feedback
        ['sequence-feedback', 'riddle-hint', 'music-feedback', 'time-feedback'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
                element.className = '';
            }
        });
    }

    arraysEqual(a, b) {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, i) => val === b[i]);
    }
}

// Add enhanced fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(30px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize the enhanced game
document.addEventListener('DOMContentLoaded', () => {
    new MysticVaultGame();
});
