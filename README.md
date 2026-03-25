# 🐍 NeuralSnake OS | Hamiltonian AI Simulation

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Technology: Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-yellow.svg)
![Logic: Hamiltonian Cycle](https://img.shields.io/badge/Logic-Hamiltonian%20Cycle-green.svg)

**NeuralSnake** is a high-performance, automated Snake AI. Unlike traditional snake games, this system uses a **Hamiltonian Cycle Safety Rail** combined with **Shortcut Heuristics** to ensure the snake can fill the entire 400-tile grid without ever colliding with itself.



## 🧠 Core Intelligence

The simulation operates on a tiered decision-making process:

1.  **The Safety Rail (Hamiltonian Cycle):** The system generates a pre-calculated path that visits every coordinate on the $20 \times 20$ grid exactly once before returning to the start.
2.  **Shortcutting:** To prevent the snake from being "slow," it calculates the distance to food. If a shortcut across the rail is available, it validates the move by checking if the "skipped" distance is less than the current distance to the tail.
3.  **Immortal Logic:** By maintaining a 2-tile buffer between the head and tail along the cycle index, the snake is mathematically guaranteed to reach the maximum possible score (4000).

## 🚀 Key Features

* **Cyberpunk UI:** Glassmorphism dashboard with CRT scanline effects.
* **Real-time Telemetry:** Live tracking of strategy modes (Rail vs. Shortcut) and path vectors.
* **Variable Processor Frequency:** Adjust simulation speed from "Manual Step" to "Hyper-Fast."
* **Responsive Design:** Optimized for both desktop monitoring and mobile viewports.

## 🛠️ Installation & Usage

1. Clone the repository:
   ```bash
   git clone [https://github.com/veakash7/neural-snake.git](https://github.com/veakash7/neural-snake.git)
