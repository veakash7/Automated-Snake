# 🐍 NEURAL-SNAKE OS
> **Status: SYSTEM OPERATIONAL** | **Core: IMMORTAL** | **Logic: HAMILTONIAN**

![License: MIT](https://img.shields.io/badge/License-MIT-00f2ff.svg?style=for-the-badge)
![JS: ES6+](https://img.shields.io/badge/Engine-Vanilla%20JS-39ff14.svg?style=for-the-badge)
![Logic: Hamiltonian](https://img.shields.io/badge/Algorithm-Hamiltonian%20Cycle-ff003c.svg?style=for-the-badge)

**NeuralSnake OS** is a high-fidelity AI simulation designed to solve the classic Snake game with mathematical certainty. By merging a rigid **Hamiltonian Rail** with dynamic **Shortcut Heuristics**, the system achieves a 100% win rate on any even-dimension grid.

---

## ⚡ SYSTEM ARCHITECTURE

### 1. The Hamiltonian Safety Rail
The AI's "DNA" is a pre-computed Hamiltonian Cycle—a path that visits every single tile on the $20 \times 20$ grid exactly once before returning to the origin. This ensures the snake *always* has a clear path forward.

### 2. Adaptive Shortcut Engine
Following a fixed rail is safe but inefficient. Our **Shortcut Heuristic** allows the snake to "jump" across the track if:
* The target node's index is ahead in the cycle.
* The gap created by the shortcut does not exceed the current distance to the tail (maintaining a 2-tile safety buffer).

### 3. Telemetry & Monitoring
* **Vector Analysis:** Real-time calculation of path efficiency.
* **Logic Switching:** Dynamic toggling between `Following Rail` and `Shortcut (A*)`.
* **Clock Speed:** Adjustable simulation frequency from 10ms to 200ms.

---

## 🛠️ INSTALLATION

```bash
# Clone the Core
git clone [https://github.com/veakash7/neural-snake.git](https://github.com/veakash7/neural-snake.git)

# Enter the Directory
cd neural-snake

# Launch Simulation
open index.html
