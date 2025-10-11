# 🚂 Search Algorithms Visualization Tool

An interactive web application to visualize and compare **9 different search algorithms** using a real-world scenario: helping Nimal catch his train during evening rush hour in Colombo!

![Search Algorithms Tool](https://img.shields.io/badge/Algorithms-9-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![Status](https://img.shields.io/badge/Status-Complete-success)

---

## 🚀 Getting Started

### 🌐 **Live Demo (Recommended)**

**This tool is hosted on Vercel and ready to use!**

**Live URL**: [https://search-algorithms-y5oo.vercel.app/](https://search-algorithms-y5oo.vercel.app/)

👉 **Simply click the link above - no installation needed!**

---

### 💻 **Local Setup (If live demo is not working)**

If the Vercel deployment is unavailable, you can run the tool locally:

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

#### Installation

```bash
# Clone or navigate to the project directory
cd search-algorithms-tool

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# The app will be available at http://localhost:3001
```

#### Build for Production

```bash
npm run build
```

---

## 📖 Table of Contents

- [Overview](#overview)
- [The Scenario](#the-scenario)
- [Features](#features)
- [Algorithms Implemented](#algorithms-implemented)
- [How to Use](#how-to-use)
- [Understanding the Results](#understanding-the-results)
- [Configuration Options](#configuration-options)
- [Performance Comparison](#performance-comparison)
- [Technical Details](#technical-details)

---

## 🎯 Overview

This tool helps you understand how different AI search algorithms work by visualizing them on a real-world problem. You can:

- ✅ Run 9 different search algorithms
- ✅ See step-by-step how they explore the graph
- ✅ Compare their performance side-by-side
- ✅ Adjust traffic conditions and constraints
- ✅ Create custom graphs and scenarios

**Perfect for**: Students learning AI, educators teaching search algorithms, or anyone curious about pathfinding!

---

## 🚉 The Scenario

**Problem**: Nimal finishes a meeting in **Dehiwala** at 5:45 PM. He needs to catch the **6:10 PM train to Maho** from either:

- **Fort Station** (25 minutes deadline)
- **Maradana Station** (27 minutes deadline)

**Challenge**: Find the fastest route during **evening rush hour traffic**!

**Map**:

```
Dehiwala (Start)
    ↓
    ├→ Wellawatte → Bambalapitiya → Kollupitiya → Fort Station (Goal 1)
    ├→ Bambalapitiya → Union Place → Fort Station (Goal 1)
    ├→ Borella → Union Place → Fort Station (Goal 1)
    └→ Borella → Maradana Station (Goal 2)
```

---

## ✨ Features

### 🔍 **Algorithm Visualization**

- Watch algorithms explore the graph in real-time
- See which nodes are visited (yellow) vs part of solution (green)
- Track nodes expanded and path cost

### 📊 **Performance Comparison**

- Compare all 9 algorithms at once
- See which is fastest, most efficient, and optimal
- Understand trade-offs between algorithms

### 🚦 **Traffic Simulation**

- **5 time slots** with different traffic multipliers:
  - Off-Peak (×1.0)
  - Morning Rush (×1.8)
  - School Pickup (×1.3)
  - Evening Peak (×2.0) ← Default
  - Weekend (×1.25)
- **One-way restrictions** during peak hours

### 🎨 **Interactive Graph Editor**

- Add/remove nodes and edges
- Modify costs and heuristics
- Set deadlines for goals
- Import/export configurations

### 📈 **Detailed Analytics**

- Path cost (travel time)
- Nodes expanded (efficiency)
- Success/failure with deadlines
- Algorithm complexity analysis

---

## 🧠 Algorithms Implemented

### **Uninformed Search** (No heuristic)

1. **BFS (Breadth-First Search)**

   - Explores level by level
   - Optimal for unweighted graphs
   - Complete
2. **DFS (Depth-First Search)**

   - Goes deep first, then backtracks
   - Not optimal
   - Uses less memory
3. **DLS (Depth-Limited Search)** ⭐ NEW

   - DFS with depth limit
   - Configurable depth parameter
   - Complete only if solution within limit
4. **IDDFS (Iterative Deepening DFS)**

   - Runs DLS with increasing depths
   - Combines BFS optimality with DFS memory efficiency
   - Complete and optimal
5. **UCS (Uniform Cost Search)**

   - Always expands cheapest path
   - Guaranteed optimal
   - Uses edge costs
6. **Bidirectional Search**

   - Searches from both start and goal
   - Meets in the middle
   - Very efficient

### **Informed Search** (Uses heuristic h(n))

7. **Greedy Best-First**

   - Only considers heuristic
   - Fast but not optimal
   - Can get stuck
8. **A\* Search** ⭐ RECOMMENDED

   - Balances actual cost g(n) and heuristic h(n)
   - Optimal with admissible heuristic
   - Most popular in practice
9. **Hill Climbing**

   - Local greedy search
   - Very fast
   - Can get stuck at local maxima

---

## 📖 How to Use

### Step 1: Select Algorithm

Choose from the dropdown menu (9 algorithms available)

### Step 2: Configure (Optional)

- **For DLS**: Set depth limit (1-10)
- **Traffic**: Choose time slot
- **One-way**: Enable/disable restrictions

### Step 3: Run

Click **"Run Algorithm"** to see it in action

### Step 4: Analyze Results

View:

- ✅/❌ Train caught or missed
- 🛤️ Solution path (route to follow)
- 📊 Nodes expanded (efficiency)
- ⏱️ Travel time and time margin

### Step 5: Compare

Click **"Compare All Algorithms"** to see comprehensive comparison

---

## 📊 Understanding the Results

### Result Display

```
┌─────────────────────────────────────┐
│ 🎉 TRAIN CAUGHT! 🎉                 │
│ Arrived 14 minutes early!           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Actual Path Cost (g): 13 min       │
│ Nodes Expanded: 3                   │
│ Destination: Maradana Station       │
│ Path Length: 3 nodes                │
│ Time Margin: +14 min                │
└─────────────────────────────────────┘
```

### Graph Visualization

**Node Colors**:

- 🔵 **Blue** = Start node (Dehiwala)
- 🔴 **Red** = Goal nodes (Fort/Maradana)
- 🟢 **Green** = Solution path
- 🟡 **Yellow** = Explored but not in solution
- ⚪ **Gray** = Not visited

**Edge Labels**:

- Numbers show actual travel time (base cost × traffic multiplier)
- Dashed red lines = one-way restrictions

**Node Information**:

- **h=X** = Heuristic value (estimated time to goal)
- **⏰Xmin** = Deadline (for goal nodes)

---

## ⚙️ Configuration Options

### Traffic Conditions

Adjust the **Time Slot** to change traffic multipliers:

```
Time Slot                    Multiplier    Real-World Effect
─────────────────────────────────────────────────────────────
Off-Peak (10 AM - 3 PM)         ×1.0      Normal speed
Morning Rush (7:30-9:15 AM)     ×1.8      Heavy traffic
School Pickup (12:45-2:15 PM)   ×1.3      Moderate traffic
Evening Peak (5:45-7:30 PM)     ×2.0      Worst traffic ⚠️
Weekend (11 AM - 2 PM)          ×1.25     Light traffic
```

**Example**: Base edge cost of 5 min becomes:

- Off-peak: 5 × 1.0 = **5 min**
- Evening peak: 5 × 2.0 = **10 min** ⚠️

### One-Way Restrictions

Enable **One-Way Traffic Restrictions** to simulate:

- Peak hour traffic rules in Fort area
- Certain routes become one-directional
- Penalties for restricted directions

### DLS Depth Limit

When **DLS (Depth-Limited Search)** is selected:

- Input field appears to set depth limit
- Range: 1-10 nodes
- Default: 3 nodes
- Set higher for deeper searches

### Custom Graphs

**Add Nodes**:

1. Click **[+]** button (purple)
2. Enter name, heuristic h(n), optional deadline
3. Check "Is Goal" if it's a destination
4. Node placed automatically (no overlaps)

**Add Edges**:

1. Click **[+]** button (indigo)
2. Select "From" and "To" nodes
3. Enter base cost (minutes)
4. Check "One-Way" if needed

**Manage Nodes/Edges**:

- Click **"Node Manager"** or **"Edge Manager"** (collapsible sections)
- Edit values inline
- Delete with trash icon 🗑️

**Import/Export**:

- **Export** 💾: Save configuration as JSON
- **Import** 📂: Load saved configuration

---

## 🏆 Performance Comparison

### Performance Summary (Compare All)

When you click **"Compare All Algorithms"**, you'll see:

#### 1️⃣ **Fastest Algorithm(s)**

Shows which found the shortest path (lowest cost)

#### 2️⃣ **Most Efficient**

Shows which explored fewest nodes

#### 3️⃣ **Success Rate**

Percentage of algorithms that caught the train

#### 4️⃣ **Optimal Path Found By**

Lists all algorithms that found the best solution

### Detailed Comparison Table

View all algorithms side-by-side:

| Algorithm  | Time   | Deadline | Status    | Nodes | Optimal? |
| ---------- | ------ | -------- | --------- | ----- | -------- |
| BFS        | 13 min | 27 min   | ✅ Caught | 6     | ⭐ Yes   |
| DFS        | 15 min | 27 min   | ✅ Caught | 4     | No       |
| DLS        | -      | -        | ❌ Missed | 2     | No       |
| IDDFS      | 13 min | 27 min   | ✅ Caught | 8     | ⭐ Yes   |
| UCS        | 13 min | 27 min   | ✅ Caught | 5     | ⭐ Yes   |
| Greedy     | 13 min | 27 min   | ✅ Caught | 3     | ⭐ Yes   |
| A*         | 13 min | 27 min   | ✅ Caught | 3     | ⭐ Yes   |
| Bidirect   | -      | -        | ❌ Missed | 0     | No       |
| Hill Climb | 13 min | 27 min   | ✅ Caught | 3     | ⭐ Yes   |

### Algorithm Complexity

Each result shows:

- ⏱️ **Time Complexity**: Worst-case running time
- 💾 **Space Complexity**: Memory usage
- ✅ **Complete**: Will always find solution if exists?
- ⭐ **Optimal**: Guaranteed to find best solution?
- 📝 **Description**: Key characteristics

**Example for A***:

```
Time Complexity:  O(b^d)
Space Complexity: O(b^d)
Complete:         Yes
Optimal:          Yes (admissible h)
Description:      Complete and optimal with admissible heuristic

Where: g(n) = actual path cost, h(n) = heuristic estimate,
       b = branching factor, d = depth
```

---

## 🔬 Technical Details

### Key Concepts

**g(n) - Actual Cost**:

- Real travel time from start to node n
- Calculated by summing edge costs along the path
- Example: Dehiwala → Borella → Maradana = 5 + 8 = 13 min

**h(n) - Heuristic**:

- *Estimated* time from node n to nearest goal
- Pre-defined for each node
- Should be admissible (never overestimate) for A* optimality
- Example: Borella has h=3 (estimated 3 min to Maradana)

**f(n) - Total Estimated Cost**:

- Used by A*: f(n) = g(n) + h(n)
- Example: At Borella: f = 5 (actual so far) + 3 (estimate remaining) = 8

**Nodes Expanded**:

- Number of nodes the algorithm "looked at"
- Lower = more efficient
- Example: A* expanded 3 nodes (Dehiwala, Borella, Maradana)

### Algorithm Selection Guide

**Choose A*** if:

- ✅ You need optimal solution
- ✅ You have good heuristic
- ✅ Efficiency matters
- 🏆 **Best all-around choice**

**Choose UCS** if:

- ✅ You need optimal solution
- ✅ No heuristic available
- ✅ Edge costs vary significantly

**Choose Greedy** if:

- ✅ Speed is critical
- ✅ Near-optimal is acceptable
- ⚠️ Risk: might not find optimal

**Choose BFS** if:

- ✅ Unweighted graph (all edges same cost)
- ✅ Need optimal solution
- ✅ No heuristic available

**Choose IDDFS** if:

- ✅ Unweighted graph
- ✅ Memory constrained
- ✅ Need optimal solution

**Avoid DFS** if:

- ❌ You need optimal solution
- ❌ You need guarantees

### Implementation Details

**Built with**:

- React 18
- Tailwind CSS
- Lucide React Icons
- Vite

**Files**:

```
search-algorithms-tool/
├── src/
│   ├── App.tsx              # Main component (all algorithms)
│   ├── index.css            # Tailwind styles
│   └── main.tsx             # Entry point
├── public/
├── PERFORMANCE_SUMMARY_EXPLANATION.md   # Detailed performance guide
├── COMPARISON_ONE_WAY_ENABLED.md        # Results with one-way ON
├── COMPARISON_ONE_WAY_DISABLED.md       # Results with one-way OFF
├── README.md                # This file
├── package.json
└── vite.config.js
```

**Algorithms Location**:
All 9 algorithms are implemented in `src/App.tsx`:

- Lines 236-284: BFS
- Lines 286-336: DFS
- Lines 338-397: DLS (NEW)
- Lines 399-457: IDDFS
- Lines 459-513: UCS
- Lines 515-567: Greedy
- Lines 569-625: A*
- Lines 627-729: Bidirectional
- Lines 731-780: Hill Climbing

---

## 📚 Learning Resources

### Understanding Search Algorithms

1. **Start with**: BFS and DFS (fundamentals)
2. **Then try**: UCS (adds costs)
3. **Learn heuristics**: Greedy and A*
4. **Advanced**: IDDFS, Bidirectional

### Experiment Ideas

1. **Change traffic conditions**: See how algorithms adapt
2. **Modify heuristics**: Make h(n) inaccurate → observe Greedy/A* behavior
3. **Add nodes**: Create more complex graphs
4. **Adjust DLS depth**: See when it fails vs succeeds
5. **Compare runtimes**: Note nodes expanded differences

### Key Insights to Discover

- Why A* is usually better than Greedy
- Why DFS is not optimal
- How heuristics improve efficiency
- Trade-offs between time and space
- When simple algorithms (BFS) are best

---

## 🎓 Educational Use

### For Students

**This tool helps you**:

- ✅ Visualize abstract algorithms
- ✅ Understand g(n), h(n), f(n)
- ✅ Compare performance empirically
- ✅ Experiment with parameters
- ✅ Prepare for exams/assignments

**Study Tips**:

1. Run each algorithm individually first
2. Predict which will be fastest/optimal
3. Compare predictions with actual results
4. Read `PERFORMANCE_SUMMARY_EXPLANATION.md` for deep dive
5. Compare `COMPARISON_ONE_WAY_ENABLED.md` vs `COMPARISON_ONE_WAY_DISABLED.md`
6. Try creating your own scenarios

### For Educators

**Teaching Benefits**:

- 📊 Live demonstrations in class
- 🎯 Concrete real-world examples
- 🔄 Interactive experiments
- 📝 Built-in complexity analysis
- 🎨 Visual learning support

**Lesson Ideas**:

1. "Which algorithm would you use?" discussions
2. Competitive prediction games
3. Graph design challenges
4. Algorithm racing tournaments
5. Heuristic design exercises

---

## 🐛 Troubleshooting

**DLS always fails?**

- Increase depth limit to 3 or higher
- Check if solution path is deeper than limit

**Bidirectional search fails?**

- Works best with single goal
- Check graph connectivity

**Strange results?**

- Refresh page
- Re-import graph configuration
- Check for negative edge costs

**Performance slow?**

- Large graphs may take time
- Use "Run Algorithm" instead of "Compare All"
- Reduce number of nodes/edges

---

## 📝 Version History

### v2.0 (Current)

- ✨ Added DLS (Depth-Limited Search)
- ✨ Depth limit configuration UI
- 🐛 Fixed Hill Climbing node counting
- 📊 Enhanced Performance Summary (shows all tied algorithms)
- 📚 Added comprehensive documentation

### v1.0

- Initial release with 8 algorithms
- Traffic simulation
- Graph editor
- Import/export functionality

---

## 🤝 Contributing

Feel free to:

- Report bugs
- Suggest features
- Improve documentation
- Add new algorithms
- Create better heuristics

---

## 📄 License

Educational use. Free to use for learning and teaching AI search algorithms.

---

## 👨‍💻 Author

Created as part of IT5431 - Essentials of Artificial Intelligence coursework.

---

## 🙏 Acknowledgments

- Sri Lanka Railways for the route inspiration
- Russell & Norvig's "Artificial Intelligence: A Modern Approach"
- All AI students learning search algorithms!

---

## 📞 Support

**Questions?** Check:

1. This README
2. `PERFORMANCE_SUMMARY_EXPLANATION.md` for detailed metrics explanation
3. `COMPARISON_ONE_WAY_ENABLED.md` for results with one-way traffic
4. `COMPARISON_ONE_WAY_DISABLED.md` for results without one-way traffic
5. Hover tooltips in the app
6. Algorithm Properties section for complexity info

---

**Happy Pathfinding! 🚂✨**

*Remember: In AI, as in life, sometimes the shortest path isn't always the most obvious one!*
