# 🚦 Algorithm Comparison - One-Way Traffic ENABLED

**Scenario**: Evening Peak Hour (5:45 PM - 7:30 PM) with One-Way Restrictions
**Traffic Multiplier**: ×2.0
**One-Way Restrictions**: ✅ ENABLED

**Context**: Nimal finished a client meeting in **Dehiwala** and must catch the **6:10 PM train to Maho** from either **Fort Station** or **Maradana Station**. If he **wants to catch a seat**, he will have to go to Fort Station (departure point); otherwise, he can catch the train from Maradana (en-route stop, standing only).

**Goal**: Catch the Maho train after a 5:45 PM finish in Dehiwala
**Trains**: Fort 6:10 PM (25-min deadline) | Maradana 6:12 PM (27-min deadline)

**🟢 Priority: If on-time certainty is the PRIORITY (standing OK) → Go to Maradana Station**

---

## 📊 Performance Summary

| Algorithm | Status | Path Cost | Nodes Expanded | Generated (Found) | Max Frontier (Memory) | Depth | Destination | Time Margin |
|-----------|--------|-----------|----------------|-------------------|-----------------------|-------|-------------|-------------|
| **BFS** | ❌ Missed | 36 min | 7 | 8 | 4 | 2 | Fort Station | -11 min |
| **DFS** | ✅ Caught | 24 min | 5 | 7 | 4 | 3 | Fort Station | +1 min |
| **DLS** | ✅ Caught | 17 min | 8 | 8 | 4 | 3 | Maradana Station | +10 min |
| **IDDFS** | ❌ Missed | 36 min | 17 | 17 | 3 | 2 | Fort Station | -11 min |
| **UCS** | ✅ Caught | 13 min | 7 | 8 | 4 | 2 | Maradana Station | +14 min |
| **Greedy** | ✅ Caught | 13 min | 3 | 6 | 4 | 2 | Maradana Station | +14 min |
| **A*** | ✅ Caught | 13 min | 3 | 6 | 4 | 2 | Maradana Station | +14 min |
| **Bidirectional** | ❌ Missed | ∞ | 0 | - | - | - | None | -Infinity |
| **Hill Climbing** | ✅ Caught | 13 min | 3 | 8 | 1 | 2 | Maradana Station | +14 min |

---

## 🏆 Key Insights

### ✅ **Success Rate**: 55.6% (5 out of 9 algorithms)

### 🥇 **Fastest Path** (Successful algorithms): 13 minutes ⚡
**Found by**: UCS, Greedy, A*, Hill Climbing (all to Maradana)

### ⚡ **Most Efficient**: 3 nodes expanded
**Achieved by**: Greedy, A*, Hill Climbing

### ❌ **Failed Algorithms**:
- **BFS**: Tried Fort route (36 min), missed by -11 min ❌
- **IDDFS**: Tried Fort route (36 min), missed by -11 min ❌
- **Bidirectional**: Does not work well with multi-goal scenarios

### ⚠️ **Risky Success**:
- **DFS**: Fort route (24 min, +1 margin) - Very tight! Only barely caught the train

### 💡 **Key Finding**:
**With one-way restrictions enabled**, Fort Station routes become significantly slower (36 min for BFS/IDDFS, 24 min for DFS). **Maradana Station (13 min) is the clear winner** for on-time certainty.

---

## 🛤️ Optimal Path

### **For ON-TIME CERTAINTY (Maradana Station)** - 13 minutes (Fastest & Safest) ⚡

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

### **For SEAT (Fort Station)** - NOT RECOMMENDED with one-way enabled ❌

- **BFS/IDDFS**: 36 min → **Missed** by -11 min ❌
- **DFS**: 24 min → Caught with +1 margin ⚠️ (Too risky!)

**Conclusion**: With one-way restrictions, **Fort Station is not feasible** for most algorithms. **Maradana is the only reliable choice**.

---

## 📈 Algorithm Analysis

