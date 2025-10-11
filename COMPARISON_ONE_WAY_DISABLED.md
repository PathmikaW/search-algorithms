# 🚗 Algorithm Comparison - One-Way Traffic DISABLED

**Scenario**: Evening Peak Hour (5:45 PM - 7:30 PM) without One-Way Restrictions
**Traffic Multiplier**: ×2.0
**One-Way Restrictions**: ❌ DISABLED

---

## 📊 Performance Summary

| Algorithm | Status | Path Cost | Nodes Expanded | Destination | Optimal | Time Margin |
|-----------|--------|-----------|----------------|-------------|---------|-------------|
| **BFS** | ✅ Caught | 11 min | 8 nodes | Fort | ⭐ Yes | +14 min |
| **DFS** | ✅ Caught | 15 min | 5 nodes | Maradana | No | +12 min |
| **DLS** | ❌ Missed | - | 3 nodes | - | No | - |
| **IDDFS** | ✅ Caught | 11 min | 12 nodes | Fort | ⭐ Yes | +14 min |
| **UCS** | ✅ Caught | 11 min | 7 nodes | Fort | ⭐ Yes | +14 min |
| **Greedy** | ✅ Caught | 11 min | 4 nodes | Fort | ⭐ Yes | +14 min |
| **A*** | ✅ Caught | 11 min | 4 nodes | Fort | ⭐ Yes | +14 min |
| **Bidirectional** | ❌ Missed | - | 0 nodes | - | No | - |
| **Hill Climbing** | ✅ Caught | 11 min | 4 nodes | Fort | ⭐ Yes | +14 min |

---

## 🏆 Key Insights

### ✅ **Success Rate**: 77.8% (7 out of 9 algorithms)

### 🥇 **Fastest Path**: 11 minutes ⚡
**Found by**: BFS, IDDFS, UCS, Greedy, A*, Hill Climbing

### ⚡ **Most Efficient**: 4 nodes expanded
**Achieved by**: Greedy, A*, Hill Climbing

### ❌ **Failed Algorithms**:
- **DLS**: Failed due to depth limit (default: 3 nodes) - solution path requires 4 nodes
- **Bidirectional**: Does not work well with multi-goal scenarios

---

## 🛤️ Optimal Path (11 minutes)

```
Dehiwala (Start)
    ↓ (5 min)
Borella
    ↓ (2 min)
Union Place
    ↓ (4 min)
Fort Station (Goal) ✅
```

**Total**: 5 + 2 + 4 = **11 minutes**
**Deadline**: 25 minutes (Fort)
**Arrived**: 14 minutes early ✅

---

## 📈 Algorithm Analysis

### **BFS (Breadth-First Search)**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 8
- 📝 **Notes**: Explores all nodes level-by-level, guarantees shortest path
- ⏱️ **Efficiency**: Moderate (expands more nodes than informed search)

### **DFS (Depth-First Search)**
- ✅ **Found path**: 15 min (sub-optimal)
- 🔍 **Nodes expanded**: 5
- 📝 **Notes**: Found longer route via Maradana instead of Fort
- ⏱️ **Efficiency**: Not optimal, but memory efficient

### **DLS (Depth-Limited Search)**
- ❌ **Failed**: Could not find solution within depth limit
- 🔍 **Nodes expanded**: 3
- 📝 **Notes**: Depth limit of 3 is insufficient (optimal path needs 4 nodes)
- 💡 **Fix**: Increase depth limit to 4 or higher

### **IDDFS (Iterative Deepening DFS)**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 12
- 📝 **Notes**: Iteratively searches with increasing depths until solution found
- ⏱️ **Efficiency**: Expands most nodes due to repeated searches, but guarantees optimality

### **UCS (Uniform Cost Search)**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 7
- 📝 **Notes**: Expands nodes in order of path cost, always optimal
- ⏱️ **Efficiency**: Good - balances optimality with reasonable node expansion

### **Greedy Best-First Search**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 4 ⚡
- 📝 **Notes**: Uses heuristic to guide search directly to goal
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- 🎯 **Lucky**: Heuristic led to optimal path this time

### **A* Search**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 4 ⚡
- 📝 **Notes**: Perfect balance of actual cost g(n) and heuristic h(n)
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- 🏆 **Recommended**: Best overall - optimal AND efficient

### **Bidirectional Search**
- ❌ **Failed**: Implementation limitation with multi-goal scenarios
- 🔍 **Nodes expanded**: 0
- 📝 **Notes**: Designed for single source-goal pairs
- 💡 **Limitation**: Not suitable for this multi-goal problem

