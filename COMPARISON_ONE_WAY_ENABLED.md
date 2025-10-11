# 🚦 Algorithm Comparison - One-Way Traffic ENABLED

**Scenario**: Evening Peak Hour (5:45 PM - 7:30 PM) with One-Way Restrictions
**Traffic Multiplier**: ×2.0
**One-Way Restrictions**: ✅ ENABLED

---

## 📊 Performance Summary

| Algorithm | Status | Path Cost | Nodes Expanded | Destination | Optimal | Time Margin |
|-----------|--------|-----------|----------------|-------------|---------|-------------|
| **BFS** | ✅ Caught | 13 min | 6 nodes | Maradana | ⭐ Yes | +14 min |
| **DFS** | ✅ Caught | 15 min | 4 nodes | Maradana | No | +12 min |
| **DLS** | ❌ Missed | - | 2 nodes | - | No | - |
| **IDDFS** | ✅ Caught | 13 min | 8 nodes | Maradana | ⭐ Yes | +14 min |
| **UCS** | ✅ Caught | 13 min | 5 nodes | Maradana | ⭐ Yes | +14 min |
| **Greedy** | ✅ Caught | 13 min | 3 nodes | Maradana | ⭐ Yes | +14 min |
| **A*** | ✅ Caught | 13 min | 3 nodes | Maradana | ⭐ Yes | +14 min |
| **Bidirectional** | ❌ Missed | - | 0 nodes | - | No | - |
| **Hill Climbing** | ✅ Caught | 13 min | 3 nodes | Maradana | ⭐ Yes | +14 min |

---

## 🏆 Key Insights

### ✅ **Success Rate**: 77.8% (7 out of 9 algorithms)

### 🥇 **Fastest Path**: 13 minutes
**Found by**: BFS, IDDFS, UCS, Greedy, A*, Hill Climbing

### ⚡ **Most Efficient**: 3 nodes expanded
**Achieved by**: Greedy, A*, Hill Climbing

### ❌ **Failed Algorithms**:
- **DLS**: Failed due to depth limit (default: 3 nodes) - solution path is too deep
- **Bidirectional**: Does not work well with multi-goal scenarios

---

## 🛤️ Optimal Path (13 minutes)

```
Dehiwala (Start)
    ↓ (5 min)
Borella
    ↓ (8 min)
Maradana Station (Goal) ✅
```

**Total**: 5 + 8 = **13 minutes**
**Deadline**: 27 minutes (Maradana)
**Arrived**: 14 minutes early ✅

---

## 📈 Algorithm Analysis

### **BFS (Breadth-First Search)**
- ✅ **Found optimal path**: 13 min
- 🔍 **Nodes expanded**: 6
- 📝 **Notes**: Explores level-by-level, guarantees optimality for unweighted graphs
- ⏱️ **Efficiency**: Moderate (expands more nodes than informed search)

### **DFS (Depth-First Search)**
- ✅ **Found path**: 15 min (sub-optimal)
- 🔍 **Nodes expanded**: 4
- 📝 **Notes**: Goes deep first, found a longer route
- ⏱️ **Efficiency**: Memory efficient but not optimal

### **DLS (Depth-Limited Search)**
- ❌ **Failed**: Could not find solution within depth limit
- 🔍 **Nodes expanded**: 2
- 📝 **Notes**: Depth limit of 3 is too shallow for this scenario
- 💡 **Fix**: Increase depth limit to 3 or higher

### **IDDFS (Iterative Deepening DFS)**
- ✅ **Found optimal path**: 13 min
- 🔍 **Nodes expanded**: 8
- 📝 **Notes**: Combines BFS optimality with DFS memory efficiency
- ⏱️ **Efficiency**: Expands more nodes due to repeated searches at increasing depths

### **UCS (Uniform Cost Search)**
- ✅ **Found optimal path**: 13 min
- 🔍 **Nodes expanded**: 5
- 📝 **Notes**: Always expands cheapest path first, guaranteed optimal
- ⏱️ **Efficiency**: Good balance between optimality and efficiency

### **Greedy Best-First Search**
- ✅ **Found optimal path**: 13 min (lucky!)
- 🔍 **Nodes expanded**: 3 ⚡
- 📝 **Notes**: Uses heuristic only, very fast but not always optimal
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

### **A* Search**
- ✅ **Found optimal path**: 13 min
- 🔍 **Nodes expanded**: 3 ⚡
- 📝 **Notes**: Best of both worlds - optimal AND efficient
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- 🏆 **Recommended**: Best overall choice

### **Bidirectional Search**
- ❌ **Failed**: Implementation does not handle multi-goal scenarios well
- 🔍 **Nodes expanded**: 0
- 📝 **Notes**: Works best with single goal node
- 💡 **Limitation**: Not suitable for this scenario

### **Hill Climbing**
- ✅ **Found optimal path**: 13 min (lucky!)
- 🔍 **Nodes expanded**: 3 ⚡
- 📝 **Notes**: Local greedy search, can get stuck but worked well here
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

---

## 🎯 Recommendations

### **Best Choice**: A* Search ⭐
- Guarantees optimal solution
- Very efficient (only 3 nodes expanded)
- Works well with traffic conditions

### **Runner-Up**: UCS (Uniform Cost Search)
- Guaranteed optimal
- Good efficiency (5 nodes)
- No heuristic needed

### **Fastest**: Greedy Best-First or Hill Climbing
- Only 3 nodes expanded
- Very fast execution
- ⚠️ Not always optimal (worked this time by luck)

### **Avoid**: DLS and Bidirectional
- DLS needs depth tuning
- Bidirectional doesn't handle multi-goal well

---

## 💡 Impact of One-Way Restrictions

With one-way traffic enabled:
- ✅ All successful algorithms chose **Maradana Station** (27-min deadline)
- ✅ Avoided **Fort Station** routes (25-min deadline is tighter)
- ✅ One-way restrictions in Fort area made Maradana route more attractive
- ✅ Optimal path remains: **Dehiwala → Borella → Maradana** (13 min)

---

## 📚 Learning Takeaways

1. **A* is the gold standard** - optimal AND efficient
2. **Greedy can be lucky** - fast but not guaranteed optimal
3. **BFS guarantees optimal** - but expands more nodes than A*
4. **DLS needs tuning** - depth limit must match problem depth
5. **Informed search wins** - heuristics (A*, Greedy) are more efficient than uninformed (BFS, DFS)
6. **One-way restrictions matter** - they change route feasibility and costs

---

**Test Configuration**:
- Start: Dehiwala
- Goals: Fort Station (25 min), Maradana Station (27 min)
- Traffic: Evening Peak (×2.0 multiplier)
- One-Way: ✅ ENABLED
- DLS Depth Limit: 3 (default)