### **BFS (Breadth-First Search)**
- ❌ **Missed train**: 36 min to Fort, -11 margin
- 🔍 **Nodes expanded**: 7 | Generated: 8 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: One-way restrictions made Fort route much longer
- 🎯 **Use case**: **NOT suitable with one-way enabled** - misses deadline
- ⏱️ **Efficiency**: Failed due to route constraints

### **DFS (Depth-First Search)**
- ✅ **Caught train (barely)**: 24 min to Fort, +1 margin ⚠️
- 🔍 **Nodes expanded**: 5 | Generated: 7 | Max Frontier: 4 | Depth: 3
- 📝 **Notes**: Found Fort route with very tight margin
- 🎯 **Use case**: **Too risky** - only +1 min buffer, any delay = missed train
- ⏱️ **Efficiency**: Memory efficient but dangerously tight deadline

### **DLS (Depth-Limited Search)**
- ✅ **Caught train**: 17 min to Maradana, +10 margin
- 🔍 **Nodes expanded**: 8 | Generated: 8 | Max Frontier: 4 | Depth: 3
- 📝 **Notes**: Depth limit led to Maradana route (shorter depth)
- 🎯 **Use case**: **Backup option** - reasonable safety margin
- ⏱️ **Efficiency**: Depends on depth setting, worked well here

### **IDDFS (Iterative Deepening DFS)**
- ❌ **Missed train**: 36 min to Fort, -11 margin
- 🔍 **Nodes expanded**: 17 | Generated: 17 | Max Frontier: 3 | Depth: 2
- 📝 **Notes**: Found same slow Fort route as BFS
- 🎯 **Use case**: **NOT suitable with one-way enabled**
- ⏱️ **Efficiency**: Low memory but failed deadline

### **UCS (Uniform Cost Search)**
- ✅ **Caught train**: 13 min to Maradana, +14 margin ⚡
- 🔍 **Nodes expanded**: 7 | Generated: 8 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Correctly identified Maradana as lowest-cost route
- 🎯 **Use case**: **Excellent for TIME priority** - guaranteed optimal
- ⏱️ **Efficiency**: Very good balance

### **Greedy Best-First Search**
- ✅ **Caught train**: 13 min to Maradana, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 6 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Heuristic-guided search found fastest route
- 🎯 **Use case**: **Fast for TIME priority** - works due to convergence
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

### **A* Search**
- ✅ **Caught train**: 13 min to Maradana, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 6 | Max Frontier: 4 | Depth: 2
- 📝 **Notes**: Optimal balance of g(n) + h(n)
- 🎯 **Use case**: **BEST for TIME priority** - optimal AND efficient
- 🏆 **Recommended**: Best overall choice
- ⏱️ **Efficiency**: Excellent (tied for most efficient)

### **Bidirectional Search**
- ❌ **Failed**: Implementation limitation with multi-goal scenarios
- 🔍 **Nodes expanded**: 0
- 📝 **Notes**: Not designed for multi-goal problems
- 💡 **Limitation**: Not suitable for this scenario

### **Hill Climbing**
- ✅ **Caught train**: 13 min to Maradana, +14 margin ⚡
- 🔍 **Nodes expanded**: 3 | Generated: 8 | Max Frontier: 1 | Depth: 2
- 📝 **Notes**: Lowest memory (frontier=1), found optimal route
- 🎯 **Use case**: **Fast for TIME priority** - worked here
- ⏱️ **Efficiency**: Excellent (tied for most efficient)
- ⚠️ **Warning**: No guarantee, but works when paths converge

---

## 🎯 Recommendations

### **⏱️ For ON-TIME CERTAINTY (Maradana Station, standing OK)**:

#### **Best Choice**: A* Search ⭐
- ✅ **Guaranteed optimal**: 13 min, +14 margin
- ✅ **Highly efficient**: Only 3 nodes expanded
- ✅ **Reliable** with one-way restrictions
- 🏆 **BEST OVERALL CHOICE**

#### **Runner-Up**: UCS (Uniform Cost Search)
- ✅ Guaranteed optimal: 13 min, +14 margin
- ✅ Good efficiency: 7 nodes expanded
- ✅ No heuristic required
- ✅ Reliable