### **Hill Climbing**
- ✅ **Found optimal path**: 11 min
- 🔍 **Nodes expanded**: 4 ⚡
- 📝 **Notes**: Greedy local search worked perfectly here
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- ⚠️ **Warning**: Can get stuck in local optima (didn't happen here)

---

## 🎯 Recommendations

### **Best Choice**: A* Search ⭐
- **Guaranteed optimal** solution
- **Highly efficient** (only 4 nodes expanded)
- **Reliable** across different scenarios
- **Industry standard** for pathfinding

### **Runner-Up**: UCS (Uniform Cost Search)
- Guaranteed optimal
- Good efficiency (7 nodes)
- No heuristic required
- Reliable and straightforward

### **Fastest Execution**: Greedy Best-First or Hill Climbing
- Only 4 nodes expanded
- Very fast
- ⚠️ **Caveat**: Not always optimal (worked well here due to good heuristic)

### **For Learning**: BFS and IDDFS
- Both guarantee optimality
- BFS: Simple, intuitive
- IDDFS: Memory efficient variant
- Good for understanding fundamentals

### **Avoid**: DLS and Bidirectional
- **DLS**: Requires knowing solution depth beforehand
- **Bidirectional**: Limited to single-goal problems

---

## 💡 Impact of Removing One-Way Restrictions

### Key Differences vs One-Way Enabled:

| Metric | One-Way Disabled | One-Way Enabled | Difference |
|--------|------------------|-----------------|------------|
| **Optimal Path Cost** | 11 min | 13 min | **2 min faster** ⚡ |
| **Preferred Destination** | Fort Station | Maradana Station | Different goals |
| **Optimal Path** | Dehiwala → Borella → Union Place → Fort | Dehiwala → Borella → Maradana | Shorter route |
| **Success Rate** | 77.8% | 77.8% | Same |
| **Min Nodes (Best)** | 4 | 3 | Slightly more |
| **Max Nodes (IDDFS)** | 12 | 8 | More exploration |

### Why Fort Station is Better Without Restrictions:

1. ✅ **Shorter path available**: Borella → Union Place → Fort (11 min total)
2. ✅ **No one-way penalties**: Can use all routes freely
3. ✅ **Better connectivity**: More path options to explore
4. ✅ **Tighter deadline acceptable**: 25 min is enough (arrive 14 min early)

### Route Comparison:

**Without One-Way** (11 min):
```
Dehiwala → Borella → Union Place → Fort
   5 min      2 min        4 min
```

**With One-Way** (13 min):
```
Dehiwala → Borella → Maradana
   5 min      8 min
```

**Savings**: 2 minutes faster without restrictions!

---

## 📚 Learning Takeaways

1. **One-way restrictions impact route choice** - Fort becomes optimal when all routes are available
2. **A* remains the best** - optimal and efficient in both scenarios
3. **Informed search is superior** - A*, Greedy, Hill Climbing expand fewer nodes
4. **Path cost matters** - 11 min vs 13 min shows value of unrestricted routes
5. **Heuristics guide efficiently** - Only 4 nodes needed vs 8-12 for uninformed search
6. **DLS needs tuning** - Must set depth ≥ solution depth (4 in this case)
7. **Real-world constraints change solutions** - Traffic rules significantly affect optimal paths

---

## 🔍 Detailed Comparison

### Uninformed vs Informed Search:

**Uninformed (No heuristic)**:
- BFS: 8 nodes → Optimal ✅
- DFS: 5 nodes → Sub-optimal ❌
- IDDFS: 12 nodes → Optimal ✅ (but expensive)

**Informed (Uses heuristic)**:
- Greedy: 4 nodes → Optimal ✅ (lucky)
- A*: 4 nodes → Optimal ✅ (guaranteed)
- Hill Climbing: 4 nodes → Optimal ✅ (lucky)

**Winner**: Informed search (50-67% fewer nodes expanded!)

---

**Test Configuration**:
- Start: Dehiwala
- Goals: Fort Station (25 min), Maradana Station (27 min)
- Traffic: Evening Peak (×2.0 multiplier)
- One-Way: ❌ DISABLED
- DLS Depth Limit: 3 (default)

---

## ✅ Conclusion

Removing one-way restrictions:
- ✅ Enables **faster routes** (11 min vs 13 min)
- ✅ Changes **optimal destination** (Fort vs Maradana)
- ✅ Allows **more flexibility** in path planning
- ✅ **A* still wins** - optimal and efficient in all conditions!
