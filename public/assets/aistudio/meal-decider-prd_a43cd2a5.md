# PRD: Meal Decider (v0.1)

**Owner:** Victor
**Status:** Draft
**Date:** October 23, 2026
**Type:** Personal tool, single user, two-week test

---

## 1. Problem

I can't decide what to cook each day. When I can't decide, I either order food or eat the same meal again. Both are the lowest-effort fallback, not real choices. Three things make it worse:

- Deciding when I'm already hungry and tired
- Prepping ingredients feels like too much work
- Cooking alone with no one around kills the motivation

I'm also trying to avoid bread and noodles, which are the usual lazy-day defaults, so I need replacements that are just as easy.

## 2. Goal

Replace "order or repeat" with a fast, low-effort default that I pick from my own meal list.

**Main goal:** cook more and order less over a two-week test.

**What this tool must do:**
1. Give me one meal in under 10 seconds.
2. Match the meal to how much energy I have.
3. Avoid what I ate recently.
4. Let me log what I actually did, including ordering.

## 3. Non-goals (v0.1)

- Recipes or cooking instructions
- Shopping lists
- Batch cooking planner (this is v0.2, if the test works)
- Calorie or nutrition tracking
- Accounts, login, sharing, or a backend
- Photos
- Notifications

## 4. User

One user: me. Mostly on my phone, usually around mealtime. I'm hungry, a bit tired, and want an answer fast.

## 5. Key concepts

**Effort tag.** Every meal has exactly one:
- **Minimum:** about 10 minutes, one pan, almost no prep
- **Normal:** a regular cooked meal
- **Batch:** a big cook that makes several portions

**Energy level.** What I pick each time I ask for a meal:
- **Lazy:** show minimum meals only
- **Okay:** show minimum and normal
- **Motivated:** show all, including batch

## 6. User stories

1. As a user, I can add a meal with a name and an effort tag, so the tool reflects what I actually eat.
2. As a user, I can edit or delete a meal, so the list stays honest.
3. As a user, I tell the tool my energy level and get one meal, so I don't have to browse.
4. As a user, I can reject a suggestion and get another, so I'm not stuck with something I don't want.
5. As a user, I can log "I ate this," so the tool stops repeating it too soon.
6. As a user, I can log "I ordered food," so I can see how often I fall back.
7. As a user, I can see a simple summary of the last 14 days, so I know whether this is working.

## 7. Functional requirements

### P0 (must have)

| ID | Requirement |
|----|-------------|
| F1 | Meal list: add, edit, delete. Fields: name (required), effort tag (required), notes (optional, one line). |
| F2 | Adding a meal takes under 20 seconds: one text field, one tag choice, one save button. |
| F3 | Home screen has three energy buttons: Lazy, Okay, Motivated. Tapping one returns one meal. |
| F4 | Selection follows the rules in section 8. |
| F5 | "Not this one" button returns a different meal. Maximum 3 rejections per request, then show a message: "Pick one of these or order." and list the remaining matches. |
| F6 | "I'll cook this" logs the meal as eaten with today's date. |
| F7 | "I ordered food" button is always visible on the home screen and logs an order for today. |
| F8 | Data saves in the browser (localStorage) and survives refresh and closing the tab. |
| F9 | The tool ships with the seed list in section 10, all editable and deletable. |
| F10 | Works on a phone screen first, with large tap targets. |

### P1 (should have)

| ID | Requirement |
|----|-------------|
| F11 | 14-day summary: number of days I cooked, number of times I ordered, most eaten meal. |
| F12 | Export and import the data as a JSON file, so a cleared browser doesn't wipe the list. |
| F13 | Undo for the last log entry (if I tapped the wrong button). |

### P2 (later)

- Show a warning when the list has fewer than 3 minimum meals
- Suggest bringing back a meal I haven't eaten in 2+ weeks
- Batch cooking planner (v0.2)

## 8. Selection logic

When I tap an energy level:

1. Take all meals allowed for that energy level (see section 5).
2. Remove any meal logged as eaten in the last 2 days.
3. Remove any meal already rejected in this request.
4. Pick one at random from what's left.
5. If nothing is left after step 2, ignore the recency rule and pick from step 1 minus rejections.
6. If still nothing, tell me the list is empty for that level and link to the add-meal screen.

## 9. Data

```
Meal
  id
  name            (text)
  effort          (minimum | normal | batch)
  notes           (text, optional)
  createdAt

LogEntry
  id
  date            (YYYY-MM-DD)
  type            (cooked | ordered)
  mealId          (only if type = cooked)
```

Storage: one JSON object in localStorage with a `meals` array and a `log` array. Wrap all reads and writes in error handling, and show the seed list if storage is empty.

## 10. Seed list

Starter meals, all editable. None contain bread or noodles.

**Minimum**
- Boiled plantain and egg
- Yam and egg sauce
- Rice and fried egg
- Fried plantain and beans (from a batch)

**Normal**
- Jollof rice and chicken
- Fried rice and fish
- White rice and stew
- Beans and plantain
- Vegetable soup and swallow
- Moi moi and pap

**Batch**
- Big pot of stew (for rice and yam)
- Big pot of beans
- Pepper soup
- Egusi soup

## 11. Screens

1. **Home:** three energy buttons, the "I ordered food" button, link to meal list and summary.
2. **Suggestion:** the meal name, its tag, buttons for "I'll cook this" and "Not this one."
3. **Meal list:** all meals grouped by tag, with add, edit, delete.
4. **Summary:** the 14-day view (P1).

## 12. Success metrics

Measured over 14 days of use.

| Metric | Target |
|--------|--------|
| Days I opened the tool at mealtime | 10 or more out of 14 |
| Times I ordered food | Fewer than my current rate (note the current rate before starting) |
| Times I got a suggestion and cooked it | At least half of suggestions |
| Time from opening to a decision | Under 10 seconds |

Before day 1, write down roughly how many times a week I order now, so there's a real baseline.

## 13. Decision rules after the test

- **Ordering dropped and I used it most days:** keep it, build the batch cooking planner.
- **I used it but still ordered a lot:** the problem is cooking effort, not choosing. Focus on prep reduction and better minimum meals.
- **I mostly ignored it:** find out why before building more. It may be that I don't open it at the right time, so try a daily reminder.

## 14. Risks

| Risk | Mitigation |
|------|------------|
| The list fills up with meals that take too much effort | Force an effort tag on every meal; keep several minimum meals |
| I forget to log, so repeat-avoiding stops working | Logging is one tap; "I'll cook this" logs automatically |
| Browser data gets cleared | JSON export (F12) |
| I get bored of the seed list | Adding a meal is fast; review the list after week one |
| I order out of habit even with a suggestion | Treat it as data, not failure; the summary shows it |

## 15. Open questions

1. Should the recency window be 2 days or 3?
2. Does "okay" energy need a different set of meals than "motivated," or is the current split enough?
3. Should ordering ever be a suggested option on a planned night?

## 16. Out of scope for later

Batch cooking planner, weekly planning, shopping lists, a reminder at mealtime, and any sharing with friends for cooking together.