#### **Fastest Execution**: Greedy Best-First or Hill Climbing
- ✅ Only 3 nodes expanded
- ✅ Very fast: 13 min, +14 margin
- ⚠️ Not always optimal (worked here)
- **Acceptable here** because all converge to Maradana

#### **Backup**: DLS
- ✅ 17 min, +10 margin (still good)
- Reasonable backup option

---

### **🪑 For SEAT (Fort Station) - NOT RECOMMENDED ❌**:

#### **Fort Station is NOT FEASIBLE with one-way traffic enabled**:
- ❌ **BFS**: 36 min, missed by -11 min
- ❌ **IDDFS**: 36 min, missed by -11 min
- ⚠️ **DFS**: 24 min, +1 margin (too risky - any delay = missed train)

#### **Recommendation**:
**If you MUST have a seat**, you need to **disable one-way restrictions** or consider alternative transportation. With one-way enabled, **Maradana (standing) is the ONLY reliable option**.

---

### **❌ Avoid**: Bidirectional
- **Bidirectional**: Limited to single-goal problems

---

## 💡 Impact of One-Way Restrictions

### **Critical Finding**:

With one-way traffic enabled, **the decision is clear**:

| Priority | Without One-Way | With One-Way (Current) |
|----------|----------------|------------------------|
| **SEAT (Fort)** | ✅ Feasible: 20 min, BFS/IDDFS | ❌ Not feasible: 36 min (missed) or 24 min (too risky) |
| **TIME (Maradana)** | ✅ Best: 13 min, A* | ✅ Best: 13 min, A* (SAME) |

### **Key Differences**:

1. **Fort Station routes are severely impacted** by one-way restrictions:
   - Without: 20-24 min (feasible)
   - With: 24-36 min (mostly infeasible)

2. **Maradana route is unaffected**:
   - Same 13 min path regardless of one-way status
   - Always the fastest and safest option

3. **Algorithm success rates drop** with one-way:
   - Without one-way: 88.9% success (8/9)
   - With one-way: 55.6% success (5/9)

4. **BFS and IDDFS fail** with one-way enabled:
   - They find Fort routes that violate deadlines
   - They don't adapt to one-way costs well

### **Conclusion**:
**One-way restrictions FORCE the decision to Maradana Station**. If you need certainty, Maradana is the only choice. If you need a seat, you must either:
- Accept DFS's risky +1 min margin, OR
- Disable one-way restrictions, OR
- Use alternative transportation

---

## 📚 Learning Takeaways

1. **A* remains the best** - optimal AND efficient in both scenarios
2. **One-way restrictions dramatically change feasibility** - Fort becomes mostly infeasible
3. **Informed search adapts better** - A*, UCS, Greedy all found Maradana route
4. **Un informed search fails** - BFS/IDDFS tried Fort and missed deadline
5. **DFS is unpredictable** - Sometimes finds tighter routes, but too risky
6. **Context matters** - Same graph, different constraints = different optimal strategies
7. **Real-world constraints are critical** - Traffic rules can eliminate entire options

---

## ✅ Conclusion

**With one-way restrictions enabled**:
- ✅ **Maradana Station is the ONLY reliable choice** (13 min, +14 margin)
- ✅ **A* is the BEST algorithm** - optimal, efficient, reliable
- ❌ **Fort Station is NOT feasible** for most algorithms (36 min, missed)
- ⚠️ **DFS can reach Fort** but with dangerous +1 min margin (too risky)

**Summary**:
- **Seat-first**: NOT POSSIBLE with one-way enabled (use Maradana, standing)
- **Time-first**: Maradana via A* (or UCS); Greedy/Hill Climbing acceptable because all converge to same path

**Final Recommendation**: **Use A* to reach Maradana Station** - it's fast (13 min), safe (+14 margin), optimal, and efficient (3 nodes).

---

**Test Configuration**:
- Start: Dehiwala
- Goals: Fort Station (25 min), Maradana Station (27 min)
- Traffic: Evening Peak (×2.0 multiplier)
- One-Way: ✅ ENABLED
- DLS Depth Limit: 3 (default)
