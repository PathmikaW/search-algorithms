# 🚗 Algorithm Comparison - One-Way Traffic DISABLED

**Scenario**: Evening Peak Hour (5:45 PM - 7:30 PM) without One-Way Restrictions
**Traffic Multiplier**: ×2.0
**One-Way Restrictions**: ❌ DISABLED

**Context**: Nimal finished a client meeting in **Dehiwala** and must catch the **6:10 PM train to Maho** from either **Fort Station** or **Maradana Station**. If he **wants to catch a seat**, he will have to go to Fort Station (departure point); otherwise, he can catch the train from Maradana (en-route stop, standing only).

**Goal**: Catch the Maho train after a 5:45 PM finish in Dehiwala
**Trains**: Fort 6:10 PM (25-min deadline) | Maradana 6:12 PM (27-min deadline)

**🟡 Priority: If a seat is REQUIRED → Go to Fort Station**

---

## 📊 Performance Summary

| Algorithm | Status | Path Cost | Nodes Expanded | Generated (Found) | Max Frontier (Memory) | Depth | Destination | Time Margin |
|-----------|--------|-----------|----------------|-------------------|-----------------------|-------|-------------|-------------|
| **BFS** | ✅ Caught | 20 min | 7 | 8 | 4 | 2 | Fort Station | +5 min |
| **DFS** | ✅ Caught | 24 min | 5 | 7 | 4 | 3 | Fort Station | +1 min |
| **DLS** | ✅ Caught | 17 min | 8 | 8 | 4 | 3 | Maradana Station | +10 min |
| **IDDFS** | ✅ Caught | 20 min | 17 | 17 | 3 | 2 | Fort Station | +5 min |
| **UCS** | ✅ Caught | 13 min | 7 | 8 | 4 | 2 | Maradana Station | +14 min |
| **Greedy** | ✅ Caught | 13 min | 3 | 6 | 4 | 2 | Maradana Station | +14 min |
| **A*** | ✅ Caught | 13 min | 3 | 6 | 4 | 2 | Maradana Station | +14 min |
| **Bidirectional** | ❌ Missed | ∞ | 0 | - | - | - | None | -Infinity |
| **Hill Climbing** | ✅ Caught | 13 min | 3 | 8 | 1 | 2 | Maradana Station | +14 min |

---

## 🏆 Key Insights

### ✅ **Success Rate**: 88.9% (8 out of 9 algorithms)

### 🥇 **Fastest Path** (All successful algorithms): 13 minutes ⚡
**Found by**: UCS, Greedy, A*, Hill Climbing (all to Maradana)

### 🎯 **Fort Station Routes** (Seat Priority): 20-24 minutes
**Found by**: BFS (20 min, +5 margin), IDDFS (20 min, +5 margin), DFS (24 min, +1 margin - tight!)

### ⚡ **Most Efficient**: 3 nodes expanded
**Achieved by**: Greedy, A*, Hill Climbing

### ❌ **Failed Algorithms**:
- **Bidirectional**: Does not work well with multi-goal scenarios

### 💡 **Decision Making**:
- **For SEAT** (Fort Station): Use BFS or IDDFS for safer buffer (20 min, +5 margin). DFS works but risky (24 min, +1 margin).
- **For TIME** (Maradana Station): Use A*/UCS (optimal) or Greedy/Hill Climbing (fast). All find 13 min path with +14 margin.

---

## 🛤️ Optimal Paths

### **For SEAT (Fort Station)** - 20 minutes (Feasible)

**Best Algorithms**: BFS, IDDFS

```
Dehiwala (Start)
    ↓
Wellawatte
    ↓
Bambalapitiya
    ↓
Kollupitiya
    ↓
Fort Station (Goal) ✅
```

**Total**: **20 minutes**
**Deadline**: 25 minutes (Fort)
**Margin**: +5 minutes ✅ (Safer buffer)

**Alternative (DFS)**: 24 minutes, +1 margin (tight, use only if needed) ⚠️

### **For TIME (Maradana Station)** - 13 minutes (Fastest & Safest)

**Best Algorithms**: A*, UCS, Greedy, Hill Climbing

```
Dehiwala (Start)
    ↓
Borella
    ↓
Maradana Station (Goal) ✅
```

**Total**: **13 minutes**
**Deadline**: 27 minutes (Maradana)
**Margin**: +14 minutes ✅ (Excellent safety margin!)

---

## 📈 Algorithm Analysis

### **BFS (Breadth-First Search)**
- ✅ **Found path to Fort**: 20 min, +5 margin
- 🔍 **Nodes expanded**: 7 | Generated: 8 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Explores level-by-level, found Fort Station route
- 🎯 **Use case**: **Good for SEAT priority** - safe +5 min buffer
- ⏱️ **Efficiency**: Moderate

### **DFS (Depth-First Search)**
- ✅ **Found path to Fort**: 24 min, +1 margin ⚠️
- 🔍 **Nodes expanded**: 5 | Generated: 7 | Max Frontier: 4 | Depth: 3
- 📝 **Notes**: Found Fort route but with very tight margin
- 🎯 **Use case**: **Only if needed for SEAT** - risky +1 min buffer
- ⏱️ **Efficiency**: Memory efficient but not optimal, tight deadline

### **DLS (Depth-Limited Search)**
- ✅ **Found path to Maradana**: 17 min, +10 margin
- 🔍 **Nodes expanded**: 8 | Generated: 8 | Max Frontier: 4 | Depth: 3
- 📝 **Notes**: With depth limit of 3, found Maradana route
- 🎯 **Use case**: **Backup option** for time priority
- ⏱️ **Efficiency**: Reasonable, depends on depth limit setting

### **IDDFS (Iterative Deepening DFS)**
- ✅ **Found path to Fort**: 20 min, +5 margin
- 🔍 **Nodes expanded**: 17 | Generated: 17 | Max Frontier: 3 | Depth: 2
- 📝 **Notes**: Iteratively searches with increasing depths
- 🎯 **Use case**: **Good for SEAT priority** - safe +5 min buffer
- ⏱️ **Efficiency**: Expands most nodes but low memory, guarantees optimality

### **UCS (Uniform Cost Search)**
- ✅ **Found path to Maradana**: 13 min, +14 margin ⚡
- 🔍 **Nodes expanded**: 7 | Generated: 8 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Expands nodes by path cost, always optimal
- 🎯 **Use case**: **Excellent for TIME priority** - guaranteed optimal
- ⏱️ **Efficiency**: Very good - balances optimality with efficiency

### **Greedy Best-First Search**
- ✅ **Found path to Maradana**: 13 min, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 6 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Uses heuristic to guide search directly
- 🎯 **Use case**: **Fast for TIME priority** - but no guarantee (worked here)
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

### **A* Search**
- ✅ **Found path to Maradana**: 13 min, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 6 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Perfect balance of actual cost g(n) and heuristic h(n)
- 🎯 **Use case**: **BEST for TIME priority** - optimal AND efficient
- 🏆 **Recommended**: Best overall choice
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

### **Bidirectional Search**
- ❌ **Failed**: Implementation limitation with multi-goal scenarios
- 🔍 **Nodes expanded**: 0
- 📝 **Notes**: Designed for single source-goal pairs
- 💡 **Limitation**: Not suitable for this multi-goal problem

### **Hill Climbing**
- ✅ **Found path to Maradana**: 13 min, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 8 | Max Frontier: 1 | Depth: 2
- 📝 **Notes**: Greedy local search, lowest memory usage (frontier=1)
- 🎯 **Use case**: **Fast for TIME priority** - but can get stuck (worked here)
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- ⚠️ **Warning**: No optimality guarantee

---

## 🎯 Recommendations

### **🪑 If SEAT is REQUIRED (Fort Station)**:

#### **Best Choice**: BFS or IDDFS
- ✅ **Both find**: 20 min path with +5 min buffer (safe)
- ✅ **BFS**: Simpler, 7 nodes expanded
- ✅ **IDDFS**: Memory efficient (frontier=3), 17 nodes expanded
- 🏆 **Recommendation**: Use **BFS** for simplicity and safety

#### **Avoid**: DFS
- ⚠️ **DFS**: 24 min, +1 min margin (too tight, risky!)
- Only use if absolutely necessary

---

### **⏱️ If ON-TIME CERTAINTY is PRIORITY (Maradana Station, standing OK)**:

#### **Best Choice**: A* Search ⭐
- ✅ **Guaranteed optimal**: 13 min, +14 margin
- ✅ **Highly efficient**: Only 3 nodes expanded
- ✅ **Reliable** across different scenarios
- 🏆 **BEST OVERALL CHOICE**

#### **Runner-Up**: UCS (Uniform Cost Search)
- ✅ Guaranteed optimal: 13 min, +14 margin
- ✅ Good efficiency: 7 nodes expanded
- ✅ No heuristic required
- ✅ Reliable and straightforward

#### **Fastest Execution**: Greedy Best-First or Hill Climbing
- ✅ Only 3 nodes expanded
- ✅ Very fast: 13 min, +14 margin
- ⚠️ **Caveat**: Not always optimal (worked well here due to good heuristic and convergence to same path)
- **Acceptable here** because all converge to the same best path

#### **Backup**: DLS
- ✅ 17 min, +10 margin (still good)
- Reasonable option if depth limit is set appropriately

---

### **❌ Avoid**: Bidirectional
- **Bidirectional**: Limited to single-goal problems, doesn't work for this scenario

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
